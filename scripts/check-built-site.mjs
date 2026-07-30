import fs from "node:fs"
import path from "node:path"
import process from "node:process"

const outputDirectory = path.resolve(process.argv[2] ?? "public")

if (!fs.existsSync(outputDirectory)) {
  console.error(
    `Build output not found at ${outputDirectory}. Run "npx quartz build" before checking it.`,
  )
  process.exit(1)
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(entryPath) : [entryPath]
  })
}

function decodeUrlPart(value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function candidatesFor(pathname) {
  if (pathname === "") {
    return ["index.html"]
  }

  if (pathname.endsWith("/")) {
    return [`${pathname}index.html`]
  }

  return [pathname, `${pathname}.html`, `${pathname}/index.html`]
}

const files = walk(outputDirectory)
const knownFiles = new Set(files.map((file) => path.relative(outputDirectory, file)))
const htmlFiles = files.filter((file) => file.endsWith(".html"))
const pages = new Map()

for (const file of htmlFiles) {
  const source = path.relative(outputDirectory, file)
  const html = fs.readFileSync(file, "utf8")
  const idCounts = new Map()

  for (const match of html.matchAll(/\bid\s*=\s*(["'])(.*?)\1/gi)) {
    const id = match[2]
    idCounts.set(id, (idCounts.get(id) ?? 0) + 1)
  }

  pages.set(source, {
    html,
    ids: new Set(idCounts.keys()),
    duplicateIds: [...idCounts].filter(([, count]) => count > 1).map(([id]) => id),
    h1Count: html.match(/<h1\b/gi)?.length ?? 0,
  })
}

function resolveTarget(pathname) {
  return candidatesFor(pathname).find((candidate) => knownFiles.has(candidate))
}

const brokenLinks = new Map()
const brokenFragments = new Map()
const duplicateIds = []
const headingErrors = []
const brokenIdReferences = []

for (const [source, page] of pages) {
  if (page.h1Count !== 1) {
    headingErrors.push({ source, count: page.h1Count })
  }

  for (const id of page.duplicateIds) {
    duplicateIds.push({ source, id })
  }

  for (const match of page.html.matchAll(
    /\b(aria-controls|aria-describedby|aria-labelledby)\s*=\s*(["'])(.*?)\2/gi,
  )) {
    const attribute = match[1].toLowerCase()
    const targets = match[3].trim().split(/\s+/).filter(Boolean)
    for (const target of targets) {
      if (!page.ids.has(target)) {
        brokenIdReferences.push({ source, attribute, target })
      }
    }
  }

  for (const match of page.html.matchAll(/\b(href|src)\s*=\s*(["'])(.*?)\2/gi)) {
    const attribute = match[1].toLowerCase()
    const target = match[3].trim()

    if (target === "" || target.startsWith("//") || /^[a-z][a-z\d+.-]*:/i.test(target)) {
      continue
    }

    const url = new URL(target, `https://wiki.local/${source}`)
    const pathname = decodeUrlPart(url.pathname).replace(/^\/+/, "")
    const resolvedTarget = resolveTarget(pathname)

    if (!resolvedTarget) {
      brokenLinks.set(`${source}\0${target}`, { source, target })
      continue
    }

    if (
      attribute !== "href" ||
      url.hash === "" ||
      url.hash === "#" ||
      !resolvedTarget.endsWith(".html")
    ) {
      continue
    }

    const fragment = decodeUrlPart(url.hash.slice(1))
    if (fragment.startsWith(":~:text=")) {
      continue
    }

    const targetPage = pages.get(resolvedTarget)
    if (targetPage && !targetPage.ids.has(fragment)) {
      brokenFragments.set(`${source}\0${target}\0${fragment}`, {
        source,
        target,
        resolvedTarget,
        fragment,
      })
    }
  }
}

let failed = false

if (brokenLinks.size > 0) {
  failed = true
  console.error(`Found ${brokenLinks.size} broken internal link(s):`)
  for (const { source, target } of brokenLinks.values()) {
    console.error(`- ${source} -> ${target}`)
  }
}

if (brokenFragments.size > 0) {
  failed = true
  console.error(`Found ${brokenFragments.size} broken section link(s):`)
  for (const { source, target, resolvedTarget, fragment } of brokenFragments.values()) {
    console.error(`- ${source} -> ${target} (${resolvedTarget} has no #${fragment})`)
  }
}

if (duplicateIds.length > 0) {
  failed = true
  console.error(`Found ${duplicateIds.length} duplicate HTML id(s):`)
  for (const { source, id } of duplicateIds) {
    console.error(`- ${source} -> #${id}`)
  }
}

if (headingErrors.length > 0) {
  failed = true
  console.error(`Found ${headingErrors.length} page(s) without exactly one <h1>:`)
  for (const { source, count } of headingErrors) {
    console.error(`- ${source} -> ${count} <h1> elements`)
  }
}

if (brokenIdReferences.length > 0) {
  failed = true
  console.error(`Found ${brokenIdReferences.length} broken ARIA id reference(s):`)
  for (const { source, attribute, target } of brokenIdReferences) {
    console.error(`- ${source} -> ${attribute}="#${target}"`)
  }
}

if (failed) {
  process.exit(1)
}

console.log(
  `Checked ${htmlFiles.length} HTML pages and ${files.length} generated files: links, section targets, element IDs, ARIA references, and heading outlines are valid.`,
)
