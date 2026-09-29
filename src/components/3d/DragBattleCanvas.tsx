"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Vehicle } from "@/lib/types";

// ==========================================
// Types & Interfaces
// ==========================================
export type CameraMode = "drone" | "side" | "finish" | "cockpit";
export type SpeedUnit = "kmh" | "mph";
export type BattleStatus = "idle" | "countdown" | "racing" | "finished";

export interface DragBattleCanvasProps {
  carA: Vehicle;
  carB: Vehicle;
  onViewSpecs?: () => void;
}

interface TreeBulbMeshes {
  preStage: THREE.MeshStandardMaterial[];
  stage: THREE.MeshStandardMaterial[];
  amber1: THREE.MeshStandardMaterial[];
  amber2: THREE.MeshStandardMaterial[];
  amber3: THREE.MeshStandardMaterial[];
  green: THREE.MeshStandardMaterial[];
  red: THREE.MeshStandardMaterial[];
  glowLight: THREE.PointLight;
}

interface CarVisualGroup {
  root: THREE.Group;
  wheels: THREE.Group[];
  headlights: THREE.Light[];
  taillightMesh: THREE.Mesh;
  exhaustFlames: THREE.Mesh[];
  bodyMesh: THREE.Mesh;
}

// ==========================================
// Helper Functions
// ==========================================
function parseHexColor(colorStr?: string, fallback = 0xe8232a): number {
  if (!colorStr) return fallback;
  const cleaned = colorStr.replace("#", "");
  const num = parseInt(cleaned, 16);
  return isNaN(num) ? fallback : num;
}

// Realistic continuous acceleration model calibrated to 0-100 km/h and top speed
function calculateCarPhysics(car: Vehicle) {
  const accel060 = Math.max(1.8, car.specs?.acceleration060 || 3.8);
  const topSpeedKmh = Math.max(180, car.specs?.topSpeedKmh || 270);
  const vMax = topSpeedKmh / 3.6; // m/s
  const v100 = 27.778; // 100 km/h in m/s

  const drivetrain = car.specs?.drivetrain || "AWD";
  const tractionMultiplier = drivetrain === "AWD" ? 1.0 : drivetrain === "RWD" ? 0.94 : 0.88;

  const weightKg = Math.max(900, car.specs?.weightKg || 1650);
  const powerHp = Math.max(150, car.specs?.powerHp || 450);

  const speedRatio = Math.min(0.85, v100 / vMax);
  const baseTau = -accel060 / Math.log(1 - speedRatio);
  const tau = baseTau / tractionMultiplier;

  return {
    accel060,
    topSpeedKmh,
    vMax,
    tau,
    powerHp,
    weightKg,
    drivetrain,
    speedAt: (t: number) => {
      if (t <= 0) return 0;
      return vMax * (1 - Math.exp(-t / tau));
    },
    distanceAt: (t: number) => {
      if (t <= 0) return 0;
      return vMax * (t + tau * (Math.exp(-t / tau) - 1));
    },
    accelAt: (t: number) => {
      if (t <= 0) return vMax / tau;
      return (vMax / tau) * Math.exp(-t / tau);
    },
  };
}

// Procedural Dark Asphalt Texture
function createAsphaltTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#12141a";
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 20000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const gray = Math.floor(18 + Math.random() * 32);
      ctx.fillStyle = "rgb(" + gray + "," + gray + "," + gray + ")";
      ctx.fillRect(x, y, 1.5, 1.5);
    }

    ctx.fillStyle = "rgba(8, 10, 14, 0.4)";
    ctx.fillRect(60, 0, 80, 512);
    ctx.fillRect(220, 0, 80, 512);
    ctx.fillRect(360, 0, 80, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 90);
  return texture;
}

