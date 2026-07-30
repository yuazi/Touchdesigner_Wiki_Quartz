import { h } from "preact"
import { QuartzComponent, QuartzComponentProps } from "./types"
import { StringResource } from "../util/resources"

const generatedListIdAttribute = /\bid=(["'])(list-\d+)\1/i
const classAttribute = /\bclass=(["'])(.*?)\1/i
const tagPattern = /<\/?[a-z][^>]*>/gi
const voidElements = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
])

type OpenElement = {
  name: string
  namespace?: string
}

function namespaceForClasses(classes: string[]): string | undefined {
  if (classes.includes("explorer") || classes.includes("explorer-ul")) return "explorer"
  if (classes.includes("backlinks")) return "backlinks"
  if (classes.includes("toc")) return "table-of-contents"
  return undefined
}

function rewriteTagId(tag: string, namespace: string): string {
  return tag.replace(generatedListIdAttribute, (_match, quote, id) => {
    return `id=${quote}${namespace}-${id}${quote}`
  })
}

function namespaceResource(resource: StringResource, namespace: string): StringResource {
  if (Array.isArray(resource)) {
    return resource.map((entry) => entry.replace(/\blist-(\d+)\b/g, `${namespace}-list-$1`))
  }

  return resource?.replace(/\blist-(\d+)\b/g, `${namespace}-list-$1`)
}

/**
 * Some community components generate generic IDs such as `list-0` in
 * module-local counters. Different plugins can therefore emit the same ID on
 * one page. Namespace those generated IDs at the host boundary so plugins can
 * remain independently versioned.
 */
export function namespaceGeneratedIds(
  component: QuartzComponent,
  namespace: string,
): QuartzComponent {
  const NamespacedComponent: QuartzComponent = (props: QuartzComponentProps) => {
    return h(component, props)
  }

  NamespacedComponent.displayName = component.displayName
  NamespacedComponent.css = component.css
  NamespacedComponent.beforeDOMLoaded = namespaceResource(component.beforeDOMLoaded, namespace)
  NamespacedComponent.afterDOMLoaded = namespaceResource(component.afterDOMLoaded, namespace)

  return NamespacedComponent
}

/**
 * Namespace generic generated IDs once all nested plugin components have
 * rendered. Tracking the open element stack lets us associate an overflow
 * list with its owning plugin without rewriting IDs in article content.
 */
export function namespaceRenderedGeneratedIds(html: string): string {
  const stack: OpenElement[] = []
  let result = ""
  let cursor = 0

  for (const match of html.matchAll(tagPattern)) {
    const offset = match.index
    const originalTag = match[0]
    const closingMatch = originalTag.match(/^<\/([a-z][\w:-]*)/i)

    result += html.slice(cursor, offset)

    if (closingMatch) {
      const name = closingMatch[1].toLowerCase()
      while (stack.length > 0) {
        const open = stack.pop()
        if (open?.name === name) break
      }
      result += originalTag
      cursor = offset + originalTag.length
      continue
    }

    const openingMatch = originalTag.match(/^<([a-z][\w:-]*)/i)
    if (!openingMatch) {
      result += originalTag
      cursor = offset + originalTag.length
      continue
    }

    const name = openingMatch[1].toLowerCase()
    const classes = originalTag.match(classAttribute)?.[2].split(/\s+/).filter(Boolean) ?? []
    const inheritedNamespace = stack.findLast((element) => element.namespace)?.namespace
    const namespace = namespaceForClasses(classes) ?? inheritedNamespace
    const rewrittenTag = namespace ? rewriteTagId(originalTag, namespace) : originalTag

    result += rewrittenTag
    cursor = offset + originalTag.length

    if (!voidElements.has(name) && !originalTag.endsWith("/>")) {
      stack.push({ name, namespace })
    }
  }

  result += html.slice(cursor)

  const tableOfContentsListId = result.match(/\bid=(["'])(table-of-contents-list-\d+)\1/i)?.[2]
  if (tableOfContentsListId) {
    result = result.replace(
      /\baria-controls=(["'])toc-\d+\1/i,
      `aria-controls="${tableOfContentsListId}"`,
    )
  }

  return result
}
