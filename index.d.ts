declare module "*.scss" {
  const content: string
  export = content
}

declare module "d3-delaunay" {
  export class Delaunay<P> {
    static from<P>(points: Iterable<P>, fx?: (p: P) => number, fy?: (p: P) => number): Delaunay<P>
    triangles: Uint32Array
  }
}

// dom custom event
interface CustomEventMap {
  prenav: CustomEvent<{}>
  nav: CustomEvent<{ url: FullSlug }>
  themechange: CustomEvent<{ theme: "light" | "dark" }>
  readermodechange: CustomEvent<{ mode: "on" | "off" }>
  render: CustomEvent<{}>
}

type ContentIndex = Record<FullSlug, ContentDetails>
declare const fetchData: Promise<ContentIndex>
