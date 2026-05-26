const GARDEN_BOOT_PRELOAD_SESSION_KEY = "gardenBooted"
const GARDEN_BOOT_PRELOAD_OVERLAY_ID = "garden-boot-overlay"

function shouldPreloadGardenBootOverlay() {
  try {
    return sessionStorage.getItem(GARDEN_BOOT_PRELOAD_SESSION_KEY) !== "true"
  } catch {
    return true
  }
}

if (shouldPreloadGardenBootOverlay() && !document.getElementById(GARDEN_BOOT_PRELOAD_OVERLAY_ID)) {
  const overlay = document.createElement("div")
  overlay.id = GARDEN_BOOT_PRELOAD_OVERLAY_ID
  overlay.style.cssText = [
    "position:fixed",
    "inset:0",
    "z-index:2147483647",
    "background-color:rgb(17, 17, 21)",
    "transition:background-color 500ms ease",
  ].join(";")

  document.documentElement.appendChild(overlay)
}
