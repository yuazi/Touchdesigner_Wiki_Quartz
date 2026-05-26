import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import preloadScript from "./scripts/gardenBootOverlay.preload.inline"
// @ts-ignore
import script from "./scripts/gardenBootOverlay.inline"
import style from "./styles/gardenBootOverlay.scss"

const GardenBootOverlay: QuartzComponent = () => {
  return <></>
}

GardenBootOverlay.css = style
GardenBootOverlay.beforeDOMLoaded = preloadScript
GardenBootOverlay.afterDOMLoaded = script

export default (() => GardenBootOverlay) satisfies QuartzComponentConstructor
