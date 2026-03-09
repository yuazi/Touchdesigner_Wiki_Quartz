import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/gardenBootOverlay.inline"
import style from "./styles/gardenBootOverlay.scss"

const GardenBootOverlay: QuartzComponent = () => {
  return <></>
}

GardenBootOverlay.css = style
GardenBootOverlay.afterDOMLoaded = script

export default (() => GardenBootOverlay) satisfies QuartzComponentConstructor
