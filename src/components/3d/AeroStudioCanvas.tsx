"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { Vehicle, BodyStyle } from "@/lib/types";

interface AeroStudioCanvasProps {
  vehicle: Vehicle;
}

interface PaintColorOption {
  name: string;
  hex: string;
  label: string;
}

const PAINT_PALETTE: PaintColorOption[] = [
  { name: "Miami Blue", hex: "#009ACD", label: "Miami Blue" },
  { name: "Carmine Red", hex: "#9E141B", label: "Carmine Red" },
  { name: "Speed Yellow", hex: "#F2BE1A", label: "Speed Yellow" },
  { name: "British Racing Green", hex: "#0E3E2E", label: "Racing Green" },
  { name: "Stealth Black", hex: "#15181C", label: "Stealth Black" },
  { name: "Arctic White", hex: "#E9ECF0", label: "Arctic White" },
  { name: "Liquid Quicksilver", hex: "#7E8894", label: "Liquid Quicksilver" },
];

interface HotspotDefinition {
  id: "powertrain" | "chassis" | "aero";
  title: string;
  subtitle: string;
  tag: string;
  localPos: THREE.Vector3;
  getDetails: (vehicle: Vehicle) => { label: string; value: string }[];
}

function getAeroSpecs(bodyStyle: BodyStyle) {
  switch (bodyStyle) {
    case "Coupe":
    case "Convertible":
      return { cd: "0.22", downforceKg: 195, flowPattern: "Aggressive Fastback & High Downforce" };
    case "Sedan":
      return { cd: "0.23", downforceKg: 145, flowPattern: "Low-Drag Laminar Canopy" };
    case "SUV":
      return { cd: "0.28", downforceKg: 110, flowPattern: "Optimized High-Rake Lift-Suppression" };
    case "Truck":
      return { cd: "0.35", downforceKg: 85, flowPattern: "High-Turbulence Tailgate Wake" };
    default:
      return { cd: "0.25", downforceKg: 130, flowPattern: "Balanced Hatch Flow" };
  }
}

const HOTSPOTS: HotspotDefinition[] = [
  {
    id: "powertrain",
    title: "High-Output Powertrain",
    subtitle: "Engine, Inverter & Drive Units",
    tag: "POWER & TORQUE",
    localPos: new THREE.Vector3(-1.25, 0.82, 0),
    getDetails: (v) => [
      { label: "Horsepower", value: `${v.specs.powerHp} HP` },
      { label: "Max Torque", value: `${v.specs.torqueNm} Nm` },
      { label: "0-100 km/h", value: `${v.specs.acceleration060} s` },
      { label: "Drivetrain", value: v.specs.drivetrain },
      { label: "Architecture", value: `${v.fuelType} High-Performance` },
    ],
  },
  {
    id: "chassis",
    title: "Structural Platform & Cell Integration",
    subtitle: "Weight Balance & Torsional Rigidity",
    tag: "CHASSIS & CELLS",
    localPos: new THREE.Vector3(0.05, 0.42, 0.95),
    getDetails: (v) =>
      v.evSpecs
        ? [
            { label: "Battery Capacity", value: `${v.evSpecs.batteryKwh} kWh` },
            { label: "WLTP Range", value: `${v.evSpecs.rangeKm} km` },
            { label: "Max Fast Charge", value: `${v.evSpecs.chargingSpeedKw} kW` },
            { label: "10-80% Charge", value: v.evSpecs.chargingTime1080 },
            { label: "Efficiency", value: v.evSpecs.efficiency },
          ]
        : [
            { label: "Curb Weight", value: `${v.specs.weightKg} kg` },
            { label: "Wheelbase", value: `${v.specs.wheelbaseMm} mm` },
            { label: "Weight Ratio", value: "49:51 Dynamic" },
            { label: "Cargo Space", value: `${v.specs.cargoLiters} Liters` },
            { label: "Seating", value: `${v.specs.seatingCapacity} Passengers` },
          ],
  },
  {
    id: "aero",
    title: "Active Aero & Wake Separation",
    subtitle: "Ground-Effect Diffuser & Vortex Shedding",
    tag: "AERODYNAMICS",
    localPos: new THREE.Vector3(1.72, 1.05, 0),
    getDetails: (v) => {
      const cd = getAeroSpecs(v.bodyStyle).cd;
      const downforce = getAeroSpecs(v.bodyStyle).downforceKg;
      return [
        { label: "Drag Coefficient", value: `${cd} Cd` },
        { label: "Downforce @ 200 km/h", value: `${downforce} kg` },
        { label: "Aero Balance", value: "45% F / 55% R" },
        { label: "Diffuser Vanes", value: "Quad Venturi Channels" },
        { label: "Active Wing", value: "Multi-Angle Staging" },
      ];
    },
  },
];