// Procedural Checkered Finish Line Texture
function createCheckerTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const rows = 4;
    const cols = 16;
    const cw = 256 / cols;
    const rh = 64 / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? "#ffffff" : "#111318";
        ctx.fillRect(c * cw, r * rh, cw, rh);
      }
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  return texture;
}
// Procedural 3D Sports Car Generator
function buildProceduralCar(colorHex: number): CarVisualGroup {
  const root = new THREE.Group();
  const wheels: THREE.Group[] = [];
  const headlights: THREE.Light[] = [];
  const exhaustFlames: THREE.Mesh[] = [];

  const paintMaterial = new THREE.MeshPhysicalMaterial({
    color: colorHex,
    metalness: 0.85,
    roughness: 0.16,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
  });

  const carbonMaterial = new THREE.MeshStandardMaterial({
    color: 0x15161a,
    metalness: 0.6,
    roughness: 0.35,
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x080c14,
    metalness: 0.9,
    roughness: 0.05,
    transparent: true,
    opacity: 0.85,
  });

  const wheelRubberMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.88,
  });

  const rimAlloyMat = new THREE.MeshStandardMaterial({
    color: 0xd8dbe2,
    metalness: 0.92,
    roughness: 0.18,
  });

  const caliperMat = new THREE.MeshStandardMaterial({
    color: 0xe8232a,
    metalness: 0.4,
    roughness: 0.25,
  });

  // 1. Lower Chassis & Aerodynamic Floor
  const chassisGeom = new THREE.BoxGeometry(1.95, 0.22, 4.4);
  const chassisMesh = new THREE.Mesh(chassisGeom, carbonMaterial);
  chassisMesh.position.set(0, 0.25, 0);
  root.add(chassisMesh);

  // Front Splitter
  const splitterGeom = new THREE.BoxGeometry(2.02, 0.05, 0.55);
  const splitterMesh = new THREE.Mesh(splitterGeom, carbonMaterial);
  splitterMesh.position.set(0, 0.14, 2.25);
  root.add(splitterMesh);

  // Rear Diffuser
  const diffuserGeom = new THREE.BoxGeometry(1.9, 0.18, 0.6);
  const diffuserMesh = new THREE.Mesh(diffuserGeom, carbonMaterial);
  diffuserMesh.position.set(0, 0.2, -2.15);
  diffuserMesh.rotation.x = -0.15;
  root.add(diffuserMesh);

  // 2. Sculpted Main Body Shell
  const bodyGeom = new THREE.BoxGeometry(1.88, 0.38, 4.2);
  const bodyMesh = new THREE.Mesh(bodyGeom, paintMaterial);
  bodyMesh.position.set(0, 0.48, 0);
  bodyMesh.castShadow = true;
  root.add(bodyMesh);

  // Front Sloping Hood
  const hoodGeom = new THREE.BoxGeometry(1.72, 0.18, 1.5);
  const hoodMesh = new THREE.Mesh(hoodGeom, paintMaterial);
  hoodMesh.position.set(0, 0.62, 1.3);
  hoodMesh.rotation.x = -0.12;
  root.add(hoodMesh);

  // Muscular Rear Haunches
  const haunchesGeom = new THREE.BoxGeometry(2.02, 0.42, 1.4);
  const haunchesMesh = new THREE.Mesh(haunchesGeom, paintMaterial);
  haunchesMesh.position.set(0, 0.54, -1.1);
  root.add(haunchesMesh);

  // 3. Cabin / Greenhouse Cockpit
  const cabinGeom = new THREE.BoxGeometry(1.36, 0.38, 1.85);
  const cabinMesh = new THREE.Mesh(cabinGeom, paintMaterial);
  cabinMesh.position.set(0, 0.82, -0.15);
  root.add(cabinMesh);

  // Front Windshield
  const windshieldGeom = new THREE.BoxGeometry(1.32, 0.04, 0.85);
  const windshieldMesh = new THREE.Mesh(windshieldGeom, glassMaterial);
  windshieldMesh.position.set(0, 0.82, 0.8);
  windshieldMesh.rotation.x = -0.58;
  root.add(windshieldMesh);

  // Rear Window Fastback
  const rearWindowGeom = new THREE.BoxGeometry(1.28, 0.04, 0.95);
  const rearWindowMesh = new THREE.Mesh(rearWindowGeom, glassMaterial);
  rearWindowMesh.position.set(0, 0.82, -1.05);
  rearWindowMesh.rotation.x = 0.45;
  root.add(rearWindowMesh);

  // Side Glass
  const sideGlassL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.28, 1.2), glassMaterial);
  sideGlassL.position.set(-0.69, 0.8, -0.1);
  root.add(sideGlassL);
  const sideGlassR = sideGlassL.clone();
  sideGlassR.position.x = 0.69;
  root.add(sideGlassR);

  // 4. Rear GT Wing
  const wingBladeGeom = new THREE.BoxGeometry(1.85, 0.04, 0.34);
  const wingBlade = new THREE.Mesh(wingBladeGeom, carbonMaterial);
  wingBlade.position.set(0, 0.92, -2.05);
  root.add(wingBlade);

  const stanchionL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.35, 0.15), carbonMaterial);
  stanchionL.position.set(-0.55, 0.74, -2.0);
  root.add(stanchionL);
  const stanchionR = stanchionL.clone();
  stanchionR.position.x = 0.55;
  root.add(stanchionR);

  // 5. LED Headlights & Taillights
  const headlightMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x99ddff,
    emissiveIntensity: 3.5,
  });

  const headlightL = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.06, 0.12), headlightMat);
  headlightL.position.set(-0.72, 0.52, 2.15);
  headlightL.rotation.y = -0.15;
  root.add(headlightL);

  const headlightR = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.06, 0.12), headlightMat);
  headlightR.position.set(0.72, 0.52, 2.15);
  headlightR.rotation.y = 0.15;
  root.add(headlightR);

  const spotLightL = new THREE.SpotLight(0xf0f8ff, 3.0, 35, Math.PI / 6, 0.35, 1.2);
  spotLightL.position.set(-0.7, 0.52, 2.2);
  spotLightL.target.position.set(-0.7, 0.1, 18);
  root.add(spotLightL);
  root.add(spotLightL.target);
  headlights.push(spotLightL);

  const spotLightR = new THREE.SpotLight(0xf0f8ff, 3.0, 35, Math.PI / 6, 0.35, 1.2);
  spotLightR.position.set(0.7, 0.52, 2.2);
  spotLightR.target.position.set(0.7, 0.1, 18);
  root.add(spotLightR);
  root.add(spotLightR.target);
  headlights.push(spotLightR);

  const taillightMat = new THREE.MeshStandardMaterial({
    color: 0xff0020,
    emissive: 0xff0020,
    emissiveIntensity: 4.2,
  });
  const taillightMesh = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.06, 0.08), taillightMat);
  taillightMesh.position.set(0, 0.62, -2.18);
  root.add(taillightMesh);

  // 6. Dual Exhaust Tips & Nitrous Flame Cones
  const exhaustTipGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.14, 12);
  const exhaustL = new THREE.Mesh(exhaustTipGeom, carbonMaterial);
  exhaustL.rotation.x = Math.PI / 2;
  exhaustL.position.set(-0.35, 0.28, -2.22);
  root.add(exhaustL);

  const exhaustR = exhaustL.clone();
  exhaustR.position.x = 0.35;
  root.add(exhaustR);

  const flameGeom = new THREE.ConeGeometry(0.07, 0.45, 10);
  flameGeom.rotateX(-Math.PI / 2);
  const flameMat = new THREE.MeshStandardMaterial({
    color: 0xff5500,
    emissive: 0xff4400,
    emissiveIntensity: 4.5,
    transparent: true,
    opacity: 0.9,
  });

  const flameL = new THREE.Mesh(flameGeom, flameMat);
  flameL.position.set(-0.35, 0.28, -2.48);
  flameL.visible = false;
  root.add(flameL);
  exhaustFlames.push(flameL);

  const flameR = flameL.clone();
  flameR.position.x = 0.35;
  flameR.visible = false;
  root.add(flameR);
  exhaustFlames.push(flameR);

  // 7. Four High-Detail Alloy Wheels
  const tireGeom = new THREE.CylinderGeometry(0.34, 0.34, 0.25, 24);
  tireGeom.rotateZ(Math.PI / 2);

  const rimGeom = new THREE.CylinderGeometry(0.24, 0.24, 0.26, 16);
  rimGeom.rotateZ(Math.PI / 2);

  const caliperGeom = new THREE.BoxGeometry(0.08, 0.14, 0.09);

  const wheelPositions = [
    { x: -0.96, y: 0.34, z: 1.35 },
    { x: 0.96, y: 0.34, z: 1.35 },
    { x: -1.01, y: 0.35, z: -1.35 },
    { x: 1.01, y: 0.35, z: -1.35 },
  ];

  wheelPositions.forEach((pos) => {
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(pos.x, pos.y, pos.z);

    const tireMesh = new THREE.Mesh(tireGeom, wheelRubberMat);
    tireMesh.castShadow = true;
    wheelGroup.add(tireMesh);

    const rimMesh = new THREE.Mesh(rimGeom, rimAlloyMat);
    wheelGroup.add(rimMesh);

    const caliper = new THREE.Mesh(caliperGeom, caliperMat);
    caliper.position.set(0, 0.12, 0);
    wheelGroup.add(caliper);

    root.add(wheelGroup);
    wheels.push(wheelGroup);
  });

  return {
    root,
    wheels,
    headlights,
    taillightMesh,
    exhaustFlames,
    bodyMesh,
  };
}

