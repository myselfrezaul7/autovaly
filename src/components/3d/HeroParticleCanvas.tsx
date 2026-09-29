"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Generate a soft radial circular glow sprite texture
function createParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.7)");
    gradient.addColorStop(0.7, "rgba(255, 255, 255, 0.15)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }

  return new THREE.CanvasTexture(canvas);
}

export default function HeroParticleCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Renderer throttled for high performance
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      140
    );
    camera.position.set(0, 1.8, 12);
    camera.lookAt(0, 0, -20);

    // 1. Digital Velocity Ground Grid Lines
    const gridHelper = new THREE.GridHelper(90, 45, 0xe8232a, 0x1e293b);
    gridHelper.position.set(0, -0.6, -30);
    // Subtle tilt
    gridHelper.rotation.x = 0.02;
    scene.add(gridHelper);

    // 2. High-speed Velocity Light Trail Particles
    const PARTICLE_COUNT = 850;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const speeds = new Float32Array(PARTICLE_COUNT);

    const palette = [
      new THREE.Color(0x00d2d3), // Cyber Cyan
      new THREE.Color(0xe8232a), // Hyper Red
      new THREE.Color(0xd4af37), // Warm Gold
      new THREE.Color(0xf8fafc), // Ice White
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      // Spread across width, height, and depth
      positions[i3] = (Math.random() - 0.5) * 50;
      positions[i3 + 1] = Math.random() * 8 - 0.5;
      positions[i3 + 2] = Math.random() * -100 + 15;

      // Color distribution
      const colorPick =
        Math.random() > 0.65
          ? palette[1] // red
          : Math.random() > 0.35
          ? palette[0] // cyan
          : Math.random() > 0.15
          ? palette[2] // gold
          : palette[3]; // white

      colors[i3] = colorPick.r;
      colors[i3 + 1] = colorPick.g;
      colors[i3 + 2] = colorPick.b;

      // Speed along z-axis
      speeds[i] = 16 + Math.random() * 28;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleTex = createParticleTexture();
    const material = new THREE.PointsMaterial({
      size: 1.6,
      map: particleTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Parallax mouse position
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", handlePointerMove, { passive: true });

    // Render loop state
    let animId: number | null = null;
    let isRunning = true;
    let clock = new THREE.Clock();

    const animate = () => {
      if (!isRunning) return;
      animId = requestAnimationFrame(animate);

      const delta = clock.getDelta();

      // Update particle stream
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        posArray[i3 + 2] += speeds[i] * delta;

        // Wrap around horizon
        if (posArray[i3 + 2] > 18) {
          posArray[i3 + 2] = -90;
          posArray[i3] = (Math.random() - 0.5) * 50;
          posArray[i3 + 1] = Math.random() * 8 - 0.5;
        }
      }
      posAttr.needsUpdate = true;

      // Grid subtle scroll
      gridHelper.position.z = -30 + ((clock.getElapsedTime() * 8) % 4);

      // Smooth camera parallax
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      camera.position.x = mouseX * 1.5;
      camera.position.y = 1.8 - mouseY * 0.8;
      camera.lookAt(mouseX * 0.8, -0.2, -25);

      renderer.render(scene, camera);
    };

    isRunning = true;
    animate();

    // Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Pause on scroll out of viewport via IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!isRunning) {
              isRunning = true;
              clock = new THREE.Clock();
              animate();
            }
          } else {
            isRunning = false;
            if (animId) cancelAnimationFrame(animId);
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Pause when tab is hidden
    const handleVisibility = () => {
      if (document.hidden) {
        isRunning = false;
        if (animId) cancelAnimationFrame(animId);
      } else {
        if (!isRunning) {
          isRunning = true;
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
      window.removeEventListener("mousemove", handlePointerMove);

      if (animId) cancelAnimationFrame(animId);

      geometry.dispose();
      material.dispose();
      particleTex.dispose();
      gridHelper.geometry.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
