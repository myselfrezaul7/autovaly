"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import * as THREE from "three";
import Link from "next/link";
import Price from "../ui/Price";
import type { Vehicle } from "@/lib/types";

export interface GarageVaultCanvasProps {
  garage: Vehicle[];
  selectedForCompare?: string[];
  onToggleCompare?: (slug: string) => void;
  onRemoveVehicle?: (id: string) => void;
}

interface UnderglowColor {
  id: string;
  name: string;
  hex: string;
  threeColor: number;
}

const UNDERGLOW_PALETTE: UnderglowColor[] = [
  { id: "cyan", name: "Cyber Cyan", hex: "#00D2D3", threeColor: 0x00d2d3 },
  { id: "crimson", name: "Hyper Red", hex: "#E8232A", threeColor: 0xe8232a },
  { id: "amber", name: "Electric Amber", hex: "#F59E0B", threeColor: 0xf59e0b },
  { id: "emerald", name: "Acid Lime", hex: "#10B981", threeColor: 0x10b981 },
  { id: "purple", name: "Ultraviolet", hex: "#A855F7", threeColor: 0xa855f7 },
  { id: "ice", name: "Stealth Ice", hex: "#E2E8F0", threeColor: 0xe2e8f0 },
];

type CameraPreset = "orbit" | "front" | "side" | "top";

// Helper to create a procedural wet concrete grid canvas texture
function createFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "#090b10";
    ctx.fillRect(0, 0, 1024, 1024);

    ctx.strokeStyle = "#161b26";
    ctx.lineWidth = 4;
    const tileSize = 256;
    for (let x = 0; x <= 1024; x += tileSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1024);
      ctx.stroke();
    }
    for (let y = 0; y <= 1024; y += tileSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    const imgData = ctx.getImageData(0, 0, 1024, 1024);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = (Math.random() - 0.5) * 14;
      data[i] = Math.min(255, Math.max(0, data[i] + n));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n + 4));
    }
    ctx.putImageData(imgData, 0, 0);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  return texture;
}

// Helper to create a high-tech bay ring marking texture
function createBayMarkingTexture(bayNum: number): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, 512, 512);

    const cx = 256;
    const cy = 256;

    ctx.strokeStyle = "rgba(0, 210, 211, 0.4)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, 230, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(232, 35, 42, 0.5)";
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 16]);
    ctx.beginPath();
    ctx.arc(cx, cy, 210, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, 16); ctx.lineTo(cx, 40);
    ctx.moveTo(cx, 472); ctx.lineTo(cx, 496);
    ctx.moveTo(16, cy); ctx.lineTo(40, cy);
    ctx.moveTo(472, cy); ctx.lineTo(496, cy);
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "bold 28px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`// DOCK BAY 0${bayNum} //`, cx, cy - 130);

    ctx.fillStyle = "rgba(0, 210, 211, 0.4)";
    ctx.font = "bold 16px monospace";
    ctx.fillText("HIGH-SEC VIRTUAL VAULT", cx, cy + 130);
  }

  return new THREE.CanvasTexture(canvas);
}

// Helper to create radial underglow texture
function createUnderglowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const gradient = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.7)");
    gradient.addColorStop(0.7, "rgba(255, 255, 255, 0.2)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
  }

  return new THREE.CanvasTexture(canvas);
}

