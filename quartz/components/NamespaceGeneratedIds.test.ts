import assert from "node:assert/strict"
import test, { describe } from "node:test"
import { h } from "preact"
import { render } from "preact-render-to-string"
import { QuartzComponent } from "./types"
import { namespaceGeneratedIds, namespaceRenderedGeneratedIds } from "./NamespaceGeneratedIds"

describe("namespaceGeneratedIds", () => {
  test("namespaces generated list IDs in component scripts", () => {
    const Component = (() => h("section", {})) as QuartzComponent
    Component.afterDOMLoaded = 'document.getElementById("list-0")'

    const Namespaced = namespaceGeneratedIds(Component, "explorer")

    assert.equal(Namespaced.afterDOMLoaded, 'document.getElementById("explorer-list-0")')
  })

  test("namespaces nested overflow lists according to their owning plugin", () => {
    const OverflowList = () => h("ul", { id: "list-0", class: "overflow" })
    const Page = () =>
      h(
        "main",
        {},
        h("div", { class: "explorer" }, h(OverflowList, {})),
        h("div", { class: "backlinks" }, h(OverflowList, {})),
      )
    const html = namespaceRenderedGeneratedIds(render(h(Page, {})))

    assert.match(html, /id="explorer-list-0"/)
    assert.match(html, /id="backlinks-list-0"/)
    assert.doesNotMatch(html, /\bid="list-0"/)
  })

  test("repairs a table of contents aria-controls target", () => {
    const Page = () =>
      h(
        "div",
        { class: "toc" },
        h("button", { "aria-controls": "toc-27" }, "Contents"),
        h("ul", { id: "list-0", class: "overflow" }),
      )
    const html = namespaceRenderedGeneratedIds(render(h(Page, {})))

    assert.match(html, /aria-controls="table-of-contents-list-0"/)
    assert.match(html, /id="table-of-contents-list-0"/)
  })

  test("does not rewrite generic IDs outside supported plugins", () => {
    const Page = () => h("article", {}, h("p", { id: "list-0" }, "Intentional content ID"))
    const html = namespaceRenderedGeneratedIds(render(h(Page, {})))

    assert.match(html, /id="list-0"/)
  })
})
