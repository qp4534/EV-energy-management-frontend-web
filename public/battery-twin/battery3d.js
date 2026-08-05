import * as THREE from "./vendor/three.module.min.js";
import { GLTFLoader } from "./vendor/GLTFLoader.js";

const RISK_COLORS = ["#28c9ad", "#ffd166", "#ff944d", "#ff5263"];
const RISK_LABELS = ["정상", "주의", "경고", "위험"];
const CELL_WIDTH = 0.48;
const CELL_HEIGHT = 0.58;
const CELL_DEPTH = 0.48;
const MODULE_WIDTH = 2.34;
const MODULE_DEPTH = 1.25;
const MODULE_GAP_X = 0.28;
const MODULE_GAP_Z = 0.30;
// The cell layout is intentionally enlarged in the battery-only view. When the
// vehicle shell is overlaid, scale the whole pack back to a plausible floor-pack
// footprint without changing the vehicle model or the cell-selection geometry.
const PACK_CHASSIS_OFFSET_Y = 0.26;
const PACK_VEHICLE_SCALE_X = 0.74;
const PACK_VEHICLE_SCALE_Y = 0.72;
const PACK_VEHICLE_SCALE_Z = 0.82;

const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

function cellColor(level, temperature, minimum, maximum) {
  const base = new THREE.Color(RISK_COLORS[level] || RISK_COLORS[0]);
  if (level !== 0 || maximum <= minimum) return base;
  const cool = new THREE.Color("#3b8fc7");
  const warm = new THREE.Color("#29d4a6");
  return cool.lerp(warm, clamp((temperature - minimum) / (maximum - minimum), 0, 1));
}

function supportsWebGL2(canvas) {
  try {
    return Boolean(canvas.getContext("webgl2", {
      alpha: false,
      antialias: true,
      powerPreference: "high-performance",
    }));
  } catch {
    return false;
  }
}