// Procedural 3D Car Mesh Builder
function buildProceduralCar(
  vehicle: Vehicle,
  underglowColor: UnderglowColor,
  sharedUnderglowTex: THREE.CanvasTexture
): {
  root: THREE.Group;
  turntableNode: THREE.Group;
  underglowLight: THREE.PointLight;
  underglowPlaneMat: THREE.MeshBasicMaterial;
  headlightLights: THREE.SpotLight[];
} {
  const root = new THREE.Group();
  root.name = `vehicle-root-${vehicle.id}`;

  const turntableNode = new THREE.Group();
  root.add(turntableNode);

  // Derive paint color
  let paintColor = 0x222630;
  if (vehicle.coverGradient?.from) {
    try {
      paintColor = new THREE.Color(vehicle.coverGradient.from).getHex();
    } catch {
      paintColor = 0xe8232a;
    }
  } else if (vehicle.fuelType === "BEV") {
    paintColor = 0x1e3a8a;
  } else if (vehicle.priceEur > 150000) {
    paintColor = 0xe8232a;
  }

  const paintMat = new THREE.MeshStandardMaterial({
    color: paintColor,
    metalness: 0.85,
    roughness: 0.2,
    envMapIntensity: 1.4,
  });

  const carbonMat = new THREE.MeshStandardMaterial({
    color: 0x12141a,
    metalness: 0.3,
    roughness: 0.5,
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x05070a,
    metalness: 0.95,
    roughness: 0.05,
    transparent: true,
    opacity: 0.88,
  });

  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x14161b,
    metalness: 0.1,
    roughness: 0.85,
  });

  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xbfc5d2,
    metalness: 0.9,
    roughness: 0.18,
  });

  const caliperMat = new THREE.MeshStandardMaterial({
    color: 0xe8232a,
    metalness: 0.6,
    roughness: 0.3,
  });

  const headlightMat = new THREE.MeshBasicMaterial({
    color: 0xf8fafc,
  });

  const taillightMat = new THREE.MeshBasicMaterial({
    color: 0xff1a35,
  });

  // 1. Lower aerodynamic chassis tub
  const chassisGeom = new THREE.BoxGeometry(1.9, 0.38, 4.3);
  const chassisMesh = new THREE.Mesh(chassisGeom, paintMat);
  chassisMesh.position.y = 0.44;
  chassisMesh.castShadow = true;
  chassisMesh.receiveShadow = true;
  turntableNode.add(chassisMesh);

  // 2. Sculpted front nose
  const noseGeom = new THREE.BoxGeometry(1.82, 0.24, 1.45);
  const noseMesh = new THREE.Mesh(noseGeom, paintMat);
  noseMesh.position.set(0, 0.48, 1.35);
  noseMesh.rotation.x = 0.06;
  noseMesh.castShadow = true;
  turntableNode.add(noseMesh);

  // 3. Cabin / Cockpit Canopy
  const cabinGeom = new THREE.BoxGeometry(1.42, 0.44, 2.0);
  const cabinMesh = new THREE.Mesh(cabinGeom, glassMat);
  cabinMesh.position.set(0, 0.82, -0.15);
  cabinMesh.castShadow = true;
  turntableNode.add(cabinMesh);

  // Roof
  const roofGeom = new THREE.BoxGeometry(1.36, 0.08, 1.6);
  const roofMesh = new THREE.Mesh(roofGeom, paintMat);
  roofMesh.position.set(0, 1.05, -0.15);
  roofMesh.castShadow = true;
  turntableNode.add(roofMesh);

  // 4. Front carbon splitter
  const splitterGeom = new THREE.BoxGeometry(1.98, 0.06, 0.55);
  const splitterMesh = new THREE.Mesh(splitterGeom, carbonMat);
  splitterMesh.position.set(0, 0.24, 2.05);
  splitterMesh.castShadow = true;
  turntableNode.add(splitterMesh);

  // 5. Side skirts
  const skirtLeftGeom = new THREE.BoxGeometry(0.12, 0.1, 2.8);
  const skirtLeft = new THREE.Mesh(skirtLeftGeom, carbonMat);
  skirtLeft.position.set(-0.96, 0.26, 0);
  turntableNode.add(skirtLeft);

  const skirtRight = new THREE.Mesh(skirtLeftGeom, carbonMat);
  skirtRight.position.set(0.96, 0.26, 0);
  turntableNode.add(skirtRight);

  // 6. Rear diffuser & aerodynamic wing
  const diffuserGeom = new THREE.BoxGeometry(1.92, 0.22, 0.45);
  const diffuserMesh = new THREE.Mesh(diffuserGeom, carbonMat);
  diffuserMesh.position.set(0, 0.32, -2.15);
  diffuserMesh.rotation.x = -0.15;
  turntableNode.add(diffuserMesh);

  // Rear active wing
  const wingBladeGeom = new THREE.BoxGeometry(1.95, 0.05, 0.4);
  const wingBlade = new THREE.Mesh(wingBladeGeom, carbonMat);
  wingBlade.position.set(0, 1.08, -1.95);
  turntableNode.add(wingBlade);

  const strutGeom = new THREE.BoxGeometry(0.04, 0.35, 0.16);
  const strutL = new THREE.Mesh(strutGeom, carbonMat);
  strutL.position.set(-0.55, 0.9, -1.95);
  turntableNode.add(strutL);

  const strutR = new THREE.Mesh(strutGeom, carbonMat);
  strutR.position.set(0.55, 0.9, -1.95);
  turntableNode.add(strutR);

  // 7. LED Headlights
  const headlightGeom = new THREE.BoxGeometry(0.42, 0.06, 0.08);
  const headL = new THREE.Mesh(headlightGeom, headlightMat);
  headL.position.set(-0.68, 0.52, 2.12);
  headL.rotation.y = 0.15;
  turntableNode.add(headL);

  const headR = new THREE.Mesh(headlightGeom, headlightMat);
  headR.position.set(0.68, 0.52, 2.12);
  headR.rotation.y = -0.15;
  turntableNode.add(headR);

  // Headlight spot beams
  const spotL = new THREE.SpotLight(0xf0f9ff, 3.5, 14, Math.PI / 6, 0.6, 1.2);
  spotL.position.set(-0.68, 0.52, 2.15);
  const spotTargetL = new THREE.Object3D();
  spotTargetL.position.set(-0.68, 0, 10);
  turntableNode.add(spotTargetL);
  spotL.target = spotTargetL;
  turntableNode.add(spotL);

  const spotR = new THREE.SpotLight(0xf0f9ff, 3.5, 14, Math.PI / 6, 0.6, 1.2);
  spotR.position.set(0.68, 0.52, 2.15);
  const spotTargetR = new THREE.Object3D();
  spotTargetR.position.set(0.68, 0, 10);
  turntableNode.add(spotTargetR);
  spotR.target = spotTargetR;
  turntableNode.add(spotR);

  // 8. Full-width Rear Cyber Light Bar
  const tailGeom = new THREE.BoxGeometry(1.72, 0.05, 0.06);
  const tailMesh = new THREE.Mesh(tailGeom, taillightMat);
  tailMesh.position.set(0, 0.62, -2.14);
  turntableNode.add(tailMesh);

  // 9. 4 Alloy Wheels with Calipers
  const wheelPositions = [
    { x: -0.98, y: 0.38, z: 1.35 },
    { x: 0.98, y: 0.38, z: 1.35 },
    { x: -1.0, y: 0.40, z: -1.35 },
    { x: 1.0, y: 0.40, z: -1.35 },
  ];

  wheelPositions.forEach((pos, idx) => {
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(pos.x, pos.y, pos.z);

    const tireRadius = idx >= 2 ? 0.40 : 0.38;
    const tireWidth = idx >= 2 ? 0.28 : 0.24;
    const tireGeom = new THREE.CylinderGeometry(tireRadius, tireRadius, tireWidth, 24);
    tireGeom.rotateZ(Math.PI / 2);
    const tireMesh = new THREE.Mesh(tireGeom, tireMat);
    tireMesh.castShadow = true;
    wheelGroup.add(tireMesh);

    const rimGeom = new THREE.CylinderGeometry(tireRadius * 0.65, tireRadius * 0.65, tireWidth + 0.01, 16);
    rimGeom.rotateZ(Math.PI / 2);
    const rimMesh = new THREE.Mesh(rimGeom, rimMat);
    wheelGroup.add(rimMesh);

    const caliperGeom = new THREE.BoxGeometry(0.1, 0.16, 0.08);
    const caliperMesh = new THREE.Mesh(caliperGeom, caliperMat);
    caliperMesh.position.set(pos.x > 0 ? -0.06 : 0.06, 0.12, 0);
    wheelGroup.add(caliperMesh);

    turntableNode.add(wheelGroup);
  });

  // 10. Underglow Point Light & Glow Quad
  const underglowLight = new THREE.PointLight(underglowColor.threeColor, 3.0, 5.0, 1.5);
  underglowLight.position.set(0, 0.12, 0);
  turntableNode.add(underglowLight);

  const underglowPlaneMat = new THREE.MeshBasicMaterial({
    color: underglowColor.threeColor,
    map: sharedUnderglowTex,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const underglowPlaneGeom = new THREE.PlaneGeometry(2.4, 4.4);
  underglowPlaneGeom.rotateX(-Math.PI / 2);
  const underglowPlane = new THREE.Mesh(underglowPlaneGeom, underglowPlaneMat);
  underglowPlane.position.set(0, 0.03, 0);
  turntableNode.add(underglowPlane);

  return {
    root,
    turntableNode,
    underglowLight,
    underglowPlaneMat,
    headlightLights: [spotL, spotR],
  };
}

export default function GarageVaultCanvas({
  garage,
  selectedForCompare = [],
  onToggleCompare,
  onRemoveVehicle,
}: GarageVaultCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeBayIndex, setActiveBayIndex] = useState(0);
  const [selectedUnderglow, setSelectedUnderglow] = useState<UnderglowColor>(UNDERGLOW_PALETTE[0]);
  const [turntableActive, setTurntableActive] = useState(true);
  const [headlightsActive, setHeadlightsActive] = useState(true);
  const [cameraMode, setCameraMode] = useState<CameraPreset>("orbit");

  const safeActiveIndex = useMemo(() => {
    if (garage.length === 0) return 0;
    return Math.max(0, Math.min(activeBayIndex, garage.length - 1));
  }, [garage.length, activeBayIndex]);

  const activeVehicle = garage[safeActiveIndex] || null;

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(true);

  const camStateRef = useRef({
    azimuth: 0.45,
    targetAzimuth: 0.45,
    elevation: 0.38,
    targetElevation: 0.38,
    distance: 7.6,
    targetDistance: 7.6,
    currentLookAt: new THREE.Vector3(0, 0.85, 0),
    targetLookAt: new THREE.Vector3(0, 0.85, 0),
    isDragging: false,
    prevPointerX: 0,
    prevPointerY: 0,
  });

  const carNodesRef = useRef<
    Array<{
      root: THREE.Group;
      turntableNode: THREE.Group;
      underglowLight: THREE.PointLight;
      underglowPlaneMat: THREE.MeshBasicMaterial;
      headlightLights: THREE.SpotLight[];
      bayCenter: THREE.Vector3;
    }>
  >([]);

  const emptyHologramRef = useRef<THREE.Mesh | null>(null);

  const baySpacing = 6.2;

  const getBayPosition = useCallback(
    (index: number) => {
      if (garage.length <= 1) {
        return new THREE.Vector3(0, 0, 0);
      }
      const totalWidth = (garage.length - 1) * baySpacing;
      const x = index * baySpacing - totalWidth / 2;
      const arcZ = -Math.pow((index - (garage.length - 1) / 2) / Math.max(1, garage.length), 2) * 1.8;
      return new THREE.Vector3(x, 0, arcZ);
    },
    [garage.length, baySpacing]
  );

  // Update target camera position when safeActiveIndex or cameraMode changes
  useEffect(() => {
    const bayPos = getBayPosition(safeActiveIndex);
    const cs = camStateRef.current;

    cs.targetLookAt.set(bayPos.x, bayPos.y + 0.85, bayPos.z);

    if (cameraMode === "front") {
      cs.targetAzimuth = 0;
      cs.targetElevation = 0.25;
      cs.targetDistance = 6.8;
    } else if (cameraMode === "side") {
      cs.targetAzimuth = Math.PI / 2;
      cs.targetElevation = 0.22;
      cs.targetDistance = 7.2;
    } else if (cameraMode === "top") {
      cs.targetAzimuth = 0;
      cs.targetElevation = 1.35;
      cs.targetDistance = 9.0;
    } else {
      cs.targetAzimuth = 0.45;
      cs.targetElevation = 0.38;
      cs.targetDistance = 7.6;
    }
  }, [safeActiveIndex, cameraMode, getBayPosition]);

  // Update underglow colors
  useEffect(() => {
    carNodesRef.current.forEach((node) => {
      node.underglowLight.color.setHex(selectedUnderglow.threeColor);
      node.underglowPlaneMat.color.setHex(selectedUnderglow.threeColor);
    });
  }, [selectedUnderglow]);

  // Update headlights
  useEffect(() => {
    carNodesRef.current.forEach((node) => {
      node.headlightLights.forEach((light) => {
        light.intensity = headlightsActive ? 3.5 : 0;
      });
    });
  }, [headlightsActive]);

  // Main Three.js Scene Setup & Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
      alpha: false,
    });
    rendererRef.current = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x090b10);
    scene.fog = new THREE.FogExp2(0x090b10, 0.022);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.2,
      120
    );
    cameraRef.current = camera;
    camera.position.set(0, 4, 10);

    const ambientLight = new THREE.AmbientLight(0x181e2b, 1.6);
    scene.add(ambientLight);

    const ceilingDirectional = new THREE.DirectionalLight(0x718096, 1.2);
    ceilingDirectional.position.set(0, 14, 6);
    scene.add(ceilingDirectional);

    const floorTexture = createFloorTexture();
    const floorGeom = new THREE.PlaneGeometry(120, 120);
    floorGeom.rotateX(-Math.PI / 2);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x07090e,
      roughness: 0.16,
      metalness: 0.88,
      map: floorTexture,
      envMapIntensity: 1.2,
    });
    const floorMesh = new THREE.Mesh(floorGeom, floorMat);
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const wallGeom = new THREE.PlaneGeometry(120, 16);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x11141c,
      roughness: 0.7,
      metalness: 0.4,
    });
    const wallMesh = new THREE.Mesh(wallGeom, wallMat);
    wallMesh.position.set(0, 8, -20);
    scene.add(wallMesh);

    const ledWallGeom = new THREE.BoxGeometry(120, 0.1, 0.05);
    const ledWallMat = new THREE.MeshBasicMaterial({ color: 0x00d2d3 });
    const ledWall = new THREE.Mesh(ledWallGeom, ledWallMat);
    ledWall.position.set(0, 2.2, -19.9);
    scene.add(ledWall);

    for (let gz = -16; gz <= 16; gz += 8) {
      const girderGeom = new THREE.BoxGeometry(100, 0.6, 0.4);
      const girderMat = new THREE.MeshStandardMaterial({ color: 0x1a1e27, metalness: 0.8, roughness: 0.4 });
      const girder = new THREE.Mesh(girderGeom, girderMat);
      girder.position.set(0, 12, gz);
      scene.add(girder);
    }

    const sharedUnderglowTex = createUnderglowTexture();

    carNodesRef.current = [];

    if (garage.length === 0) {
      const pedestalGeom = new THREE.CylinderGeometry(3.0, 3.2, 0.22, 48);
      const pedestalMat = new THREE.MeshStandardMaterial({
        color: 0x121620,
        metalness: 0.8,
        roughness: 0.25,
      });
      const pedestal = new THREE.Mesh(pedestalGeom, pedestalMat);
      pedestal.position.set(0, 0.11, 0);
      pedestal.receiveShadow = true;
      scene.add(pedestal);

      const ringGeom = new THREE.RingGeometry(2.95, 3.1, 48);
      ringGeom.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xe8232a,
        side: THREE.DoubleSide,
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.position.set(0, 0.23, 0);
      scene.add(ringMesh);

      const holoGeom = new THREE.IcosahedronGeometry(1.2, 1);
      const holoMat = new THREE.MeshBasicMaterial({
        color: 0x00d2d3,
        wireframe: true,
        transparent: true,
        opacity: 0.75,
      });
      const holoMesh = new THREE.Mesh(holoGeom, holoMat);
      holoMesh.position.set(0, 1.6, 0);
      scene.add(holoMesh);
      emptyHologramRef.current = holoMesh;

      const spot = new THREE.SpotLight(0x00d2d3, 4.0, 18, Math.PI / 5, 0.5, 1.2);
      spot.position.set(0, 11, 0);
      spot.target = pedestal;
      scene.add(spot);
    } else {
      garage.forEach((vehicle, idx) => {
        const bayPos = getBayPosition(idx);

        const pedestalGeom = new THREE.CylinderGeometry(2.9, 3.1, 0.18, 48);
        const pedestalMat = new THREE.MeshStandardMaterial({
          color: 0x10131b,
          metalness: 0.85,
          roughness: 0.22,
        });
        const pedestal = new THREE.Mesh(pedestalGeom, pedestalMat);
        pedestal.position.set(bayPos.x, 0.09, bayPos.z);
        pedestal.receiveShadow = true;
        scene.add(pedestal);

        const ringGeom = new THREE.RingGeometry(2.88, 3.02, 48);
        ringGeom.rotateX(-Math.PI / 2);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x00d2d3,
          side: THREE.DoubleSide,
        });
        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.position.set(bayPos.x, 0.19, bayPos.z);
        scene.add(ringMesh);

        const markingTex = createBayMarkingTexture(idx + 1);
        const markingGeom = new THREE.PlaneGeometry(5.2, 5.2);
        markingGeom.rotateX(-Math.PI / 2);
        const markingMat = new THREE.MeshBasicMaterial({
          map: markingTex,
          transparent: true,
          opacity: 0.7,
          depthWrite: false,
        });
        const markingMesh = new THREE.Mesh(markingGeom, markingMat);
        markingMesh.position.set(bayPos.x, 0.2, bayPos.z);
        scene.add(markingMesh);

        const coneGeom = new THREE.CylinderGeometry(0.35, 2.9, 9.8, 32, 1, true);
        const coneMat = new THREE.MeshBasicMaterial({
          color: 0xdbeafe,
          transparent: true,
          opacity: 0.065,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const coneMesh = new THREE.Mesh(coneGeom, coneMat);
        coneMesh.position.set(bayPos.x, 5.2, bayPos.z);
        scene.add(coneMesh);

        const baySpot = new THREE.SpotLight(0xffffff, 5.5, 20, Math.PI / 4.5, 0.4, 1.2);
        baySpot.position.set(bayPos.x, 10.5, bayPos.z);
        baySpot.target = pedestal;
        baySpot.castShadow = true;
        baySpot.shadow.bias = -0.0005;
        scene.add(baySpot);

        const carData = buildProceduralCar(vehicle, selectedUnderglow, sharedUnderglowTex);
        carData.root.position.copy(bayPos);
        carData.root.position.y = 0.18;
        scene.add(carData.root);

        carNodesRef.current.push({
          root: carData.root,
          turntableNode: carData.turntableNode,
          underglowLight: carData.underglowLight,
          underglowPlaneMat: carData.underglowPlaneMat,
          headlightLights: carData.headlightLights,
          bayCenter: bayPos,
        });
      });
    }

    let clock = new THREE.Clock();

    const animate = () => {
      if (!isAnimatingRef.current) return;
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (emptyHologramRef.current) {
        emptyHologramRef.current.rotation.y += delta * 0.8;
        emptyHologramRef.current.rotation.x = Math.sin(elapsed * 1.5) * 0.2;
        emptyHologramRef.current.position.y = 1.6 + Math.sin(elapsed * 2) * 0.12;
      }

      if (turntableActive && carNodesRef.current.length > 0) {
        const activeNode = carNodesRef.current[safeActiveIndex];
        if (activeNode) {
          activeNode.turntableNode.rotation.y += delta * 0.45;
        }
      }

      const cs = camStateRef.current;
      cs.azimuth += (cs.targetAzimuth - cs.azimuth) * 0.08;
      cs.elevation += (cs.targetElevation - cs.elevation) * 0.08;
      cs.distance += (cs.targetDistance - cs.distance) * 0.08;

      cs.currentLookAt.lerp(cs.targetLookAt, 0.07);

      const camX = cs.currentLookAt.x + cs.distance * Math.sin(cs.azimuth) * Math.cos(cs.elevation);
      const camY = cs.currentLookAt.y + cs.distance * Math.sin(cs.elevation);
      const camZ = cs.currentLookAt.z + cs.distance * Math.cos(cs.azimuth) * Math.cos(cs.elevation);

      camera.position.set(camX, camY, camZ);
      camera.lookAt(cs.currentLookAt);

      renderer.render(scene, camera);
    };

    isAnimatingRef.current = true;
    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!isAnimatingRef.current) {
              isAnimatingRef.current = true;
              clock = new THREE.Clock();
              animate();
            }
          } else {
            isAnimatingRef.current = false;
            if (animFrameIdRef.current) {
              cancelAnimationFrame(animFrameIdRef.current);
            }
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    const handleVisibility = () => {
      if (document.hidden) {
        isAnimatingRef.current = false;
        if (animFrameIdRef.current) {
          cancelAnimationFrame(animFrameIdRef.current);
        }
      } else {
        if (!isAnimatingRef.current) {
          isAnimatingRef.current = true;
          clock = new THREE.Clock();
          animate();
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", handleResize);

      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          if (obj.geometry) obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else if (obj.material) {
            obj.material.dispose();
          }
        }
      });

      floorTexture.dispose();
      sharedUnderglowTex.dispose();
      renderer.dispose();
    };
  }, [garage, getBayPosition, safeActiveIndex, turntableActive, selectedUnderglow]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const cs = camStateRef.current;
    cs.isDragging = true;
    cs.prevPointerX = e.clientX;
    cs.prevPointerY = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const cs = camStateRef.current;
    if (!cs.isDragging) return;

    const deltaX = e.clientX - cs.prevPointerX;
    const deltaY = e.clientY - cs.prevPointerY;
    cs.prevPointerX = e.clientX;
    cs.prevPointerY = e.clientY;

    cs.targetAzimuth -= deltaX * 0.007;
    cs.targetElevation = Math.max(0.08, Math.min(1.42, cs.targetElevation + deltaY * 0.005));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const cs = camStateRef.current;
    cs.isDragging = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const cs = camStateRef.current;
    cs.targetDistance = Math.max(4.0, Math.min(14.0, cs.targetDistance + e.deltaY * 0.006));
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const camera = cameraRef.current;
    const scene = sceneRef.current;
    if (!canvas || !camera || !scene || garage.length <= 1) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    const hitObjects = carNodesRef.current.map((c) => c.root);
    const intersects = raycaster.intersectObjects(hitObjects, true);

    if (intersects.length > 0) {
      let topHit: THREE.Object3D | null = intersects[0].object;
      while (topHit && topHit.parent && topHit.parent !== scene) {
        const foundIdx = carNodesRef.current.findIndex((c) => c.root === topHit);
        if (foundIdx !== -1) {
          setActiveBayIndex(foundIdx);
          return;
        }
        topHit = topHit.parent;
      }
    }
  };

  const isCurrentInCompare = activeVehicle
    ? selectedForCompare.includes(activeVehicle.slug)
    : false;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[660px] md:h-[720px] rounded-3xl bg-[#090b10] border border-border-custom/80 overflow-hidden select-none shadow-2xl"
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-grab active:cursor-grabbing block touch-none"
      />

      {/* Top HUD Bar */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-black/80 backdrop-blur-md rounded-full text-[11px] font-bold tracking-widest uppercase text-accent border border-accent/30 shadow-lg flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span>3D VAULT SHOWROOM</span>
          </span>
          {garage.length > 0 && (
            <span className="px-3 py-1 bg-black/75 backdrop-blur-md rounded-full text-[11px] font-bold text-text-light border border-white/10 shadow-lg">
              BAY 0{safeActiveIndex + 1} / 0{garage.length}
            </span>
          )}
        </div>

        {/* Camera Angles Preset Selector */}
        <div className="flex items-center gap-1 bg-black/75 backdrop-blur-md p-1 rounded-2xl border border-white/10 shadow-lg pointer-events-auto">
          {(["orbit", "front", "side", "top"] as CameraPreset[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setCameraMode(mode)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                cameraMode === mode
                  ? "bg-accent text-white shadow-md"
                  : "text-text-muted hover:text-text-light hover:bg-white/5"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State Banner Overlay */}
      {garage.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
          <div className="max-w-md p-8 rounded-3xl bg-black/80 backdrop-blur-xl border border-border-custom/80 shadow-2xl pointer-events-auto">
            <div className="w-16 h-16 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center mx-auto mb-4 text-3xl">
              🏛️
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1 block">
              VAULT STANDBY // 0 UNITS DOCKED
            </span>
            <h3 className="text-2xl font-heading font-extrabold text-text-light mb-2">
              Virtual Garage Vault
            </h3>
            <p className="text-xs text-text-muted leading-relaxed mb-6">
              Your 3D private showroom is ready. Browse the catalog and bookmark vehicles to park and inspect them here in full 3D.
            </p>
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-accent/25 transition-all touch-press active:scale-95"
            >
              <span>Explore Vehicle Catalog</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      )}

      {/* Active Vehicle Floating Telemetry Card */}
      {activeVehicle && (
        <div className="absolute bottom-24 md:bottom-28 left-4 max-w-[340px] p-4 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/15 shadow-2xl pointer-events-auto z-10 transition-all">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent block">
                {activeVehicle.make}
              </span>
              <h2 className="text-base sm:text-lg font-heading font-extrabold text-text-light truncate">
                {activeVehicle.model}
              </h2>
              <p className="text-[11px] text-text-muted truncate">{activeVehicle.trim}</p>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted block">
                MSRP
              </span>
              <Price
                eurAmount={activeVehicle.priceEur}
                usdAmount={activeVehicle.priceUsd}
                className="text-xs sm:text-sm font-bold text-text-light tabular-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 py-2 my-2 border-y border-white/10 text-center">
            <div>
              <span className="text-[9px] uppercase font-bold text-text-muted block">0-60 MPH</span>
              <span className="text-xs font-extrabold text-text-light">
                {activeVehicle.specs.acceleration060}s
              </span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-text-muted block">POWER</span>
              <span className="text-xs font-extrabold text-text-light">
                {activeVehicle.specs.powerHp} HP
              </span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-text-muted block">TOP SPEED</span>
              <span className="text-xs font-extrabold text-text-light">
                {activeVehicle.specs.topSpeedKmh} km/h
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            {onToggleCompare && (
              <button
                type="button"
                onClick={() => onToggleCompare(activeVehicle.slug)}
                className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isCurrentInCompare
                    ? "bg-accent text-white shadow-md shadow-accent/20"
                    : "bg-surface hover:bg-surface-hover text-text-light border border-border-custom"
                }`}
              >
                {isCurrentInCompare ? "✓ In Compare" : "+ Compare"}
              </button>
            )}

            <Link
              href={`/vehicles/${activeVehicle.slug}`}
              className="py-1.5 px-3 bg-surface hover:bg-surface-hover border border-border-custom text-text-light rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all text-center"
            >
              Specs →
            </Link>

            {onRemoveVehicle && (
              <button
                type="button"
                onClick={() => onRemoveVehicle(activeVehicle.id)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-surface hover:bg-red-500/20 text-text-muted hover:text-red-400 border border-border-custom text-xs transition-colors cursor-pointer"
                title="Remove from garage"
                aria-label="Remove vehicle from garage"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bottom Floating Control Dock */}
      {garage.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 flex flex-col md:flex-row items-center justify-between gap-3 pointer-events-none z-10">
          {/* Bay Selector Carousel */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 px-2 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10 shadow-lg pointer-events-auto scrollbar-none">
            {garage.map((veh, idx) => {
              const isActive = idx === safeActiveIndex;
              return (
                <button
                  key={veh.id}
                  type="button"
                  onClick={() => setActiveBayIndex(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-accent text-white shadow-md shadow-accent/25"
                      : "text-text-muted hover:text-text-light hover:bg-white/5"
                  }`}
                >
                  <span className="opacity-70 text-[10px]">BAY 0{idx + 1}</span>
                  <span>{veh.model}</span>
                </button>
              );
            })}
          </div>

          {/* Underglow Neon & Showroom Controls */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10 shadow-lg pointer-events-auto">
            <div className="flex items-center gap-1.5 px-2 border-r border-white/10">
              <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted hidden sm:inline">
                Underglow:
              </span>
              {UNDERGLOW_PALETTE.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedUnderglow(c)}
                  title={c.name}
                  aria-label={`Set underglow color to ${c.name}`}
                  className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                    selectedUnderglow.id === c.id
                      ? "scale-125 ring-2 ring-white ring-offset-1 ring-offset-black"
                      : "opacity-70 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setTurntableActive(!turntableActive)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                turntableActive
                  ? "bg-white/20 text-white"
                  : "text-text-muted hover:text-text-light"
              }`}
            >
              🔄 360° {turntableActive ? "ON" : "OFF"}
            </button>

            <button
              type="button"
              onClick={() => setHeadlightsActive(!headlightsActive)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                headlightsActive
                  ? "bg-white/20 text-white"
                  : "text-text-muted hover:text-text-light"
              }`}
            >
              💡 Beams {headlightsActive ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