// Build the NHRA-Style Christmas Tree Staging Pole
function buildChristmasTree(scene: THREE.Scene): TreeBulbMeshes {
  const treeGroup = new THREE.Group();
  treeGroup.position.set(0, 0, 3.2);

  const poleGeom = new THREE.CylinderGeometry(0.06, 0.08, 4.6, 14);
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x1a1d24, roughness: 0.7 });
  const pole = new THREE.Mesh(poleGeom, poleMat);
  pole.position.y = 2.3;
  treeGroup.add(pole);

  const boxGeom = new THREE.BoxGeometry(0.72, 2.7, 0.22);
  const boxMesh = new THREE.Mesh(boxGeom, poleMat);
  boxMesh.position.set(0, 2.75, 0);
  treeGroup.add(boxMesh);

  const bulbGeom = new THREE.SphereGeometry(0.08, 16, 16);

  const createBulbPair = (y: number, baseColor: number) => {
    const leftMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      emissive: baseColor,
      emissiveIntensity: 0.08,
      roughness: 0.3,
    });
    const rightMat = leftMat.clone();

    const meshL = new THREE.Mesh(bulbGeom, leftMat);
    meshL.position.set(-0.22, y, 0.12);
    treeGroup.add(meshL);

    const meshR = new THREE.Mesh(bulbGeom, rightMat);
    meshR.position.set(0.22, y, 0.12);
    treeGroup.add(meshR);

    return [leftMat, rightMat];
  };

  const preStage = createBulbPair(3.9, 0xffbb00);
  const stage = createBulbPair(3.6, 0xffbb00);
  const amber1 = createBulbPair(3.2, 0xffaa00);
  const amber2 = createBulbPair(2.85, 0xffaa00);
  const amber3 = createBulbPair(2.5, 0xffaa00);
  const green = createBulbPair(2.15, 0x00ff66);
  const red = createBulbPair(1.8, 0xff1122);

  const glowLight = new THREE.PointLight(0xffbb00, 1.2, 12);
  glowLight.position.set(0, 2.8, 0.5);
  treeGroup.add(glowLight);

  scene.add(treeGroup);

  return {
    preStage,
    stage,
    amber1,
    amber2,
    amber3,
    green,
    red,
    glowLight,
  };
}