export class BatteryPackViewer {
  constructor({
    canvas,
    fallbackElement,
    definition,
    connectorDefinition = null,
    onSelection,
    onAvailability,
    assetBaseUrl = new URL(".", import.meta.url),
  }) {
    this.canvas = canvas;
    this.fallbackElement = fallbackElement;
    this.definition = definition;
    this.connectorDefinition = connectorDefinition;
    this.onSelection = onSelection;
    this.onAvailability = onAvailability;
    this.assetBaseUrl = new URL(assetBaseUrl, import.meta.url);
    this.state = null;
    this.frame = null;
    this.selectedIndex = null;
    this.lastScenario = null;
    this.lastRiskLevel = 0;
    this.transparentCover = true;
    this.exploded = false;
    this.vehicleVisible = false;
    this.vehicleWheelParts = [];
    this.visible = false;
    this.yaw = -0.70;
    this.pitch = 0.58;
    this.distance = 13.8;
    this.pointerStart = null;
    this.pointerLast = null;
    this.dragDistance = 0;
    this.animationFrame = null;
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.handleVisibilityChange = () => this._syncAnimation();

    if (!supportsWebGL2(canvas)) {
      this.mode = "fallback";
      this.canvas.hidden = true;
      this.fallbackElement.hidden = false;
      this._buildFallback();
      this.onAvailability?.(false);
      return;
    }

    this.mode = "webgl";
    this.fallbackElement.hidden = true;
    this._initializeScene();
    this._bindPointerControls();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.canvas.parentElement);
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
    this.onAvailability?.(true);
  }

  _initializeScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#061017");
    this.scene.fog = new THREE.FogExp2("#061017", 0.035);
    this.camera = new THREE.PerspectiveCamera(38, 16 / 9, 0.1, 80);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;

    this.scene.add(new THREE.HemisphereLight("#8be6ff", "#061017", 1.35));
    const keyLight = new THREE.DirectionalLight("#d9fbff", 2.8);
    keyLight.position.set(-6, 9, 7);
    this.scene.add(keyLight);
    const rimLight = new THREE.PointLight("#27d6c5", 2.6, 24);
    rimLight.position.set(6, 4, -5);
    this.scene.add(rimLight);

    this.packGroup = new THREE.Group();
    this.packGroup.position.y = PACK_CHASSIS_OFFSET_Y;
    this.packGroup.scale.set(
      PACK_VEHICLE_SCALE_X,
      PACK_VEHICLE_SCALE_Y,
      PACK_VEHICLE_SCALE_Z,
    );
    this.scene.add(this.packGroup);
    this.moduleGroups = [];
    this.modulePositions = [];
    this.cellBasePositions = [];
    this.cellDisplayPositions = [];

    const moduleRows = Number(this.definition.module_rows);
    const moduleColumns = Number(this.definition.module_columns);
    const cellsPerModule = Number(this.definition.cells_per_module);
    const totalCells = Number(this.definition.visualized_cell_count);
    const packWidth = moduleColumns * MODULE_WIDTH + (moduleColumns - 1) * MODULE_GAP_X;
    const packDepth = moduleRows * MODULE_DEPTH + (moduleRows - 1) * MODULE_GAP_Z;
    this.packWidth = packWidth;
    this.packDepth = packDepth;

    const coolingPlate = new THREE.Mesh(
      new THREE.BoxGeometry(packWidth + 0.42, 0.20, packDepth + 0.42),
      new THREE.MeshStandardMaterial({ color: "#173844", metalness: 0.72, roughness: 0.33 }),
    );
    coolingPlate.position.y = -0.48;
    this.packGroup.add(coolingPlate);

    const basePlate = new THREE.Mesh(
      new THREE.BoxGeometry(packWidth + 0.18, 0.14, packDepth + 0.18),
      new THREE.MeshStandardMaterial({ color: "#0b2029", metalness: 0.45, roughness: 0.52 }),
    );
    basePlate.position.y = -0.31;
    this.packGroup.add(basePlate);

    const trayGeometry = new THREE.BoxGeometry(MODULE_WIDTH, 0.16, MODULE_DEPTH);
    const trayMaterial = new THREE.MeshStandardMaterial({
      color: "#183743",
      metalness: 0.48,
      roughness: 0.45,
    });
    const busbarGeometry = new THREE.BoxGeometry(MODULE_WIDTH - 0.28, 0.035, 0.065);
    const busbarMaterial = new THREE.MeshStandardMaterial({
      color: "#d88237",
      emissive: "#4a1d08",
      emissiveIntensity: 0.35,
      metalness: 0.78,
      roughness: 0.25,
    });

    for (let moduleIndex = 0; moduleIndex < moduleRows * moduleColumns; moduleIndex += 1) {
      const row = Math.floor(moduleIndex / moduleColumns);
      const column = moduleIndex % moduleColumns;
      const x = (column - (moduleColumns - 1) / 2) * (MODULE_WIDTH + MODULE_GAP_X);
      const z = (row - (moduleRows - 1) / 2) * (MODULE_DEPTH + MODULE_GAP_Z);
      const group = new THREE.Group();
      const tray = new THREE.Mesh(trayGeometry, trayMaterial);
      tray.position.y = -0.17;
      group.add(tray);
      for (const busbarZ of [-0.28, 0.28]) {
        const busbar = new THREE.Mesh(busbarGeometry, busbarMaterial);
        busbar.position.set(0, 0.48, busbarZ);
        group.add(busbar);
      }
      group.position.set(x, 0, z);
      this.modulePositions.push(new THREE.Vector3(x, 0, z));
      this.moduleGroups.push(group);
      this.packGroup.add(group);

      for (let cellIndex = 0; cellIndex < cellsPerModule; cellIndex += 1) {
        const cellColumn = cellIndex % 4;
        const cellRow = Math.floor(cellIndex / 4);
        const localX = (cellColumn - 1.5) * 0.55;
        const localZ = (cellRow - 0.5) * 0.58;
        this.cellBasePositions.push(new THREE.Vector3(x + localX, 0.17, z + localZ));
        this.cellDisplayPositions.push(new THREE.Vector3(x + localX, 0.17, z + localZ));
      }
    }

    const cellGeometry = new THREE.BoxGeometry(CELL_WIDTH, CELL_HEIGHT, CELL_DEPTH);
    const cellMaterial = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      metalness: 0.20,
      roughness: 0.43,
    });
    this.cells = new THREE.InstancedMesh(cellGeometry, cellMaterial, totalCells);
    this.cells.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.packGroup.add(this.cells);

    this.dummy = new THREE.Object3D();
    this._updateGeometry();
    for (let index = 0; index < totalCells; index += 1) {
      this.cells.setColorAt(index, new THREE.Color(RISK_COLORS[0]));
    }
    this.cells.instanceColor.needsUpdate = true;

    this.selectionBox = new THREE.Mesh(
      new THREE.BoxGeometry(CELL_WIDTH * 1.14, CELL_HEIGHT * 1.14, CELL_DEPTH * 1.14),
      new THREE.MeshBasicMaterial({
        color: "#f5ffff",
        wireframe: true,
        transparent: true,
        opacity: 0.95,
        depthTest: false,
      }),
    );
    this.selectionBox.visible = false;
    this.selectionBox.renderOrder = 20;
    this.packGroup.add(this.selectionBox);

    this.hotspotMarker = new THREE.Mesh(
      new THREE.TorusGeometry(0.34, 0.035, 8, 36),
      new THREE.MeshBasicMaterial({ color: "#ff5263", transparent: true, opacity: 0.92 }),
    );
    this.hotspotMarker.rotation.x = Math.PI / 2;
    this.hotspotMarker.visible = false;
    this.hotspotMarker.renderOrder = 18;
    this.packGroup.add(this.hotspotMarker);
    this.hotspotLight = new THREE.PointLight("#ff5263", 0, 3.8);
    this.packGroup.add(this.hotspotLight);

    this.coverMaterial = new THREE.MeshPhysicalMaterial({
      color: "#4e7e8b",
      transparent: true,
      opacity: 0.07,
      roughness: 0.28,
      metalness: 0.14,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const coverGeometry = new THREE.BoxGeometry(packWidth + 0.52, 1.28, packDepth + 0.52);
    this.cover = new THREE.Mesh(coverGeometry, this.coverMaterial);
    this.cover.position.y = 0.08;
    this.cover.renderOrder = 10;
    this.packGroup.add(this.cover);
    this.coverEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(coverGeometry),
      new THREE.LineBasicMaterial({ color: "#6da7b5", transparent: true, opacity: 0.62 }),
    );
    this.coverEdges.position.copy(this.cover.position);
    this.coverEdges.renderOrder = 11;
    this.packGroup.add(this.coverEdges);

    this._createVehicleOverlay();

    const grid = new THREE.GridHelper(15, 30, "#1c6470", "#12313b");
    grid.position.y = -0.59;
    grid.material.transparent = true;
    grid.material.opacity = 0.34;
    this.scene.add(grid);

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this._updateCamera();
  }

  _createVehicleOverlay() {
    this.vehicleGroup = new THREE.Group();
    this.vehicleGroup.name = "licensed-vehicle-overlay";
    this.vehicleGroup.visible = this.vehicleVisible;
    this.scene.add(this.vehicleGroup);
    this.vehicleFallbackGroup = new THREE.Group();
    this.vehicleFallbackGroup.name = "procedural-vehicle-loading-fallback";
    this.vehicleGroup.add(this.vehicleFallbackGroup);
    this.vehicleAssetStatus = "loading";
    this.canvas.dataset.vehicleAssetStatus = this.vehicleAssetStatus;

    const vehicleLength = this.packWidth + 2.65;
    const vehicleWidth = this.packDepth + 2.05;
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: "#5bc8da",
      transparent: true,
      opacity: 0.085,
      roughness: 0.24,
      metalness: 0.08,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: "#58aee8",
      transparent: true,
      opacity: 0.12,
      roughness: 0.08,
      metalness: 0.04,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: "#61d7e5",
      transparent: true,
      opacity: 0.58,
    });

    const addShell = (geometry, position, material = bodyMaterial, rotationZ = 0) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(position);
      mesh.rotation.z = rotationZ;
      mesh.renderOrder = 7;
      this.vehicleFallbackGroup.add(mesh);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), edgeMaterial);
      edges.position.copy(position);
      edges.rotation.z = rotationZ;
      edges.renderOrder = 8;
      this.vehicleFallbackGroup.add(edges);
      return mesh;
    };

    addShell(
      new THREE.BoxGeometry(vehicleLength, 0.72, vehicleWidth),
      new THREE.Vector3(0, 0.18, 0),
    );
    addShell(
      new THREE.BoxGeometry(vehicleLength * 0.72, 2.65, vehicleWidth * 0.88),
      new THREE.Vector3(0.55, 2.02, 0),
      glassMaterial,
    );
    addShell(
      new THREE.BoxGeometry(vehicleLength * 0.22, 1.15, vehicleWidth * 0.86),
      new THREE.Vector3(-vehicleLength * 0.39, 1.02, 0),
    );
    addShell(
      new THREE.BoxGeometry(vehicleLength * 0.12, 1.75, vehicleWidth * 0.86),
      new THREE.Vector3(vehicleLength * 0.45, 1.34, 0),
    );
    addShell(
      new THREE.BoxGeometry(vehicleLength * 0.63, 0.16, vehicleWidth * 0.84),
      new THREE.Vector3(0.78, 3.39, 0),
    );
    addShell(
      new THREE.BoxGeometry(0.14, 2.20, vehicleWidth * 0.80),
      new THREE.Vector3(-vehicleLength * 0.23, 2.12, 0),
      glassMaterial,
      -0.34,
    );
    addShell(
      new THREE.BoxGeometry(0.14, 2.05, vehicleWidth * 0.80),
      new THREE.Vector3(vehicleLength * 0.34, 2.05, 0),
      glassMaterial,
      0.26,
    );

    const sillGeometry = new THREE.BoxGeometry(vehicleLength * 0.82, 0.18, 0.20);
    for (const z of [-vehicleWidth * 0.47, vehicleWidth * 0.47]) {
      addShell(sillGeometry, new THREE.Vector3(0.15, 0.65, z));
    }

    const wheelGeometry = new THREE.CylinderGeometry(0.92, 0.92, 0.52, 28);
    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: "#071015",
      metalness: 0.18,
      roughness: 0.72,
      transparent: true,
      opacity: 0.90,
    });
    const rimGeometry = new THREE.TorusGeometry(0.50, 0.09, 10, 30);
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: "#6ba9b5",
      metalness: 0.72,
      roughness: 0.28,
      transparent: true,
      opacity: 0.82,
    });
    const wheelX = vehicleLength * 0.35;
    const wheelZ = vehicleWidth * 0.51;
    for (const x of [-wheelX, wheelX]) {
      for (const z of [-wheelZ, wheelZ]) {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(x, -0.10, z);
        this.vehicleFallbackGroup.add(wheel);
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        rim.position.set(x, -0.10, z + (z > 0 ? 0.275 : -0.275));
        this.vehicleFallbackGroup.add(rim);
      }
    }

    const frontMarker = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.14, vehicleWidth * 0.62),
      new THREE.MeshBasicMaterial({ color: "#27d6c5", transparent: true, opacity: 0.88 }),
    );
    frontMarker.position.set(-vehicleLength * 0.505, 0.98, 0);
    this.vehicleFallbackGroup.add(frontMarker);
    this._createConnectorTwin(vehicleLength, vehicleWidth);
    this._loadVehicleModel();
  }

  _createConnectorTwin(vehicleLength, vehicleWidth) {
    const componentOrder = this.connectorDefinition?.component_order;
    if (!Array.isArray(componentOrder) || componentOrder.length !== 3) return;

    this.connectorGroup = new THREE.Group();
    this.connectorGroup.name = "conceptual-temperature-connector";
    this.connectorGroup.position.set(
      -vehicleLength * 0.41,
      2.35,
      -vehicleWidth * 0.42,
    );
    this.connectorGroup.scale.setScalar(0.82);
    // The loaded hatchback faces +X; -X is its rear and -Z is its left side.
    // Rotate the procedural plug so it projects outward from the left rear fender.
    this.connectorGroup.rotation.y = Math.PI;
    this.vehicleGroup.add(this.connectorGroup);

    this.connectorMaterials = new Map();
    const thermalMaterial = (componentId, { metalness = 0.18, roughness = 0.42 } = {}) => {
      const material = new THREE.MeshStandardMaterial({
        color: RISK_COLORS[0],
        emissive: RISK_COLORS[0],
        emissiveIntensity: 0.12,
        metalness,
        roughness,
      });
      this.connectorMaterials.set(componentId, material);
      return material;
    };

    const inletContactMaterial = thermalMaterial(componentOrder[0], {
      metalness: 0.72,
      roughness: 0.24,
    });
    const plugMaterial = thermalMaterial(componentOrder[1], {
      metalness: 0.15,
      roughness: 0.46,
    });
    const cableMaterial = thermalMaterial(componentOrder[2], {
      metalness: 0.05,
      roughness: 0.78,
    });

    const inlet = new THREE.Mesh(
      new THREE.CylinderGeometry(0.31, 0.34, 0.16, 32),
      inletContactMaterial,
    );
    inlet.rotation.x = Math.PI / 2;
    inlet.position.z = 0.12;
    this.connectorGroup.add(inlet);

    const inletRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.39, 0.055, 10, 40),
      plugMaterial,
    );
    inletRing.position.z = 0.22;
    this.connectorGroup.add(inletRing);

    const contactGeometry = new THREE.CylinderGeometry(0.055, 0.055, 0.18, 16);
    for (const [x, y] of [[-0.11, 0.08], [0.11, 0.08], [0, -0.11]]) {
      const contact = new THREE.Mesh(contactGeometry, inletContactMaterial);
      contact.rotation.x = Math.PI / 2;
      contact.position.set(x, y, 0.25);
      this.connectorGroup.add(contact);
    }

    const plug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.27, 0.33, 0.54, 28),
      plugMaterial,
    );
    plug.rotation.x = Math.PI / 2;
    plug.position.z = 0.49;
    this.connectorGroup.add(plug);

    const grip = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.48, 0.42),
      plugMaterial,
    );
    grip.position.set(0, -0.03, 0.78);
    this.connectorGroup.add(grip);

    const cableCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.10, 0.92),
      new THREE.Vector3(0.08, -0.48, 1.18),
      new THREE.Vector3(0.42, -1.10, 1.42),
      new THREE.Vector3(1.04, -1.45, 1.22),
    ]);
    const cable = new THREE.Mesh(
      new THREE.TubeGeometry(cableCurve, 32, 0.09, 10, false),
      cableMaterial,
    );
    this.connectorGroup.add(cable);

    this.connectorHotspotMarker = new THREE.Mesh(
      new THREE.TorusGeometry(0.48, 0.035, 8, 40),
      new THREE.MeshBasicMaterial({
        color: RISK_COLORS[1],
        transparent: true,
        opacity: 0.92,
        depthTest: false,
      }),
    );
    this.connectorHotspotMarker.position.z = 0.30;
    this.connectorHotspotMarker.visible = false;
    this.connectorHotspotMarker.renderOrder = 20;
    this.connectorGroup.add(this.connectorHotspotMarker);

    this.connectorHotspotLight = new THREE.PointLight(RISK_COLORS[1], 0, 4.0);
    this.connectorHotspotLight.position.set(0, 0, 0.42);
    this.connectorGroup.add(this.connectorHotspotLight);
    this.canvas.dataset.connectorTwinStatus = "ready";
  }

  _loadVehicleModel() {
    const assetPath = String(this.definition.vehicle_overlay?.asset_path || "").replace(/^\/+/, "");
    if (!assetPath) {
      this.vehicleAssetStatus = "failed";
      this.canvas.dataset.vehicleAssetStatus = this.vehicleAssetStatus;
      return;
    }

    const loader = new GLTFLoader();
    loader.load(
      new URL(assetPath, this.assetBaseUrl).href,
      (gltf) => {
        const model = gltf.scene;
        model.name = "licensed-compact-hatchback-model";
        model.rotation.y = Math.PI / 2;
        model.updateMatrixWorld(true);

        let bounds = new THREE.Box3().setFromObject(model);
        const initialSize = bounds.getSize(new THREE.Vector3());
        const targetLength = this.packWidth + 2.65;
        const scale = targetLength / Math.max(initialSize.x, 0.001);
        model.scale.setScalar(scale);
        model.updateMatrixWorld(true);

        bounds = new THREE.Box3().setFromObject(model);
        const center = bounds.getCenter(new THREE.Vector3());
        model.position.x -= center.x;
        model.position.z -= center.z;
        model.position.y += -0.58 - bounds.min.y;

        const edgeMaterial = new THREE.LineBasicMaterial({
          color: "#b8f4f7",
          transparent: true,
          opacity: 0.32,
          depthWrite: false,
        });
        model.traverse((node) => {
          if (!node.isMesh) return;
          const isWheel = node.name.startsWith("wheel-");
          const prepareMaterial = (material) => {
            const prepared = material.clone();
            prepared.transparent = true;
            prepared.opacity = isWheel ? 0.10 : 0.07;
            prepared.depthWrite = false;
            prepared.side = THREE.DoubleSide;
            if ("roughness" in prepared) prepared.roughness = Math.max(0.42, prepared.roughness);
            return prepared;
          };
          node.material = Array.isArray(node.material)
            ? node.material.map(prepareMaterial)
            : prepareMaterial(node.material);
          node.renderOrder = 6;
          if (node.geometry) {
            const outlineMaterial = isWheel ? edgeMaterial.clone() : edgeMaterial;
            const edges = new THREE.LineSegments(
              new THREE.EdgesGeometry(node.geometry, 32),
              outlineMaterial,
            );
            edges.name = `${node.name || "vehicle-part"}-outline`;
            edges.renderOrder = 7;
            node.add(edges);
            if (isWheel) {
              this.vehicleWheelParts.push({
                axle: node.name.includes("-front-") ? "front" : "back",
                mesh: node,
                outline: edges,
              });
            }
          }
        });

        this.vehicleModel = model;
        this.vehicleGroup.add(model);
        this.vehicleFallbackGroup.visible = false;
        this.vehicleAssetStatus = "ready";
        this.canvas.dataset.vehicleAssetStatus = this.vehicleAssetStatus;
        if (this.vehicleVisible) this._updateCamera();
        this.render();
      },
      undefined,
      (error) => {
        this.vehicleAssetStatus = "failed";
        this.canvas.dataset.vehicleAssetStatus = this.vehicleAssetStatus;
        this.vehicleFallbackGroup.visible = true;
        console.warn("Licensed vehicle model fallback:", error);
        this.render();
      },
    );
  }

  _buildFallback() {
    this.fallbackElement.innerHTML = "";
    this.fallbackCells = [];
    const heading = document.createElement("p");
    heading.className = "battery-fallback-note";
    heading.textContent = "WebGL2 미지원 · 2D 모듈 히트맵으로 표시 중";
    this.fallbackElement.appendChild(heading);
    const grid = document.createElement("div");
    grid.className = "battery-fallback-grid";
    const moduleCount = Number(this.definition.module_count);
    const cellsPerModule = Number(this.definition.cells_per_module);
    for (let moduleIndex = 0; moduleIndex < moduleCount; moduleIndex += 1) {
      const module = document.createElement("section");
      module.className = "battery-fallback-module";
      const label = document.createElement("span");
      label.textContent = `M${String(moduleIndex + 1).padStart(2, "0")}`;
      module.appendChild(label);
      const cells = document.createElement("div");
      for (let localIndex = 0; localIndex < cellsPerModule; localIndex += 1) {
        const index = moduleIndex * cellsPerModule + localIndex;
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.cellIndex = String(index);
        button.setAttribute("aria-label", this.definition.cell_order[index]);
        button.addEventListener("click", () => this.selectCell(index));
        cells.appendChild(button);
        this.fallbackCells.push(button);
      }
      module.appendChild(cells);
      grid.appendChild(module);
    }
    this.fallbackElement.appendChild(grid);
  }

  _bindPointerControls() {
    this.canvas.addEventListener("pointerdown", (event) => {
      this.canvas.setPointerCapture(event.pointerId);
      this.pointerStart = { x: event.clientX, y: event.clientY };
      this.pointerLast = { ...this.pointerStart };
      this.dragDistance = 0;
    });
    this.canvas.addEventListener("pointermove", (event) => {
      if (!this.pointerLast) return;
      const dx = event.clientX - this.pointerLast.x;
      const dy = event.clientY - this.pointerLast.y;
      this.dragDistance += Math.abs(dx) + Math.abs(dy);
      this.yaw -= dx * 0.008;
      this.pitch = clamp(this.pitch + dy * 0.006, 0.12, 1.38);
      this.pointerLast = { x: event.clientX, y: event.clientY };
      this._updateCamera();
    });
    this.canvas.addEventListener("pointerup", (event) => {
      if (this.dragDistance < 7) this._pickCell(event);
      this.pointerStart = null;
      this.pointerLast = null;
      this.dragDistance = 0;
    });
    this.canvas.addEventListener("pointercancel", () => {
      this.pointerStart = null;
      this.pointerLast = null;
    });
    this.canvas.addEventListener("wheel", (event) => {
      event.preventDefault();
      this.distance = clamp(this.distance + event.deltaY * 0.012, 7.2, 23.0);
      this._updateCamera();
    }, { passive: false });
    this.canvas.addEventListener("keydown", (event) => {
      const key = event.key;
      if (key === "ArrowLeft") this.yaw += 0.12;
      else if (key === "ArrowRight") this.yaw -= 0.12;
      else if (key === "ArrowUp") this.pitch = clamp(this.pitch - 0.10, 0.12, 1.38);
      else if (key === "ArrowDown") this.pitch = clamp(this.pitch + 0.10, 0.12, 1.38);
      else if (key === "+" || key === "=") this.distance = clamp(this.distance - 0.8, 7.2, 23.0);
      else if (key === "-" || key === "_") this.distance = clamp(this.distance + 0.8, 7.2, 23.0);
      else if (key === "Enter") this.focusHotspot();
      else return;
      event.preventDefault();
      this._updateCamera();
    });
    this.canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      this.mode = "fallback";
      this.canvas.hidden = true;
      this.fallbackElement.hidden = false;
      if (!this.fallbackCells) this._buildFallback();
      this._updateFallback();
      this.onAvailability?.(false);
    });
  }

  _moduleOffset(moduleIndex) {
    if (!this.exploded) return new THREE.Vector3();
    const columns = Number(this.definition.module_columns);
    const rows = Number(this.definition.module_rows);
    const column = moduleIndex % columns;
    const row = Math.floor(moduleIndex / columns);
    return new THREE.Vector3(
      (column - (columns - 1) / 2) * 0.34,
      0.18,
      (row - (rows - 1) / 2) * 0.38,
    );
  }

  _updateGeometry() {
    const cellsPerModule = Number(this.definition.cells_per_module);
    for (let moduleIndex = 0; moduleIndex < this.moduleGroups.length; moduleIndex += 1) {
      const offset = this._moduleOffset(moduleIndex);
      this.moduleGroups[moduleIndex].position.copy(this.modulePositions[moduleIndex]).add(offset);
    }
    for (let index = 0; index < this.cellBasePositions.length; index += 1) {
      const moduleIndex = Math.floor(index / cellsPerModule);
      const display = this.cellBasePositions[index].clone().add(this._moduleOffset(moduleIndex));
      this.cellDisplayPositions[index].copy(display);
      this.dummy.position.copy(display);
      this.dummy.updateMatrix();
      this.cells.setMatrixAt(index, this.dummy.matrix);
    }
    this.cells.instanceMatrix.needsUpdate = true;
    this._updateSelection(false);
    this._updateHotspotMarker();
    this.render();
  }

  _updateCamera() {
    if (this.mode !== "webgl") return;
    const horizontal = this.distance * Math.cos(this.pitch);
    this.camera.position.set(
      horizontal * Math.sin(this.yaw),
      this.distance * Math.sin(this.pitch),
      horizontal * Math.cos(this.yaw),
    );
    this.camera.lookAt(0, -0.05, 0);
    this._updateVehicleWheelVisibility();
    this.render();
  }

  _updateVehicleWheelVisibility() {
    if (!this.vehicleModel || this.vehicleWheelParts.length === 0) return;
    const lookingAlongVehicle = Math.abs(Math.sin(this.yaw)) >= 0.82;
    let nearAxle = null;

    if (lookingAlongVehicle) {
      this.vehicleModel.updateMatrixWorld(true);
      const distances = { front: [], back: [] };
      for (const part of this.vehicleWheelParts) {
        const worldPosition = part.mesh.getWorldPosition(new THREE.Vector3());
        distances[part.axle].push(worldPosition.distanceTo(this.camera.position));
      }
      const meanDistance = (values) => (
        values.reduce((total, value) => total + value, 0) / Math.max(values.length, 1)
      );
      nearAxle = meanDistance(distances.front) <= meanDistance(distances.back) ? "front" : "back";
    }

    for (const part of this.vehicleWheelParts) {
      const isNear = !lookingAlongVehicle || part.axle === nearAxle;
      part.outline.material.opacity = isNear ? 0.32 : 0.025;
      const materials = Array.isArray(part.mesh.material)
        ? part.mesh.material
        : [part.mesh.material];
      for (const material of materials) material.opacity = isNear ? 0.10 : 0.015;
    }
  }

  _pickCell(event) {
    if (!this.state || this.mode !== "webgl") return;
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = this.raycaster.intersectObject(this.cells, false)[0];
    if (hit && Number.isInteger(hit.instanceId)) this.selectCell(hit.instanceId);
  }

  _updateHotspotMarker() {
    if (this.mode !== "webgl" || !this.state || !this.frame) return;
    const index = Number(this.state.hotspot_cell_index);
    const level = Number(this.state.state_level[index]);
    const active = this.frame.scenario_id === "battery_internal" && this.frame.event_active;
    this.hotspotMarker.visible = active;
    if (active) {
      const position = this.cellDisplayPositions[index];
      this.hotspotMarker.position.set(position.x, position.y + 0.55, position.z);
      this.hotspotMarker.material.color.set(RISK_COLORS[Math.max(1, level)]);
      this.hotspotLight.position.set(position.x, position.y + 0.55, position.z);
      this.hotspotLight.color.set(RISK_COLORS[Math.max(1, level)]);
      this.hotspotLight.intensity = level >= 2 ? 4.0 : 1.2;
    } else {
      this.hotspotLight.intensity = 0;
    }
    this._syncAnimation();
  }

  _updateConnectorTwin(state) {
    if (
      this.mode !== "webgl"
      || !this.connectorGroup
      || !state
      || !Array.isArray(state.temperature_decic)
      || !Array.isArray(state.state_level)
    ) return;

    const componentOrder = this.connectorDefinition?.component_order || [];
    let maximumLevel = 0;
    let maximumTemperature = -Infinity;
    for (let index = 0; index < componentOrder.length; index += 1) {
      const material = this.connectorMaterials.get(componentOrder[index]);
      if (!material) continue;
      const level = clamp(Number(state.state_level[index]) || 0, 0, 3);
      const temperature = Number(state.temperature_decic[index]) / 10;
      maximumLevel = Math.max(maximumLevel, level);
      maximumTemperature = Math.max(maximumTemperature, temperature);
      const color = new THREE.Color(RISK_COLORS[level]);
      material.color.copy(color);
      material.emissive.copy(color).multiplyScalar(level === 0 ? 0.32 : 0.68);
      material.emissiveIntensity = level === 0 ? 0.16 : 0.48 + level * 0.20;
      material.needsUpdate = true;
    }

    this.connectorHotspotMarker.visible = maximumLevel >= 1;
    this.connectorHotspotMarker.material.color.set(RISK_COLORS[maximumLevel]);
    this.connectorHotspotLight.color.set(RISK_COLORS[maximumLevel]);
    this.connectorHotspotLight.intensity = maximumLevel >= 2 ? 4.2 : maximumLevel === 1 ? 1.4 : 0;
    this.canvas.dataset.connectorLevel = String(maximumLevel);
    this.canvas.dataset.connectorTemperatureC = Number.isFinite(maximumTemperature)
      ? maximumTemperature.toFixed(1)
      : "";
    this._syncAnimation();
  }

  _syncAnimation() {
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    const connectorAlertVisible = Boolean(
      this.connectorHotspotMarker?.visible && this.vehicleVisible,
    );
    if (
      this.mode !== "webgl"
      || !this.visible
      || document.hidden
      || this.reducedMotion
      || (!this.hotspotMarker?.visible && !connectorAlertVisible)
    ) return;
    const animate = (time) => {
      const batteryVisible = Boolean(this.hotspotMarker?.visible);
      const connectorVisible = Boolean(
        this.connectorHotspotMarker?.visible && this.vehicleVisible,
      );
      if (!this.visible || document.hidden || (!batteryVisible && !connectorVisible)) {
        this.animationFrame = null;
        return;
      }
      const scale = 1 + 0.12 * Math.sin(time * 0.006);
      if (batteryVisible) this.hotspotMarker.scale.setScalar(scale);
      if (connectorVisible) this.connectorHotspotMarker.scale.setScalar(scale);
      this.render();
      this.animationFrame = requestAnimationFrame(animate);
    };
    this.animationFrame = requestAnimationFrame(animate);
  }

  _updateFallback() {
    if (!this.state || !this.fallbackCells) return;
    this.fallbackCells.forEach((cell, index) => {
      const level = Number(this.state.state_level[index]);
      cell.dataset.level = String(level);
      cell.classList.toggle("selected", index === this.selectedIndex);
      const temperature = Number(this.state.temperature_decic[index]) / 10;
      cell.title = `${this.definition.cell_order[index]} · ${temperature.toFixed(1)}°C · ${RISK_LABELS[level]}`;
    });
  }

  update(state, frame) {
    if (!state || !Array.isArray(state.temperature_decic)) return;
    this.state = state;
    this.frame = frame;
    const changedScenario = this.lastScenario !== frame.scenario_id;
    const riskRaised = frame.risk_level > this.lastRiskLevel && frame.primary_risk_source === "battery";
    this.lastScenario = frame.scenario_id;
    this.lastRiskLevel = frame.risk_level;
    this._updateConnectorTwin(frame.connector_twin_state);
    if (changedScenario || this.selectedIndex === null || (riskRaised && frame.risk_level >= 2)) {
      this.selectedIndex = Number(state.hotspot_cell_index);
    }

    if (this.mode === "fallback") {
      this._updateFallback();
      this._updateSelection(true);
      return;
    }

    const temperatures = state.temperature_decic.map((value) => Number(value) / 10);
    const minimum = Math.min(...temperatures);
    const maximum = Math.max(...temperatures);
    for (let index = 0; index < temperatures.length; index += 1) {
      const level = Number(state.state_level[index]);
      this.cells.setColorAt(index, cellColor(level, temperatures[index], minimum, maximum));
    }
    this.cells.instanceColor.needsUpdate = true;
    this._updateSelection(true);
    this._updateHotspotMarker();
    this.render();
  }

  _updateSelection(notify) {
    if (!this.state || this.selectedIndex === null) return;
    const index = clamp(this.selectedIndex, 0, Number(this.definition.visualized_cell_count) - 1);
    this.selectedIndex = index;
    if (this.mode === "webgl" && this.selectionBox) {
      this.selectionBox.visible = true;
      this.selectionBox.position.copy(this.cellDisplayPositions[index]);
    }
    if (this.mode === "fallback") this._updateFallback();
    if (notify) {
      const level = Number(this.state.state_level[index]);
      const detail = {
        index,
        cellId: this.definition.cell_order[index],
        moduleId: this.definition.cell_order[index].split("-")[0],
        temperatureC: Number(this.state.temperature_decic[index]) / 10,
        voltageV: Number(this.state.voltage_mv[index]) / 1000,
        riskLevel: level,
        riskLabel: RISK_LABELS[level],
      };
      this.canvas.setAttribute(
        "aria-label",
        `${detail.cellId}, ${detail.temperatureC.toFixed(1)}도, ${detail.riskLabel}`,
      );
      this.onSelection?.(detail);
    }
    this.render();
  }

  selectCell(index) {
    if (!Number.isInteger(index) || index < 0 || index >= Number(this.definition.visualized_cell_count)) return;
    this.selectedIndex = index;
    this._updateSelection(true);
  }

  selectModule(delta) {
    if (!this.state) return;
    const cellsPerModule = Number(this.definition.cells_per_module);
    const moduleCount = Number(this.definition.module_count);
    const currentModule = Math.floor((this.selectedIndex ?? 0) / cellsPerModule);
    const nextModule = (currentModule + delta + moduleCount) % moduleCount;
    this.selectCell(nextModule * cellsPerModule + Math.min(3, cellsPerModule - 1));
  }

  focusHotspot() {
    if (this.state) this.selectCell(Number(this.state.hotspot_cell_index));
  }

  setView(view) {
    const vehicleDistance = this.vehicleVisible ? 2.8 : 0;
    if (view === "top") {
      this.yaw = 0;
      this.pitch = 1.34;
      this.distance = 14.5 + vehicleDistance;
    } else if (view === "front") {
      this.yaw = 0;
      this.pitch = 0.24;
      this.distance = 14.2 + vehicleDistance;
    } else if (view === "side") {
      this.yaw = Math.PI / 2;
      this.pitch = 0.30;
      this.distance = 14.2 + vehicleDistance;
    } else {
      this.yaw = -0.70;
      this.pitch = 0.58;
      this.distance = 13.8 + vehicleDistance;
    }
    this._updateCamera();
  }

  toggleCover(force) {
    this.transparentCover = typeof force === "boolean" ? force : !this.transparentCover;
    if (this.mode === "webgl") {
      this.coverMaterial.opacity = this.transparentCover ? 0.07 : 0.60;
      this.coverEdges.material.opacity = this.transparentCover ? 0.62 : 0.90;
      this.render();
    }
    return this.transparentCover;
  }

  toggleExploded(force) {
    this.exploded = typeof force === "boolean" ? force : !this.exploded;
    if (this.mode === "webgl") {
      this.coverMaterial.opacity = this.exploded ? 0.025 : (this.transparentCover ? 0.07 : 0.60);
      this._updateGeometry();
    }
    return this.exploded;
  }

  toggleVehicle(force) {
    this.vehicleVisible = typeof force === "boolean" ? force : !this.vehicleVisible;
    if (this.mode === "webgl" && this.vehicleGroup) {
      this.vehicleGroup.visible = this.vehicleVisible;
      // The vehicle floor already supplies the outer underbody boundary. Hiding
      // the concept pack's duplicate transparent shell prevents two nearly
      // coincident rectangles from reading as a geometry collision.
      this.cover.visible = !this.vehicleVisible;
      this.coverEdges.visible = !this.vehicleVisible;
      if (this.vehicleVisible) this.distance = Math.max(this.distance, 16.6);
      this._updateCamera();
    } else if (this.fallbackElement) {
      this.fallbackElement.classList.toggle("vehicle-overlay-active", this.vehicleVisible);
    }
    return this.vehicleVisible;
  }

  setVisible(visible) {
    this.visible = Boolean(visible);
    if (this.visible) {
      this.resize();
      this.render();
    }
    this._syncAnimation();
  }

  dispose() {
    this.visible = false;
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.resizeObserver?.disconnect();
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    if (this.mode !== "webgl") return;

    this.scene?.traverse((object) => {
      object.geometry?.dispose?.();
      const materials = Array.isArray(object.material)
        ? object.material
        : object.material
          ? [object.material]
          : [];
      materials.forEach((material) => material.dispose?.());
    });
    this.renderer?.dispose();
    this.renderer?.forceContextLoss?.();
  }

  resize() {
    if (this.mode !== "webgl") return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);
    if (width < 2 || height < 2) return;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.render();
  }

  render() {
    if (this.mode === "webgl" && this.visible && this.renderer) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