export default function AeroStudioCanvas({ vehicle }: AeroStudioCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Studio UI state
  const [isAeroMode, setIsAeroMode] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>(() => {
    const match = PAINT_PALETTE.find(
      (p) => p.hex.toLowerCase() === vehicle.coverGradient.from.toLowerCase()
    );
    return match ? match.hex : PAINT_PALETTE[0].hex;
  });
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [windSpeed, setWindSpeed] = useState<number>(160);

  // 2D Screen coords for 3D hotspots
  const [hotspotScreenCoords, setHotspotScreenCoords] = useState<
    Record<string, { x: number; y: number; visible: boolean }>
  >({});

  // Refs for three.js interaction & loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carGroupRef = useRef<THREE.Group | null>(null);
  const carPaintMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const streamlinesGroupRef = useRef<THREE.Group | null>(null);
  const floorGlowRef = useRef<THREE.Mesh | null>(null);

  // Lighting refs for smooth transition between studio & aero
  const keyLightRef = useRef<THREE.SpotLight | null>(null);
  const rimLight1Ref = useRef<THREE.DirectionalLight | null>(null);
  const rimLight2Ref = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

  // Drag interaction state refs
  const isDraggingRef = useRef<boolean>(false);
  const prevPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationRef = useRef<{ yaw: number; pitch: number; distance: number }>({
    yaw: 0.65,
    pitch: 0.32,
    distance: 8.8,
  });
  const targetRotationRef = useRef<{ yaw: number; pitch: number; distance: number }>({
    yaw: 0.65,
    pitch: 0.32,
    distance: 8.8,
  });
  const autoRotateRef = useRef<boolean>(autoRotate);
  const isAeroModeRef = useRef<boolean>(isAeroMode);
  const windSpeedRef = useRef<number>(windSpeed);
  const selectedColorRef = useRef<string>(selectedColor);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    isAeroModeRef.current = isAeroMode;
  }, [isAeroMode]);

  useEffect(() => {
    windSpeedRef.current = windSpeed;
  }, [windSpeed]);

  useEffect(() => {
    selectedColorRef.current = selectedColor;
  }, [selectedColor]);

  const aeroSpecs = useMemo(() => getAeroSpecs(vehicle.bodyStyle), [vehicle.bodyStyle]);

  // Color change update
  useEffect(() => {
    if (carPaintMaterialRef.current) {
      carPaintMaterialRef.current.color.set(selectedColor);
    }
  }, [selectedColor]);

  // Main Three.js Scene Setup & Loop
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animationFrameId: number;
    let isVisible = true;

    const geometriesToDispose: THREE.BufferGeometry[] = [];
    const materialsToDispose: THREE.Material[] = [];
    const texturesToDispose: THREE.Texture[] = [];

    // --- Scene & Camera ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0c10);
    scene.fog = new THREE.FogExp2(0x0a0c10, 0.045);

    const camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    cameraRef.current = camera;

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // --- Studio Lights ---
    const ambientLight = new THREE.AmbientLight(0x222a38, 1.2);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const keyLight = new THREE.SpotLight(0xffffff, 3.5, 25, Math.PI / 3.5, 0.6, 1.2);
    keyLight.position.set(0, 8.5, 2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const rimLight1 = new THREE.DirectionalLight(0xb0d5ff, 2.0);
    rimLight1.position.set(-6, 3.8, 5);
    scene.add(rimLight1);
    rimLight1Ref.current = rimLight1;

    const rimLight2 = new THREE.DirectionalLight(0xffd5b0, 1.5);
    rimLight2.position.set(6, 2.8, -5);
    scene.add(rimLight2);
    rimLight2Ref.current = rimLight2;

    const groundBounce = new THREE.DirectionalLight(0x1a2233, 0.8);
    groundBounce.position.set(0, -5, 0);
    scene.add(groundBounce);

    // --- Studio Turntable Pedestal ---
    const pedestalGroup = new THREE.Group();
    scene.add(pedestalGroup);

    // Brushed metal pedestal platform
    const pedestalGeo = new THREE.CylinderGeometry(4.2, 4.35, 0.16, 64);
    geometriesToDispose.push(pedestalGeo);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x161a22,
      metalness: 0.88,
      roughness: 0.28,
    });
    materialsToDispose.push(pedestalMat);
    const pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestalMesh.position.y = 0.08;
    pedestalMesh.receiveShadow = true;
    pedestalGroup.add(pedestalMesh);

    // Polished edge rim
    const rimGeo = new THREE.TorusGeometry(4.25, 0.03, 16, 64);
    geometriesToDispose.push(rimGeo);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x8a99ad,
      metalness: 0.98,
      roughness: 0.08,
    });
    materialsToDispose.push(rimMat);
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 0.16;
    pedestalGroup.add(rimMesh);

    // Floor glow halo ring
    const floorGlowGeo = new THREE.RingGeometry(4.26, 4.45, 64);
    geometriesToDispose.push(floorGlowGeo);
    const floorGlowMat = new THREE.MeshBasicMaterial({
      color: 0x00d2d3,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    materialsToDispose.push(floorGlowMat);
    const floorGlowMesh = new THREE.Mesh(floorGlowGeo, floorGlowMat);
    floorGlowMesh.rotation.x = -Math.PI / 2;
    floorGlowMesh.position.y = 0.01;
    pedestalGroup.add(floorGlowMesh);
    floorGlowRef.current = floorGlowMesh;

    // Dark surrounding arena floor
    const floorGeo = new THREE.CircleGeometry(24, 64);
    geometriesToDispose.push(floorGeo);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x07080b,
      roughness: 0.65,
      metalness: 0.35,
    });
    materialsToDispose.push(floorMat);
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Car Contact Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(5.2, 2.6);
    geometriesToDispose.push(shadowGeo);

    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext("2d");
    if (sCtx) {
      const radGrad = sCtx.createRadialGradient(128, 128, 20, 128, 128, 120);
      radGrad.addColorStop(0, "rgba(0,0,0,0.85)");
      radGrad.addColorStop(0.5, "rgba(0,0,0,0.45)");
      radGrad.addColorStop(1, "rgba(0,0,0,0)");
      sCtx.fillStyle = radGrad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    texturesToDispose.push(shadowTex);

    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    materialsToDispose.push(shadowMat);
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.165;
    pedestalGroup.add(shadowMesh);

    // --- Procedural 3D Vehicle Generation ---
    const carGroup = new THREE.Group();
    carGroupRef.current = carGroup;
    scene.add(carGroup);

    // Primary glossy car paint shader
    const carPaintMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(selectedColorRef.current),
      metalness: 0.88,
      roughness: 0.22,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.92,
    });
    materialsToDispose.push(carPaintMat);
    carPaintMaterialRef.current = carPaintMat;

    // Tinted greenhouse glass
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x111620,
      metalness: 0.9,
      roughness: 0.05,
      transmission: 0.35,
      transparent: true,
      opacity: 0.88,
    });
    materialsToDispose.push(glassMat);

    // Trim, splitter & diffuser (matte carbon)
    const carbonTrimMat = new THREE.MeshStandardMaterial({
      color: 0x181a1f,
      roughness: 0.55,
      metalness: 0.45,
    });
    materialsToDispose.push(carbonTrimMat);

    // Headlight lens & LED emissive
    const headlightMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xa8e6ff,
      emissiveIntensity: 2.8,
      roughness: 0.1,
      metalness: 0.8,
    });
    materialsToDispose.push(headlightMat);

    // Taillight OLED strip
    const taillightMat = new THREE.MeshStandardMaterial({
      color: 0xff1020,
      emissive: 0xff1525,
      emissiveIntensity: 3.2,
      roughness: 0.1,
      metalness: 0.5,
    });
    materialsToDispose.push(taillightMat);

    // Wheels & Brake Calipers
    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x18191c,
      roughness: 0.88,
      metalness: 0.1,
    });
    materialsToDispose.push(tireMat);

    const rimMatGunmetal = new THREE.MeshStandardMaterial({
      color: 0x6e7685,
      metalness: 0.95,
      roughness: 0.12,
    });
    materialsToDispose.push(rimMatGunmetal);

    const brakeRotorMat = new THREE.MeshStandardMaterial({
      color: 0x8a929e,
      metalness: 0.92,
      roughness: 0.18,
    });
    materialsToDispose.push(brakeRotorMat);

    const caliperMat = new THREE.MeshStandardMaterial({
      color: 0xe8232a,
      roughness: 0.25,
      metalness: 0.6,
    });
    materialsToDispose.push(caliperMat);

    // Build vehicle body adapted to bodyStyle
    const style = vehicle.bodyStyle;
    const isSUV = style === "SUV";
    const isTruck = style === "Truck";
    const isCoupe = style === "Coupe" || style === "Convertible";

    const rideHeight = isTruck ? 0.55 : isSUV ? 0.46 : isCoupe ? 0.32 : 0.36;
    const bodyHeight = isTruck ? 0.95 : isSUV ? 0.88 : isCoupe ? 0.58 : 0.68;
    const bodyLength = isTruck ? 5.1 : isSUV ? 4.7 : isCoupe ? 4.35 : 4.6;
    const bodyWidth = isTruck ? 2.15 : isSUV ? 2.05 : 1.95;

    // --- Main Lower Fuselage ---
    const lowerBodyGeo = new THREE.BoxGeometry(bodyLength * 0.92, bodyHeight * 0.65, bodyWidth * 0.92);
    geometriesToDispose.push(lowerBodyGeo);
    const lowerBodyMesh = new THREE.Mesh(lowerBodyGeo, carPaintMat);
    lowerBodyMesh.position.set(0, rideHeight + bodyHeight * 0.35, 0);
    lowerBodyMesh.castShadow = true;
    lowerBodyMesh.receiveShadow = true;
    carGroup.add(lowerBodyMesh);

    // Hood Slope Piece
    const hoodGeo = new THREE.BoxGeometry(bodyLength * 0.38, bodyHeight * 0.28, bodyWidth * 0.88);
    geometriesToDispose.push(hoodGeo);
    const hoodMesh = new THREE.Mesh(hoodGeo, carPaintMat);
    hoodMesh.position.set(-bodyLength * 0.28, rideHeight + bodyHeight * 0.48, 0);
    hoodMesh.rotation.z = isCoupe ? 0.08 : 0.04;
    hoodMesh.castShadow = true;
    carGroup.add(hoodMesh);

    // Front Bumper & Lower Air Dam
    const frontBumperGeo = new THREE.BoxGeometry(0.35, bodyHeight * 0.5, bodyWidth * 0.95);
    geometriesToDispose.push(frontBumperGeo);
    const frontBumper = new THREE.Mesh(frontBumperGeo, carbonTrimMat);
    frontBumper.position.set(-bodyLength * 0.48, rideHeight + bodyHeight * 0.25, 0);
    carGroup.add(frontBumper);

    // Front Splitter / Chin
    const splitterGeo = new THREE.BoxGeometry(0.42, 0.05, bodyWidth * 0.98);
    geometriesToDispose.push(splitterGeo);
    const splitterMesh = new THREE.Mesh(splitterGeo, carbonTrimMat);
    splitterMesh.position.set(-bodyLength * 0.49, rideHeight + 0.06, 0);
    carGroup.add(splitterMesh);

    // Side Skirts
    const sideSkirtGeo = new THREE.BoxGeometry(bodyLength * 0.58, 0.08, 0.08);
    geometriesToDispose.push(sideSkirtGeo);
    const leftSkirt = new THREE.Mesh(sideSkirtGeo, carbonTrimMat);
    leftSkirt.position.set(0, rideHeight + 0.06, bodyWidth * 0.46);
    carGroup.add(leftSkirt);
    const rightSkirt = new THREE.Mesh(sideSkirtGeo, carbonTrimMat);
    rightSkirt.position.set(0, rideHeight + 0.06, -bodyWidth * 0.46);
    carGroup.add(rightSkirt);

    // Rear Diffuser with Vanes
    const diffuserGeo = new THREE.BoxGeometry(0.5, bodyHeight * 0.35, bodyWidth * 0.85);
    geometriesToDispose.push(diffuserGeo);
    const diffuserMesh = new THREE.Mesh(diffuserGeo, carbonTrimMat);
    diffuserMesh.position.set(bodyLength * 0.46, rideHeight + 0.16, 0);
    diffuserMesh.rotation.z = -0.15;
    carGroup.add(diffuserMesh);

    // Diffuser vertical fins
    [-0.35, -0.12, 0.12, 0.35].forEach((zOff) => {
      const finGeo = new THREE.BoxGeometry(0.35, 0.12, 0.02);
      geometriesToDispose.push(finGeo);
      const finMesh = new THREE.Mesh(finGeo, carbonTrimMat);
      finMesh.position.set(bodyLength * 0.47, rideHeight + 0.12, zOff * bodyWidth);
      carGroup.add(finMesh);
    });

    // --- Cabin & Greenhouse (Windows & Roof) ---
    if (!isTruck) {
      const cabinLength = isCoupe ? bodyLength * 0.48 : isSUV ? bodyLength * 0.58 : bodyLength * 0.52;
      const cabinHeight = isCoupe ? bodyHeight * 0.72 : isSUV ? bodyHeight * 0.95 : bodyHeight * 0.82;
      const cabinWidth = bodyWidth * 0.82;

      const cabinGeo = new THREE.BoxGeometry(cabinLength, cabinHeight, cabinWidth);
      geometriesToDispose.push(cabinGeo);
      const cabinMesh = new THREE.Mesh(cabinGeo, glassMat);
      cabinMesh.position.set(
        isCoupe ? 0.12 : isSUV ? 0.02 : 0.08,
        rideHeight + bodyHeight * 0.78,
        0
      );
      cabinMesh.castShadow = true;
      carGroup.add(cabinMesh);

      // Roof Panel (Body Color)
      const roofGeo = new THREE.BoxGeometry(cabinLength * 0.85, 0.05, cabinWidth * 0.92);
      geometriesToDispose.push(roofGeo);
      const roofMesh = new THREE.Mesh(roofGeo, carPaintMat);
      roofMesh.position.set(
        cabinMesh.position.x,
        cabinMesh.position.y + cabinHeight * 0.5,
        0
      );
      roofMesh.castShadow = true;
      carGroup.add(roofMesh);

      // SUV Roof Rails
      if (isSUV) {
        const railGeo = new THREE.CylinderGeometry(0.025, 0.025, cabinLength * 0.85, 16);
        geometriesToDispose.push(railGeo);
        [-1, 1].forEach((sign) => {
          const rail = new THREE.Mesh(railGeo, rimMatGunmetal);
          rail.rotation.z = Math.PI / 2;
          rail.position.set(
            cabinMesh.position.x,
            roofMesh.position.y + 0.08,
            sign * cabinWidth * 0.42
          );
          carGroup.add(rail);
        });
      }

      // Coupe / Sport Rear Wing
      if (isCoupe) {
        const wingSpanGeo = new THREE.BoxGeometry(0.32, 0.04, bodyWidth * 0.88);
        geometriesToDispose.push(wingSpanGeo);
        const wingMesh = new THREE.Mesh(wingSpanGeo, carbonTrimMat);
        wingMesh.position.set(bodyLength * 0.44, rideHeight + bodyHeight * 0.95, 0);
        wingMesh.rotation.z = -0.06;
        wingMesh.castShadow = true;
        carGroup.add(wingMesh);

        [-0.45, 0.45].forEach((pylonZ) => {
          const pylonGeo = new THREE.BoxGeometry(0.18, 0.28, 0.03);
          geometriesToDispose.push(pylonGeo);
          const pylon = new THREE.Mesh(pylonGeo, carbonTrimMat);
          pylon.position.set(
            bodyLength * 0.42,
            rideHeight + bodyHeight * 0.82,
            pylonZ * bodyWidth
          );
          carGroup.add(pylon);
        });
      }
    } else {
      // Truck: Cab + Open Rear Bed
      const cabLength = bodyLength * 0.34;
      const cabHeight = bodyHeight * 0.9;
      const cabWidth = bodyWidth * 0.85;

      const cabGeo = new THREE.BoxGeometry(cabLength, cabHeight, cabWidth);
      geometriesToDispose.push(cabGeo);
      const cabMesh = new THREE.Mesh(cabGeo, glassMat);
      cabMesh.position.set(-0.25, rideHeight + bodyHeight * 0.8, 0);
      carGroup.add(cabMesh);

      const cabRoofGeo = new THREE.BoxGeometry(cabLength * 0.95, 0.05, cabWidth * 0.96);
      geometriesToDispose.push(cabRoofGeo);
      const cabRoof = new THREE.Mesh(cabRoofGeo, carPaintMat);
      cabRoof.position.set(-0.25, cabMesh.position.y + cabHeight * 0.5, 0);
      carGroup.add(cabRoof);

      const bedLength = bodyLength * 0.48;
      const bedWallGeo = new THREE.BoxGeometry(bedLength, bodyHeight * 0.42, 0.08);
      geometriesToDispose.push(bedWallGeo);

      [-1, 1].forEach((sign) => {
        const wall = new THREE.Mesh(bedWallGeo, carPaintMat);
        wall.position.set(bodyLength * 0.24, rideHeight + bodyHeight * 0.55, sign * bodyWidth * 0.44);
        carGroup.add(wall);
      });

      const tailgateGeo = new THREE.BoxGeometry(0.08, bodyHeight * 0.42, bodyWidth * 0.9);
      geometriesToDispose.push(tailgateGeo);
      const tailgate = new THREE.Mesh(tailgateGeo, carPaintMat);
      tailgate.position.set(bodyLength * 0.47, rideHeight + bodyHeight * 0.55, 0);
      carGroup.add(tailgate);
    }

    // --- Headlights & Taillights ---
    const hlGeo = new THREE.BoxGeometry(0.12, 0.08, bodyWidth * 0.26);
    geometriesToDispose.push(hlGeo);

    [-0.32, 0.32].forEach((zSign) => {
      const hlMesh = new THREE.Mesh(hlGeo, headlightMat);
      hlMesh.position.set(-bodyLength * 0.47, rideHeight + bodyHeight * 0.48, zSign * bodyWidth);
      carGroup.add(hlMesh);
    });

    const tlGeo = new THREE.BoxGeometry(0.06, 0.07, bodyWidth * 0.86);
    geometriesToDispose.push(tlGeo);
    const tlMesh = new THREE.Mesh(tlGeo, taillightMat);
    tlMesh.position.set(bodyLength * 0.47, rideHeight + bodyHeight * 0.52, 0);
    carGroup.add(tlMesh);

    // --- 4 Detailed Wheels & Brake Calipers ---
    const wheelRadius = isTruck ? 0.46 : isSUV ? 0.42 : isCoupe ? 0.35 : 0.37;
    const wheelWidth = 0.24;
    const wheelTrack = bodyWidth * 0.48;
    const wheelbase = bodyLength * 0.58;

    const tireGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 28);
    geometriesToDispose.push(tireGeo);
    const rimGeoMesh = new THREE.CylinderGeometry(wheelRadius * 0.68, wheelRadius * 0.68, wheelWidth + 0.01, 20);
    geometriesToDispose.push(rimGeoMesh);
    const rotorGeo = new THREE.CylinderGeometry(wheelRadius * 0.52, wheelRadius * 0.52, 0.02, 16);
    geometriesToDispose.push(rotorGeo);
    const calGeo = new THREE.BoxGeometry(0.12, 0.16, 0.06);
    geometriesToDispose.push(calGeo);

    const wheelPositions = [
      { x: -wheelbase * 0.5, z: wheelTrack },
      { x: -wheelbase * 0.5, z: -wheelTrack },
      { x: wheelbase * 0.5, z: wheelTrack },
      { x: wheelbase * 0.5, z: -wheelTrack },
    ];

    wheelPositions.forEach((wp) => {
      const wheelAssembly = new THREE.Group();
      wheelAssembly.position.set(wp.x, wheelRadius, wp.z);

      const tireMesh = new THREE.Mesh(tireGeo, tireMat);
      tireMesh.rotation.x = Math.PI / 2;
      tireMesh.castShadow = true;
      wheelAssembly.add(tireMesh);

      const rimMesh = new THREE.Mesh(rimGeoMesh, rimMatGunmetal);
      rimMesh.rotation.x = Math.PI / 2;
      wheelAssembly.add(rimMesh);

      const rotorMesh = new THREE.Mesh(rotorGeo, brakeRotorMat);
      rotorMesh.rotation.x = Math.PI / 2;
      wheelAssembly.add(rotorMesh);

      const caliperMesh = new THREE.Mesh(calGeo, caliperMat);
      caliperMesh.position.set(0.08, 0.08, (wp.z > 0 ? 1 : -1) * 0.02);
      wheelAssembly.add(caliperMesh);

      carGroup.add(wheelAssembly);
    });

    // --- Particle Wind Tunnel Streamlines ---
    const PARTICLE_COUNT = 3800;
    const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
    const particleColors = new Float32Array(PARTICLE_COUNT * 3);
    const particleSpeeds = new Float32Array(PARTICLE_COUNT);
    const particleStreams = new Float32Array(PARTICLE_COUNT);
    const particleProgress = new Float32Array(PARTICLE_COUNT);

    // Create glowing radial particle texture
    const pCanvas = document.createElement("canvas");
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext("2d");
    if (pCtx) {
      const pGrad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      pGrad.addColorStop(0, "rgba(255, 255, 255, 1.0)");
      pGrad.addColorStop(0.2, "rgba(0, 245, 255, 0.85)");
      pGrad.addColorStop(0.55, "rgba(0, 140, 255, 0.4)");
      pGrad.addColorStop(1, "rgba(0, 30, 100, 0)");
      pCtx.fillStyle = pGrad;
      pCtx.fillRect(0, 0, 64, 64);
    }
    const particleTex = new THREE.CanvasTexture(pCanvas);
    texturesToDispose.push(particleTex);

    // Initialize particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const streamKind = Math.floor(Math.random() * 4);
      particleStreams[i] = streamKind;

      const startX = -5.0 + Math.random() * 10.0;
      particleProgress[i] = startX;
      particleSpeeds[i] = 3.5 + Math.random() * 2.5;

      const idx = i * 3;
      particlePositions[idx] = startX;
      particlePositions[idx + 1] = 1.0;
      particlePositions[idx + 2] = (Math.random() - 0.5) * 2.0;

      particleColors[idx] = 0.0;
      particleColors[idx + 1] = 0.92;
      particleColors[idx + 2] = 1.0;
    }

    const particleGeo = new THREE.BufferGeometry();
    geometriesToDispose.push(particleGeo);
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      map: particleTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
      opacity: 0,
    });
    materialsToDispose.push(particleMat);

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);
    particleSystemRef.current = particleSystem;

    // --- Static Streamline Tubes / Ribbons for Wind Tunnel Visualization ---
    const streamlinesGroup = new THREE.Group();
    scene.add(streamlinesGroup);
    streamlinesGroupRef.current = streamlinesGroup;
    streamlinesGroup.visible = false;

    const ribbonOffsets = [
      { y: 0.85, z: 0.0 },
      { y: 0.95, z: 0.35 },
      { y: 0.95, z: -0.35 },
      { y: 1.1, z: 0.65 },
      { y: 1.1, z: -0.65 },
      { y: 0.45, z: 0.95 },
      { y: 0.45, z: -0.95 },
      { y: 0.22, z: 0.2 },
      { y: 0.22, z: -0.2 },
    ];

    ribbonOffsets.forEach((ro) => {
      const curvePoints: THREE.Vector3[] = [];
      const numSteps = 40;
      for (let s = 0; s <= numSteps; s++) {
        const x = -5.0 + (s / numSteps) * 10.0;
        let y = ro.y;
        let z = ro.z;

        if (x > -2.2 && x < 2.0) {
          const t = (x + 2.2) / 4.2;
          const arc = Math.sin(t * Math.PI);
          y += arc * 0.42;
          z *= 1.0 + Math.sin(t * Math.PI) * 0.15;
        } else if (x >= 2.0) {
          const w = (x - 2.0) * 1.5;
          y += Math.sin(w * 4) * 0.08 * (x - 2.0);
          z += Math.cos(w * 4) * 0.08 * (x - 2.0);
        }

        curvePoints.push(new THREE.Vector3(x, y, z));
      }

      const curve = new THREE.CatmullRomCurve3(curvePoints);
      const tubeGeo = new THREE.TubeGeometry(curve, 48, 0.009, 6, false);
      geometriesToDispose.push(tubeGeo);

      const tubeMat = new THREE.MeshBasicMaterial({
        color: 0x00f5ff,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });
      materialsToDispose.push(tubeMat);

      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      streamlinesGroup.add(tubeMesh);
    });

    // --- Interaction Handlers (Mouse Drag & Touch Rotation) ---
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      prevPointerRef.current = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - prevPointerRef.current.x;
      const deltaY = clientY - prevPointerRef.current.y;

      prevPointerRef.current = { x: clientX, y: clientY };

      targetRotationRef.current.yaw -= deltaX * 0.007;
      targetRotationRef.current.pitch = Math.max(
        0.12,
        Math.min(0.85, targetRotationRef.current.pitch + deltaY * 0.005)
      );
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetRotationRef.current.distance = Math.max(
        6.2,
        Math.min(14.5, targetRotationRef.current.distance + e.deltaY * 0.006)
      );
    };

    const canvasEl = canvas;
    canvasEl.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    canvasEl.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);
    canvasEl.addEventListener("wheel", onWheel, { passive: false });

    // --- Resize Observer ---
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      }
    });
    resizeObserver.observe(container);

    // --- Visibility / Intersection Observer ---
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isVisible = entry.isIntersecting;
        }
      },
      { threshold: 0.1 }
    );
    intersectionObserver.observe(container);

    // --- Animation & Render Loop ---
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const delta = clock.getDelta();

      // Smooth camera orbit rotation lerp
      if (autoRotateRef.current && !isDraggingRef.current) {
        targetRotationRef.current.yaw += 0.22 * delta;
      }

      rotationRef.current.yaw +=
        (targetRotationRef.current.yaw - rotationRef.current.yaw) * 0.08;
      rotationRef.current.pitch +=
        (targetRotationRef.current.pitch - rotationRef.current.pitch) * 0.08;
      rotationRef.current.distance +=
        (targetRotationRef.current.distance - rotationRef.current.distance) * 0.08;

      const yaw = rotationRef.current.yaw;
      const pitch = rotationRef.current.pitch;
      const dist = rotationRef.current.distance;

      camera.position.x = dist * Math.sin(yaw) * Math.cos(pitch);
      camera.position.y = dist * Math.sin(pitch);
      camera.position.z = dist * Math.cos(yaw) * Math.cos(pitch);
      camera.lookAt(0, 0.72, 0);

      // --- Wind Tunnel Mode Lighting Transition ---
      const inAero = isAeroModeRef.current;
      const targetAmbient = inAero ? 0.35 : 1.2;
      const targetKey = inAero ? 0.8 : 3.5;
      const targetParticleOpacity = inAero ? 0.95 : 0.0;
      const targetStreamlinesVisible = inAero;

      if (ambientLightRef.current) {
        ambientLightRef.current.intensity +=
          (targetAmbient - ambientLightRef.current.intensity) * 0.06;
        ambientLightRef.current.color.lerp(
          new THREE.Color(inAero ? 0x051833 : 0x222a38),
          0.05
        );
      }
      if (keyLightRef.current) {
        keyLightRef.current.intensity +=
          (targetKey - keyLightRef.current.intensity) * 0.06;
      }
      if (rimLight1Ref.current) {
        rimLight1Ref.current.color.lerp(
          new THREE.Color(inAero ? 0x00f0ff : 0xb0d5ff),
          0.06
        );
      }
      if (rimLight2Ref.current) {
        rimLight2Ref.current.color.lerp(
          new THREE.Color(inAero ? 0x0055ff : 0xffd5b0),
          0.06
        );
      }
      if (floorGlowRef.current) {
        const mat = floorGlowRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity += ((inAero ? 0.75 : 0.25) - mat.opacity) * 0.06;
      }
      if (particleMat) {
        particleMat.opacity += (targetParticleOpacity - particleMat.opacity) * 0.06;
      }
      if (streamlinesGroupRef.current) {
        streamlinesGroupRef.current.visible = targetStreamlinesVisible;
      }

      // --- Particle Physics Update in Wind Tunnel ---
      if (particleMat.opacity > 0.05) {
        const positions = particleGeo.attributes.position.array as Float32Array;
        const colors = particleGeo.attributes.color.array as Float32Array;
        const currentSpeedKmH = windSpeedRef.current;
        const speedScale = (currentSpeedKmH / 160) * 1.5;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const stream = particleStreams[i];
          let x = particleProgress[i] + particleSpeeds[i] * delta * speedScale;

          if (x > 5.5) {
            x = -5.0 - Math.random() * 1.5;
            particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 2.2;
          }
          particleProgress[i] = x;

          const idx = i * 3;
          positions[idx] = x;

          let y = 0.8;
          let z = particlePositions[idx + 2];

          if (stream === 0) {
            // Upper laminar flow (Hood -> Windshield -> Roof -> Spoiler)
            if (x < -2.1) {
              y = 0.55 + Math.sin(x * 0.8) * 0.05;
            } else if (x >= -2.1 && x < -0.6) {
              const t = (x + 2.1) / 1.5;
              y = 0.6 + t * 0.35;
            } else if (x >= -0.6 && x < 1.2) {
              const t = (x + 0.6) / 1.8;
              y = 0.95 + Math.sin(t * Math.PI) * 0.32;
            } else if (x >= 1.2 && x < 2.2) {
              const t = (x - 1.2) / 1.0;
              y = 1.15 - t * 0.28;
            } else {
              const w = (x - 2.2) * 2.5;
              y = 0.87 + Math.sin(w * 3 + i) * 0.18;
              z += Math.cos(w * 3 + i) * 0.015;
            }
          } else if (stream === 1) {
            // Flank side streamlines
            y = 0.45 + (Math.sin(x * 1.5) * 0.04);
            if (x > -2.2 && x < 2.0) {
              const flankArc = Math.sin(((x + 2.2) / 4.2) * Math.PI);
              z = Math.sign(z || 1) * (0.95 + flankArc * 0.22);
            }
          } else if (stream === 2) {
            // Underbody Venturi & Diffuser ground effect
            if (x < 1.5) {
              y = 0.18 + Math.random() * 0.04;
            } else {
              const diffT = (x - 1.5) / 2.0;
              y = 0.18 + diffT * 0.65;
            }
          } else {
            y = 1.35 + Math.sin(x + i) * 0.1;
          }

          positions[idx + 1] = y;
          positions[idx + 2] = z;

          if (x > 2.0) {
            colors[idx] = 0.35;
            colors[idx + 1] = 0.45;
            colors[idx + 2] = 1.0;
          } else if (x > -0.6 && x < 1.2) {
            colors[idx] = 0.0;
            colors[idx + 1] = 0.98;
            colors[idx + 2] = 1.0;
          } else {
            colors[idx] = 0.0;
            colors[idx + 1] = 0.82;
            colors[idx + 2] = 0.95;
          }
        }

        particleGeo.attributes.position.needsUpdate = true;
        particleGeo.attributes.color.needsUpdate = true;
      }

      // --- Project 3D Hotspot Positions to 2D Container Screen Coordinates ---
      const coords: Record<string, { x: number; y: number; visible: boolean }> = {};
      const width = container.clientWidth;
      const height = container.clientHeight;

      HOTSPOTS.forEach((hs) => {
        const worldPos = hs.localPos.clone();
        if (carGroupRef.current) {
          carGroupRef.current.localToWorld(worldPos);
        }

        const projected = worldPos.clone().project(camera);

        const isFacing = projected.z < 1.0;
        const screenX = (projected.x * 0.5 + 0.5) * width;
        const screenY = (-projected.y * 0.5 + 0.5) * height;

        coords[hs.id] = {
          x: screenX,
          y: screenY,
          visible: isFacing && screenX > 20 && screenX < width - 20 && screenY > 20 && screenY < height - 20,
        };
      });

      setHotspotScreenCoords(coords);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      canvasEl.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      canvasEl.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
      canvasEl.removeEventListener("wheel", onWheel);

      geometriesToDispose.forEach((g) => g.dispose());
      materialsToDispose.forEach((m) => m.dispose());
      texturesToDispose.forEach((t) => t.dispose());

      renderer.dispose();
    };
  }, [vehicle]);

  const activeHotspot = HOTSPOTS.find((h) => h.id === activeHotspotId);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[540px] sm:h-[620px] lg:h-[680px] bg-[#090b10] rounded-2xl overflow-hidden border border-border-custom shadow-2xl select-none"
      style={{ touchAction: "none" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing outline-none block"
      />

      {/* Top Floating Controls Header */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-20">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface/85 backdrop-blur-md border border-border-custom rounded-lg pointer-events-auto shadow-lg">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isAeroMode ? "bg-[#00f5ff] animate-ping" : "bg-accent"
            }`}
          />
          <span className="text-xs font-bold uppercase tracking-wider text-text-primary">
            {isAeroMode ? "Virtual Wind Tunnel" : "3D Design Studio"}
          </span>
          <span className="text-[10px] text-text-muted px-1.5 py-0.5 bg-black/40 rounded">
            {vehicle.bodyStyle}
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Virtual Wind Tunnel Mode Toggle */}
          <button
            onClick={() => {
              setIsAeroMode((prev) => !prev);
              setActiveHotspotId(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-xl touch-press ${
              isAeroMode
                ? "bg-[#00f5ff] text-black shadow-[#00f5ff]/30 ring-2 ring-[#00f5ff]/50"
                : "bg-surface/90 hover:bg-surface border border-border-custom text-text-primary hover:border-[#00f5ff]/50 hover:text-[#00f5ff]"
            }`}
            title="Toggle Aerodynamic Wind Tunnel Particle Simulation"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isAeroMode ? "animate-pulse" : ""}
            >
              <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
              <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
              <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
            </svg>
            <span>{isAeroMode ? "Studio Mode" : "Aero Wind Tunnel"}</span>
          </button>

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setAutoRotate((prev) => !prev)}
            className={`p-2 rounded-lg border transition-colors touch-press ${
              autoRotate
                ? "bg-accent/20 border-accent text-accent"
                : "bg-surface/90 border-border-custom text-text-muted hover:text-text-primary"
            }`}
            title={autoRotate ? "Pause Turntable Spin" : "Start Turntable Spin"}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
          </button>
        </div>
      </div>

      {/* Aerodynamic Wind Tunnel Telemetry HUD (Visible in Aero Mode) */}
      {isAeroMode && (
        <div className="absolute top-18 left-4 z-20 pointer-events-none max-w-xs animate-in fade-in zoom-in-95 duration-300">
          <div className="p-3.5 bg-black/85 backdrop-blur-xl border border-[#00f5ff]/30 rounded-xl shadow-2xl text-left font-mono">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#00f5ff]/20">
              <span className="text-[11px] font-bold text-[#00f5ff] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00f5ff] animate-ping" />
                Aero Telemetry
              </span>
              <span className="text-[10px] text-text-muted">{aeroSpecs.cd} Cd</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div>
                <div className="text-[10px] text-text-muted uppercase">Drag Coeff.</div>
                <div className="text-base font-bold text-white font-heading">{aeroSpecs.cd} <span className="text-[11px] font-normal text-[#00f5ff]">Cd</span></div>
              </div>
              <div>
                <div className="text-[10px] text-text-muted uppercase">Downforce</div>
                <div className="text-base font-bold text-white font-heading">
                  {aeroSpecs.downforceKg} <span className="text-[11px] font-normal text-[#00f5ff]">kg</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-text-muted uppercase">Top Speed</div>
                <div className="text-sm font-bold text-white font-heading">
                  {vehicle.specs.topSpeedKmh} <span className="text-[10px] font-normal text-text-muted">km/h</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-text-muted uppercase">Tunnel Stream</div>
                <div className="text-sm font-bold text-[#00f5ff] font-heading">{windSpeed} km/h</div>
              </div>
            </div>

            {/* Stream Speed Slider */}
            <div className="mt-3 pt-2 border-t border-[#00f5ff]/20 pointer-events-auto">
              <div className="flex items-center justify-between text-[10px] text-text-muted mb-1">
                <span>Tunnel Velocity</span>
                <span className="text-[#00f5ff] font-bold">{windSpeed} km/h</span>
              </div>
              <input
                type="range"
                min="80"
                max="260"
                step="20"
                value={windSpeed}
                onChange={(e) => setWindSpeed(Number(e.target.value))}
                className="w-full h-1 bg-[#1a2936] rounded-lg appearance-none cursor-pointer accent-[#00f5ff]"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3D Hotspot Interactive Markers */}
      {HOTSPOTS.map((hs) => {
        const coord = hotspotScreenCoords[hs.id];
        if (!coord || !coord.visible) return null;

        const isActive = activeHotspotId === hs.id;

        return (
          <div
            key={hs.id}
            style={{
              transform: `translate(${coord.x}px, ${coord.y}px)`,
              pointerEvents: "auto",
            }}
            className="absolute -top-4 -left-4 z-30 transition-transform duration-75"
          >
            <button
              onClick={() => setActiveHotspotId((prev) => (prev === hs.id ? null : hs.id))}
              className="relative group p-2 focus:outline-none"
              title={`View ${hs.title}`}
              aria-label={`View ${hs.title}`}
            >
              <span
                className={`absolute inset-0 rounded-full animate-ping opacity-60 ${
                  isActive ? "bg-accent" : "bg-[#00f5ff]"
                }`}
              />
              <span
                className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 text-[10px] font-black tracking-tight transition-all duration-300 shadow-xl ${
                  isActive
                    ? "bg-accent border-white text-white scale-110 shadow-accent/50"
                    : "bg-surface/90 border-[#00f5ff] text-[#00f5ff] group-hover:scale-110 shadow-[#00f5ff]/30"
                }`}
              >
                +
              </span>
            </button>
          </div>
        );
      })}

      {/* Expanded Hotspot Spec Pill Card */}
      {activeHotspot && (
        <div className="absolute bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-40 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-[#10131a]/95 backdrop-blur-xl border border-accent/40 rounded-xl p-5 shadow-2xl text-left">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="inline-block px-2 py-0.5 bg-accent/20 text-accent text-[10px] font-bold uppercase tracking-wider rounded mb-1">
                  {activeHotspot.tag}
                </span>
                <h4 className="text-base font-bold text-white font-heading leading-tight">
                  {activeHotspot.title}
                </h4>
                <p className="text-xs text-text-muted">{activeHotspot.subtitle}</p>
              </div>
              <button
                onClick={() => setActiveHotspotId(null)}
                className="text-text-muted hover:text-white p-1 rounded-md hover:bg-surface/50 transition-colors"
                aria-label="Close hotspot pill"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-border-custom/80 text-xs">
              {activeHotspot.getDetails(vehicle).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-1 border-b border-border-custom/40 last:border-0">
                  <span className="text-text-muted">{item.label}</span>
                  <span className="font-bold text-text-primary font-mono">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Paint Color Customizer Chips */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 pointer-events-none z-20">
        <div className="flex items-center gap-2 p-2 bg-surface/85 backdrop-blur-md border border-border-custom rounded-xl pointer-events-auto overflow-x-auto max-w-full hide-scrollbar shadow-xl">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider px-2 hidden sm:inline">
            Paint
          </span>
          <div className="flex items-center gap-1.5">
            {PAINT_PALETTE.map((color) => {
              const isSelected = selectedColor.toLowerCase() === color.hex.toLowerCase();
              return (
                <button
                  key={color.hex}
                  onClick={() => setSelectedColor(color.hex)}
                  className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-transform touch-press focus:outline-none ${
                    isSelected ? "scale-115 ring-2 ring-white ring-offset-2 ring-offset-black" : "opacity-80 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.label}
                  aria-label={`Select ${color.label} paint`}
                >
                  {isSelected && (
                    <span className="absolute inset-0 flex items-center justify-center text-white">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Orbit Helper Tip */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg text-[11px] text-text-muted border border-white/5 pointer-events-auto">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20M2 12h20M12 2a10 10 0 0 1 10 10M12 22a10 10 0 0 1-10-10" />
          </svg>
          <span>Drag to orbit · Scroll to zoom</span>
        </div>
      </div>
    </div>
  );
}