// Recursively dispose geometries, materials, and textures
function deepDispose(object: THREE.Object3D) {
  if ((object as THREE.Mesh).isMesh) {
    const mesh = object as THREE.Mesh;
    mesh.geometry?.dispose();
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((m) => {
        m.dispose();
      });
    } else if (mesh.material) {
      mesh.material.dispose();
    }
  }
}
// ==========================================
// Main DragBattleCanvas Component
// ==========================================
export default function DragBattleCanvas({ carA, carB, onViewSpecs }: DragBattleCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  const [status, setStatus] = useState<BattleStatus>("idle");
  const [cameraMode, setCameraMode] = useState<CameraMode>("drone");
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>("kmh");

  const speedRefA = useRef<HTMLSpanElement>(null);
  const speedRefB = useRef<HTMLSpanElement>(null);
  const distRefA = useRef<HTMLSpanElement>(null);
  const distRefB = useRef<HTMLSpanElement>(null);
  const timeRefA = useRef<HTMLSpanElement>(null);
  const timeRefB = useRef<HTMLSpanElement>(null);
  const gForceRefA = useRef<HTMLSpanElement>(null);
  const gForceRefB = useRef<HTMLSpanElement>(null);

  const [victoryData, setVictoryData] = useState<{
    winner: "A" | "B" | "TIE";
    winnerName: string;
    etA: number;
    etB: number;
    trapSpeedA: number;
    trapSpeedB: number;
    delta: number;
  } | null>(null);

  const isIntersectingRef = useRef(true);
  const isVisibleRef = useRef(true);
  const statusRef = useRef<BattleStatus>("idle");
  const cameraModeRef = useRef<CameraMode>("drone");
  const speedUnitRef = useRef<SpeedUnit>("kmh");

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    cameraModeRef.current = cameraMode;
  }, [cameraMode]);

  useEffect(() => {
    speedUnitRef.current = speedUnit;
  }, [speedUnit]);

  const countdownStartRef = useRef<number>(0);
  const raceStartRef = useRef<number>(0);
  const raceResultRef = useRef<{
    finishedA: boolean;
    finishedB: boolean;
    etA: number;
    etB: number;
    trapSpeedA: number;
    trapSpeedB: number;
  }>({
    finishedA: false,
    finishedB: false,
    etA: 0,
    etB: 0,
    trapSpeedA: 0,
    trapSpeedB: 0,
  });

  const physicsA = calculateCarPhysics(carA);
  const physicsB = calculateCarPhysics(carB);

  const handleLaunch = useCallback(() => {
    if (statusRef.current === "racing" || statusRef.current === "countdown") return;
    setStatus("countdown");
    statusRef.current = "countdown";
    countdownStartRef.current = performance.now();
    raceResultRef.current = {
      finishedA: false,
      finishedB: false,
      etA: 0,
      etB: 0,
      trapSpeedA: 0,
      trapSpeedB: 0,
    };
    setVictoryData(null);
  }, []);

  const handleReset = useCallback(() => {
    setStatus("idle");
    statusRef.current = "idle";
    setVictoryData(null);
    raceResultRef.current = {
      finishedA: false,
      finishedB: false,
      etA: 0,
      etB: 0,
      trapSpeedA: 0,
      trapSpeedB: 0,
    };
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;
    let width = container.clientWidth || 800;
    let height = container.clientHeight || 550;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07090e);
    scene.fog = new THREE.FogExp2(0x07090e, 0.0032);

    const camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 900);
    camera.position.set(0, 4.2, -10);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      antialias: true,
      stencil: false,
      depth: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x182030, 0.7);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(0x8cb4e6, 0.75);
    moonLight.position.set(25, 60, 50);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 1024;
    moonLight.shadow.mapSize.height = 1024;
    scene.add(moonLight);

    const starGeom = new THREE.BufferGeometry();
    const starCount = 1200;
    const starCoords = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starCoords[i] = (Math.random() - 0.5) * 800;
      starCoords[i + 1] = Math.random() * 250 + 20;
      starCoords[i + 2] = (Math.random() - 0.5) * 800;
    }
    starGeom.setAttribute("position", new THREE.BufferAttribute(starCoords, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x99bbff, size: 1.2, transparent: true, opacity: 0.8 });
    const stars = new THREE.Points(starGeom, starMat);
    scene.add(stars);

    const trackLength = 540;
    const trackWidth = 18;

    const asphaltTex = createAsphaltTexture();
    const trackGeom = new THREE.PlaneGeometry(trackWidth, trackLength);
    const trackMat = new THREE.MeshStandardMaterial({
      map: asphaltTex,
      roughness: 0.82,
      metalness: 0.15,
    });
    const trackMesh = new THREE.Mesh(trackGeom, trackMat);
    trackMesh.rotation.x = -Math.PI / 2;
    trackMesh.position.set(0, 0, (trackLength / 2) - 30);
    trackMesh.receiveShadow = true;
    scene.add(trackMesh);

    const groundGeom = new THREE.PlaneGeometry(300, 600);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x07090c, roughness: 0.95 });
    const groundMesh = new THREE.Mesh(groundGeom, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.set(0, -0.05, 230);
    scene.add(groundMesh);

    const barrierLength = 520;
    const barrierGeom = new THREE.BoxGeometry(0.45, 0.78, barrierLength);
    const barrierMat = new THREE.MeshStandardMaterial({ color: 0x2e323b, roughness: 0.7 });
    const barrier = new THREE.Mesh(barrierGeom, barrierMat);
    barrier.position.set(0, 0.39, (barrierLength / 2) - 25);
    scene.add(barrier);

    const guardrailL = barrier.clone();
    guardrailL.position.x = -8.7;
    scene.add(guardrailL);
    const guardrailR = barrier.clone();
    guardrailR.position.x = 8.7;
    scene.add(guardrailR);

    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const createTrackLine = (x: number, zStart: number, length: number, width = 0.18) => {
      const lineGeom = new THREE.PlaneGeometry(width, length);
      const line = new THREE.Mesh(lineGeom, lineMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(x, 0.02, zStart + (length / 2));
      scene.add(line);
      return line;
    };

    createTrackLine(-8.2, -25, 520);
    createTrackLine(8.2, -25, 520);
    createTrackLine(-0.4, -25, 520, 0.12);
    createTrackLine(0.4, -25, 520, 0.12);

    const checkerTex = createCheckerTexture();
    const startLineGeom = new THREE.PlaneGeometry(16, 1.2);
    const startLineMat = new THREE.MeshBasicMaterial({ map: checkerTex });
    const startLine = new THREE.Mesh(startLineGeom, startLineMat);
    startLine.rotation.x = -Math.PI / 2;
    startLine.position.set(0, 0.03, 0);
    scene.add(startLine);

    const rubberMat = new THREE.MeshBasicMaterial({ color: 0x090a0d, transparent: true, opacity: 0.65 });
    const createSkid = (x: number, z: number, len = 7) => {
      const skid = new THREE.Mesh(new THREE.PlaneGeometry(0.38, len), rubberMat);
      skid.rotation.x = -Math.PI / 2;
      skid.position.set(x, 0.025, z);
      scene.add(skid);
    };
    createSkid(-4.3, -4);
    createSkid(-2.9, -4);
    createSkid(2.9, -4);
    createSkid(4.3, -4);

    const tree = buildChristmasTree(scene);

    const floodlightPoles: THREE.Group[] = [];
    for (let z = -20; z <= 460; z += 35) {
      [-9.8, 9.8].forEach((xSide) => {
        const poleGroup = new THREE.Group();
        poleGroup.position.set(xSide, 0, z);

        const poleMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.16, 7.5, 10),
          new THREE.MeshStandardMaterial({ color: 0x282c35, metalness: 0.6 })
        );
        poleMesh.position.y = 3.75;
        poleGroup.add(poleMesh);

        const fixtureMesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.8, 0.3, 0.4),
          new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xfffaed,
            emissiveIntensity: 2.2,
          })
        );
        fixtureMesh.position.set(xSide > 0 ? -0.4 : 0.4, 7.3, 0);
        poleGroup.add(fixtureMesh);

        const light = new THREE.PointLight(0xfff8eb, 1.3, 32, 1.4);
        light.position.set(xSide > 0 ? -0.8 : 0.8, 7.1, 0);
        poleGroup.add(light);

        scene.add(poleGroup);
        floodlightPoles.push(poleGroup);
      });
    }

    const finishGantry = new THREE.Group();
    finishGantry.position.set(0, 0, 402.34);

    const columnGeom = new THREE.BoxGeometry(0.4, 7.5, 0.4);
    const gantryMat = new THREE.MeshStandardMaterial({ color: 0x333742, metalness: 0.7 });
    const colL = new THREE.Mesh(columnGeom, gantryMat);
    colL.position.set(-8.8, 3.75, 0);
    finishGantry.add(colL);
    const colR = new THREE.Mesh(columnGeom, gantryMat);
    colR.position.set(8.8, 3.75, 0);
    finishGantry.add(colR);

    const trussGeom = new THREE.BoxGeometry(18, 1.2, 0.6);
    const truss = new THREE.Mesh(trussGeom, gantryMat);
    truss.position.set(0, 7.0, 0);
    finishGantry.add(truss);

    const signMat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: 0xe8232a,
      emissiveIntensity: 2.8,
    });
    const signBoard = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.7, 0.1), signMat);
    signBoard.position.set(0, 7.0, -0.35);
    finishGantry.add(signBoard);

    const finishLight = new THREE.PointLight(0xffffff, 2.5, 20);
    finishLight.position.set(0, 6.2, 0);
    finishGantry.add(finishLight);

    const finishLineGeom = new THREE.PlaneGeometry(16, 1.8);
    const finishLineMesh = new THREE.Mesh(finishLineGeom, startLineMat);
    finishLineMesh.rotation.x = -Math.PI / 2;
    finishLineMesh.position.set(0, 0.035, 0);
    finishGantry.add(finishLineMesh);

    scene.add(finishGantry);

    const addMarkerSign = (distanceMeters: number) => {
      const signGroup = new THREE.Group();
      signGroup.position.set(-8.9, 0, distanceMeters);

      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.4, 8), gantryMat);
      post.position.y = 1.2;
      signGroup.add(post);

      const board = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.5, 1.1),
        new THREE.MeshStandardMaterial({
          color: 0x1c1f26,
          emissive: 0x00d2d3,
          emissiveIntensity: 1.5,
        })
      );
      board.position.set(0, 2.2, 0);
      signGroup.add(board);

      scene.add(signGroup);
    };

    addMarkerSign(18.29);
    addMarkerSign(100.58);
    addMarkerSign(201.17);
    addMarkerSign(304.8);

    const colorHexA = parseHexColor(carA.coverGradient?.from, 0xe8232a);
    const car3DA = buildProceduralCar(colorHexA);
    car3DA.root.position.set(-3.6, 0, 0);
    scene.add(car3DA.root);

    const colorHexB = parseHexColor(carB.coverGradient?.from, 0x00d2d3);
    const car3DB = buildProceduralCar(colorHexB);
    car3DB.root.position.set(3.6, 0, 0);
    scene.add(car3DB.root);

    const camTargetPos = new THREE.Vector3(0, 4.2, -10);
    const camTargetLook = new THREE.Vector3(0, 1.2, 12);
    const currentCamLook = new THREE.Vector3(0, 1.2, 12);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersectingRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          width = newW;
          height = newH;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      }
    });
    resizeObserver.observe(container);
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isIntersectingRef.current || !isVisibleRef.current) {
        lastTime = currentTime;
        return;
      }

      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const currentStatus = statusRef.current;
      const curUnit = speedUnitRef.current;
      const speedMultiplier = curUnit === "mph" ? 0.621371 : 1.0;
      const speedUnitLabel = curUnit === "mph" ? "MPH" : "KM/H";

      const setBulbs = (bulbs: THREE.MeshStandardMaterial[], isOn: boolean, intensity = 3.6) => {
        bulbs.forEach((b) => {
          b.emissiveIntensity = isOn ? intensity : 0.08;
        });
      };

      if (currentStatus === "idle") {
        setBulbs(tree.preStage, true, 2.6);
        setBulbs(tree.stage, true, 2.6);
        setBulbs(tree.amber1, false);
        setBulbs(tree.amber2, false);
        setBulbs(tree.amber3, false);
        setBulbs(tree.green, false);
        setBulbs(tree.red, false);
        tree.glowLight.intensity = 0.8;
        tree.glowLight.color.setHex(0xffbb00);

        car3DA.root.position.set(-3.6, 0, 0);
        car3DB.root.position.set(3.6, 0, 0);
        car3DA.root.rotation.set(0, 0, 0);
        car3DB.root.rotation.set(0, 0, 0);
        car3DA.exhaustFlames.forEach((f) => (f.visible = false));
        car3DB.exhaustFlames.forEach((f) => (f.visible = false));

        if (speedRefA.current) speedRefA.current.innerText = "0 " + speedUnitLabel;
        if (speedRefB.current) speedRefB.current.innerText = "0 " + speedUnitLabel;
        if (distRefA.current) distRefA.current.innerText = "0.0 m";
        if (distRefB.current) distRefB.current.innerText = "0.0 m";
        if (timeRefA.current) timeRefA.current.innerText = "0.000 s";
        if (timeRefB.current) timeRefB.current.innerText = "0.000 s";
        if (gForceRefA.current) gForceRefA.current.innerText = "0.00 G";
        if (gForceRefB.current) gForceRefB.current.innerText = "0.00 G";
      } else if (currentStatus === "countdown") {
        const elapsedCountdown = (currentTime - countdownStartRef.current) / 1000;

        setBulbs(tree.preStage, true, 2.6);
        setBulbs(tree.stage, true, 2.6);
        setBulbs(tree.amber1, elapsedCountdown >= 0.5);
        setBulbs(tree.amber2, elapsedCountdown >= 1.0);
        setBulbs(tree.amber3, elapsedCountdown >= 1.5);
        setBulbs(tree.green, false);
        setBulbs(tree.red, false);

        if (elapsedCountdown >= 2.0) {
          statusRef.current = "racing";
          setStatus("racing");
          raceStartRef.current = performance.now();
        }
      } else if (currentStatus === "racing" || currentStatus === "finished") {
        const raceElapsed = Math.max(0, (currentTime - raceStartRef.current) / 1000);

        setBulbs(tree.amber1, false);
        setBulbs(tree.amber2, false);
        setBulbs(tree.amber3, false);
        setBulbs(tree.green, raceElapsed < 3.0, 4.0);
        if (raceElapsed < 3.0) {
          tree.glowLight.intensity = 2.4;
          tree.glowLight.color.setHex(0x00ff66);
        } else {
          setBulbs(tree.green, false);
          tree.glowLight.intensity = 0.2;
        }

        const res = raceResultRef.current;

        const currentDistA = physicsA.distanceAt(raceElapsed);
        const currentSpeedMpsA = physicsA.speedAt(raceElapsed);
        const currentSpeedKmhA = currentSpeedMpsA * 3.6;
        const currentAccelA = physicsA.accelAt(raceElapsed);
        const gForceA = currentAccelA / 9.80665;

        if (!res.finishedA && currentDistA >= 402.34) {
          res.finishedA = true;
          res.etA = raceElapsed;
          res.trapSpeedA = currentSpeedKmhA;
        }

        let finalDistA = currentDistA;
        if (res.finishedA) {
          const decelTime = raceElapsed - res.etA;
          finalDistA = 402.34 + (res.trapSpeedA / 3.6) * (1 - Math.exp(-decelTime / 3.5)) * 1.8;
        }
        car3DA.root.position.z = Math.min(finalDistA, 485);

        const wheelRadius = 0.34;
        const angularDeltaA = (currentSpeedMpsA / wheelRadius) * dt;
        car3DA.wheels.forEach((w) => {
          w.rotation.x += angularDeltaA;
        });

        const pitchA = -Math.min(0.045, (currentAccelA / 16) * 0.045);
        car3DA.root.rotation.x = pitchA;

        const flameActiveA = currentAccelA > 4.5 && Math.random() > 0.3;
        car3DA.exhaustFlames.forEach((f) => {
          f.visible = flameActiveA;
          if (flameActiveA) {
            f.scale.set(1, 0.9 + Math.random() * 0.7, 1);
          }
        });

        const currentDistB = physicsB.distanceAt(raceElapsed);
        const currentSpeedMpsB = physicsB.speedAt(raceElapsed);
        const currentSpeedKmhB = currentSpeedMpsB * 3.6;
        const currentAccelB = physicsB.accelAt(raceElapsed);
        const gForceB = currentAccelB / 9.80665;

        if (!res.finishedB && currentDistB >= 402.34) {
          res.finishedB = true;
          res.etB = raceElapsed;
          res.trapSpeedB = currentSpeedKmhB;
        }

        let finalDistB = currentDistB;
        if (res.finishedB) {
          const decelTime = raceElapsed - res.etB;
          finalDistB = 402.34 + (res.trapSpeedB / 3.6) * (1 - Math.exp(-decelTime / 3.5)) * 1.8;
        }
        car3DB.root.position.z = Math.min(finalDistB, 485);

        const angularDeltaB = (currentSpeedMpsB / wheelRadius) * dt;
        car3DB.wheels.forEach((w) => {
          w.rotation.x += angularDeltaB;
        });

        const pitchB = -Math.min(0.045, (currentAccelB / 16) * 0.045);
        car3DB.root.rotation.x = pitchB;

        const flameActiveB = currentAccelB > 4.5 && Math.random() > 0.3;
        car3DB.exhaustFlames.forEach((f) => {
          f.visible = flameActiveB;
          if (flameActiveB) {
            f.scale.set(1, 0.9 + Math.random() * 0.7, 1);
          }
        });

        if (res.finishedA && res.finishedB && currentStatus !== "finished") {
          statusRef.current = "finished";
          setStatus("finished");

          const winner = res.etA < res.etB ? "A" : res.etB < res.etA ? "B" : "TIE";
          const winnerName = winner === "A" ? `${carA.make} ${carA.model}` : `${carB.make} ${carB.model}`;
          const delta = Math.abs(res.etA - res.etB);

          setVictoryData({
            winner,
            winnerName,
            etA: res.etA,
            etB: res.etB,
            trapSpeedA: res.trapSpeedA,
            trapSpeedB: res.trapSpeedB,
            delta,
          });
        }

        const displaySpeedA = res.finishedA ? res.trapSpeedA * speedMultiplier : currentSpeedKmhA * speedMultiplier;
        const displaySpeedB = res.finishedB ? res.trapSpeedB * speedMultiplier : currentSpeedKmhB * speedMultiplier;

        if (speedRefA.current) {
          speedRefA.current.innerText = `${Math.round(displaySpeedA)} ${speedUnitLabel}`;
        }
        if (speedRefB.current) {
          speedRefB.current.innerText = `${Math.round(displaySpeedB)} ${speedUnitLabel}`;
        }
        if (distRefA.current) {
          distRefA.current.innerText = `${Math.min(402.3, currentDistA).toFixed(1)} m`;
        }
        if (distRefB.current) {
          distRefB.current.innerText = `${Math.min(402.3, currentDistB).toFixed(1)} m`;
        }
        if (timeRefA.current) {
          timeRefA.current.innerText = `${(res.finishedA ? res.etA : raceElapsed).toFixed(3)} s`;
        }
        if (timeRefB.current) {
          timeRefB.current.innerText = `${(res.finishedB ? res.etB : raceElapsed).toFixed(3)} s`;
        }
        if (gForceRefA.current) {
          gForceRefA.current.innerText = `${(res.finishedA ? 0 : gForceA).toFixed(2)} G`;
        }
        if (gForceRefB.current) {
          gForceRefB.current.innerText = `${(res.finishedB ? 0 : gForceB).toFixed(2)} G`;
        }
      }

      const posA = car3DA.root.position;
      const posB = car3DB.root.position;
      const midZ = (posA.z + posB.z) * 0.5;
      const leadZ = Math.max(posA.z, posB.z);
      const trailZ = Math.min(posA.z, posB.z);

      const curMode = cameraModeRef.current;

      if (curMode === "drone") {
        camTargetPos.set(0, 3.8, Math.max(-10, trailZ - 10.5));
        camTargetLook.set(0, 1.2, leadZ + 14);
      } else if (curMode === "side") {
        camTargetPos.set(-7.2, 1.8, midZ - 2.5);
        camTargetLook.set(0, 1.1, midZ + 3.5);
      } else if (curMode === "finish") {
        camTargetPos.set(0, 2.0, 407.5);
        camTargetLook.set(0, 1.1, Math.min(402.0, leadZ));
      } else if (curMode === "cockpit") {
        camTargetPos.set(posA.x, 1.6, posA.z - 3.2);
        camTargetLook.set(posA.x, 1.1, posA.z + 28);
      }

      camera.position.lerp(camTargetPos, 0.08);
      currentCamLook.lerp(camTargetLook, 0.1);
      camera.lookAt(currentCamLook);

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      scene.traverse((obj) => {
        deepDispose(obj);
      });

      trackMat.dispose();
      asphaltTex.dispose();
      checkerTex.dispose();
      groundMat.dispose();
      barrierMat.dispose();
      starMat.dispose();
      starGeom.dispose();
      renderer.dispose();

      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [carA, carB, physicsA, physicsB]);

  return (
    <div className="relative w-full h-[580px] md:h-[620px] rounded-3xl overflow-hidden bg-[#07090e] border border-border-custom shadow-2xl select-none flex flex-col justify-between">
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing" />

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/90 via-transparent to-background/60 z-10" />

      {/* Top Header & Interactive Camera / Telemetry Control Bar */}
      <div className="relative z-20 p-4 md:p-6 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-b from-[#07090e]/95 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface/80 border border-border-custom backdrop-blur-md flex items-center justify-center text-xl shadow-lg">
            🏁
          </div>
          <div>
            <h3 className="text-white font-heading font-black tracking-wider uppercase text-sm md:text-base flex items-center gap-2">
              Quarter-Mile Drag Strip
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent/20 text-accent font-semibold border border-accent/30">
                1/4 MILE • 402M
              </span>
            </h3>
            <p className="text-text-muted text-xs font-mono">Twin-Lane Instrumented Showdown</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface/90 border border-border-custom rounded-xl p-1 backdrop-blur-md shadow-lg">
            <button
              onClick={() => setCameraMode("drone")}
              aria-label="Drone Camera Mode"
              className={`px-2.5 py-1 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
                cameraMode === "drone" ? "bg-accent text-white shadow-md shadow-accent/30" : "text-text-muted hover:text-white"
              }`}
            >
              🚁 Drone
            </button>
            <button
              onClick={() => setCameraMode("side")}
              aria-label="Side-by-Side Camera Mode"
              className={`px-2.5 py-1 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
                cameraMode === "side" ? "bg-accent text-white shadow-md shadow-accent/30" : "text-text-muted hover:text-white"
              }`}
            >
              ⚔️ Side
            </button>
            <button
              onClick={() => setCameraMode("finish")}
              aria-label="Photo-Finish Camera Mode"
              className={`px-2.5 py-1 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
                cameraMode === "finish" ? "bg-accent text-white shadow-md shadow-accent/30" : "text-text-muted hover:text-white"
              }`}
            >
              🏁 Finish
            </button>
            <button
              onClick={() => setCameraMode("cockpit")}
              aria-label="Cockpit Camera Mode"
              className={`px-2.5 py-1 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
                cameraMode === "cockpit" ? "bg-accent text-white shadow-md shadow-accent/30" : "text-text-muted hover:text-white"
              }`}
            >
              🏎️ Cockpit
            </button>
          </div>

          <button
            onClick={() => setSpeedUnit((u) => (u === "kmh" ? "mph" : "kmh"))}
            aria-label="Toggle speed unit"
            className="px-3 py-1.5 rounded-xl bg-surface/90 border border-border-custom text-xs font-mono font-bold text-accent hover:border-accent/40 backdrop-blur-md transition-all shadow-lg cursor-pointer"
          >
            {speedUnit.toUpperCase()}
          </button>
        </div>
      </div>

      {/* Center Countdown & Launch Controls Banner */}
      <div className="relative z-20 flex flex-col items-center justify-center pointer-events-none px-4">
        {status === "idle" && (
          <div className="pointer-events-auto flex flex-col items-center">
            <button
              onClick={handleLaunch}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-accent via-red-500 to-accent text-white font-heading font-black text-lg md:text-xl uppercase tracking-widest shadow-[0_0_35px_rgba(232,35,42,0.6)] hover:shadow-[0_0_50px_rgba(232,35,42,0.9)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
            >
              LAUNCH BATTLE 🏁
            </button>
            <p className="text-text-muted text-xs font-mono mt-3 bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
              Press to stage the Christmas tree countdown
            </p>
          </div>
        )}

        {status === "countdown" && (
          <div className="bg-black/80 border border-accent/50 rounded-2xl px-8 py-4 backdrop-blur-lg shadow-2xl flex flex-col items-center">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-4 h-4 rounded-full bg-amber-400 animate-ping" />
              <span className="text-amber-400 font-heading font-black text-xl uppercase tracking-widest">
                STAGING LIGHTS ACTIVE
              </span>
            </div>
            <p className="text-text-muted text-xs font-mono">Watch the tree... Yellows dropping!</p>
          </div>
        )}

        {status === "racing" && (
          <div className="bg-black/75 border border-emerald-500/40 rounded-2xl px-6 py-2.5 backdrop-blur-md flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-heading font-black text-sm uppercase tracking-wider">
              FULL THROTTLE • 1/4 MILE RUN
            </span>
          </div>
        )}
      </div>

      {/* Bottom Live Speedometer & Instrumented Telemetry Pods */}
      <div className="relative z-20 p-4 md:p-6 grid grid-cols-2 gap-4 md:gap-6 bg-gradient-to-t from-[#07090e] via-[#07090e]/85 to-transparent">
        {/* Left Telemetry Pod: Car A */}
        <div className="bg-surface/85 backdrop-blur-xl border border-border-custom/90 rounded-2xl p-3 md:p-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-accent" />
          <div className="flex items-center justify-between mb-1 pl-2">
            <span className="text-accent text-[11px] font-mono uppercase font-bold tracking-widest truncate">
              LANE 1 • {carA.make}
            </span>
            <span className="text-[10px] text-text-muted font-mono bg-background/60 px-2 py-0.5 rounded">
              {carA.specs?.drivetrain || "AWD"}
            </span>
          </div>
          <h4 className="text-white font-heading font-extrabold text-sm md:text-base truncate pl-2 mb-2">
            {carA.model}
          </h4>

          <div className="grid grid-cols-2 gap-2 pl-2 border-t border-border-custom/60 pt-2">
            <div>
              <span className="text-[10px] text-text-muted uppercase font-mono block">Velocity</span>
              <span
                ref={speedRefA}
                className="text-lg md:text-2xl font-mono font-black text-white tracking-tight drop-shadow-sm"
              >
                0 {speedUnit.toUpperCase()}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-text-muted uppercase font-mono block">Elapsed Time</span>
              <span ref={timeRefA} className="text-lg md:text-2xl font-mono font-black text-accent tracking-tight">
                0.000 s
              </span>
            </div>
            <div>
              <span className="text-[10px] text-text-muted uppercase font-mono block">Distance</span>
              <span ref={distRefA} className="text-xs md:text-sm font-mono font-semibold text-text-secondary">
                0.0 m
              </span>
            </div>
            <div>
              <span className="text-[10px] text-text-muted uppercase font-mono block">G-Force</span>
              <span ref={gForceRefA} className="text-xs md:text-sm font-mono font-semibold text-amber-400">
                0.00 G
              </span>
            </div>
          </div>
        </div>

        {/* Right Telemetry Pod: Car B */}
        <div className="bg-surface/85 backdrop-blur-xl border border-border-custom/90 rounded-2xl p-3 md:p-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1.5 h-full bg-[#00d2d3]" />
          <div className="flex items-center justify-between mb-1 pr-2">
            <span className="text-[#00d2d3] text-[11px] font-mono uppercase font-bold tracking-widest truncate">
              LANE 2 • {carB.make}
            </span>
            <span className="text-[10px] text-text-muted font-mono bg-background/60 px-2 py-0.5 rounded">
              {carB.specs?.drivetrain || "AWD"}
            </span>
          </div>
          <h4 className="text-white font-heading font-extrabold text-sm md:text-base truncate pr-2 mb-2">
            {carB.model}
          </h4>

          <div className="grid grid-cols-2 gap-2 pr-2 border-t border-border-custom/60 pt-2">
            <div>
              <span className="text-[10px] text-text-muted uppercase font-mono block">Velocity</span>
              <span
                ref={speedRefB}
                className="text-lg md:text-2xl font-mono font-black text-white tracking-tight drop-shadow-sm"
              >
                0 {speedUnit.toUpperCase()}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-text-muted uppercase font-mono block">Elapsed Time</span>
              <span ref={timeRefB} className="text-lg md:text-2xl font-mono font-black text-[#00d2d3] tracking-tight">
                0.000 s
              </span>
            </div>
            <div>
              <span className="text-[10px] text-text-muted uppercase font-mono block">Distance</span>
              <span ref={distRefB} className="text-xs md:text-sm font-mono font-semibold text-text-secondary">
                0.0 m
              </span>
            </div>
            <div>
              <span className="text-[10px] text-text-muted uppercase font-mono block">G-Force</span>
              <span ref={gForceRefB} className="text-xs md:text-sm font-mono font-semibold text-amber-400">
                0.00 G
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Victory Celebration Modal & Freeze-Frame Telemetry */}
      {victoryData && (
        <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface border border-border-custom max-w-xl w-full rounded-3xl p-6 md:p-8 shadow-2xl relative text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent/15 border border-accent/40 text-3xl mx-auto flex items-center justify-center mb-4 shadow-xl">
              🏆
            </div>

            <span className="text-accent text-xs font-mono font-bold uppercase tracking-widest block mb-1">
              Quarter-Mile Drag Winner
            </span>
            <h2 className="text-2xl md:text-3xl font-heading font-black text-white mb-2">
              {victoryData.winnerName}
            </h2>
            <p className="text-text-muted text-xs font-mono mb-6">
              Winning Margin:{" "}
              <span className="text-emerald-400 font-bold">
                {victoryData.delta > 0.001 ? `+${victoryData.delta.toFixed(3)}s lead` : "DEAD HEAT / PHOTO FINISH"}
              </span>
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6 bg-background/80 rounded-2xl p-4 border border-border-custom">
              <div
                className={`p-3 rounded-xl border ${
                  victoryData.winner === "A" ? "border-accent bg-accent/10" : "border-border-custom bg-surface/50"
                }`}
              >
                <span className="text-xs font-mono font-bold text-accent block truncate">{carA.model}</span>
                <div className="text-2xl font-mono font-black text-white my-1">{victoryData.etA.toFixed(3)}s</div>
                <div className="text-xs font-mono text-text-muted">
                  Trap:{" "}
                  <span className="text-text-secondary font-semibold">
                    {Math.round(victoryData.trapSpeedA * (speedUnit === "mph" ? 0.621371 : 1))}{" "}
                    {speedUnit.toUpperCase()}
                  </span>
                </div>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  victoryData.winner === "B" ? "border-[#00d2d3] bg-[#00d2d3]/10" : "border-border-custom bg-surface/50"
                }`}
              >
                <span className="text-xs font-mono font-bold text-[#00d2d3] block truncate">{carB.model}</span>
                <div className="text-2xl font-mono font-black text-white my-1">{victoryData.etB.toFixed(3)}s</div>
                <div className="text-xs font-mono text-text-muted">
                  Trap:{" "}
                  <span className="text-text-secondary font-semibold">
                    {Math.round(victoryData.trapSpeedB * (speedUnit === "mph" ? 0.621371 : 1))}{" "}
                    {speedUnit.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleLaunch}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-accent text-white font-heading font-bold text-xs uppercase tracking-wider shadow-lg shadow-accent/30 hover:bg-accent/90 transition-all cursor-pointer"
              >
                🔄 Re-Run Race
              </button>
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-surface border border-border-custom hover:border-accent text-text-light font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                🏁 Reset to Stage
              </button>
              {onViewSpecs && (
                <button
                  onClick={onViewSpecs}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-surface border border-border-custom hover:border-[#00d2d3] text-[#00d2d3] font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  📊 Full Spec Matrix
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}