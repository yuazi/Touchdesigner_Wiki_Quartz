import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { componentRegistry } from "./quartz/components/registry"
import LorenzBackground from "./quartz/components/LorenzBackground"
import GardenBootOverlay from "./quartz/components/GardenBootOverlay"

// Register custom components so their CSS/JS is injected into every page.
// They render nothing (empty fragments) but inject the Lorenz canvas and
// BIOS-style boot overlay via their afterDOMLoaded scripts.
componentRegistry.register("LorenzBackground", LorenzBackground, "local")
componentRegistry.register("GardenBootOverlay", GardenBootOverlay, "local")

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
