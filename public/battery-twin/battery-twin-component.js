import { BatteryPackViewer } from "./battery3d.js";

export const BATTERY_TWIN_COMPONENT_VERSION = "1.0.0";

/**
 * Stable, application-facing facade for the battery digital-twin viewer.
 *
 * Keep this class as the only object imported by a host application. The
 * Three.js implementation and model assets can then change without requiring
 * changes to the host project's integration code.
 */
export class BatteryTwinComponent {
  constructor(options) {
    if (!options?.canvas || !options?.fallbackElement || !options?.definition) {
      throw new TypeError("canvas, fallbackElement and definition are required");
    }
    this.viewer = new BatteryPackViewer({
      ...options,
      assetBaseUrl: options.assetBaseUrl ?? new URL(".", import.meta.url),
    });
  }

  update(state, frame) {
    return this.viewer.update(state, frame);
  }

  setVisible(visible) {
    return this.viewer.setVisible(visible);
  }

  setView(view) {
    return this.viewer.setView(view);
  }

  toggleVehicle(force) {
    return this.viewer.toggleVehicle(force);
  }

  toggleCover(force) {
    return this.viewer.toggleCover(force);
  }

  toggleExploded(force) {
    return this.viewer.toggleExploded(force);
  }

  focusHotspot() {
    return this.viewer.focusHotspot();
  }

  selectModule(delta) {
    return this.viewer.selectModule(delta);
  }

  dispose() {
    return this.viewer.dispose();
  }
}

export function createBatteryTwinComponent(options) {
  return new BatteryTwinComponent(options);
}
