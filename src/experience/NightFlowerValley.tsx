import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface NightFlowerValleyProps {
  onLoaded?: () => void;
  scrollProgress?: number;
}

export const NightFlowerValley: React.FC<NightFlowerValleyProps> = ({
  onLoaded,
  scrollProgress = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGLError, setHasWebGLError] = useState(false);
  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      setHasWebGLError(true);
      if (onLoaded) onLoaded();
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x08090d);
    scene.fog = new THREE.FogExp2(0x08090d, 0.038);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    const initialCamPos = new THREE.Vector3(0, 2.6, 9.2);
    camera.position.copy(initialCamPos);

    // Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
        alpha: false,
      });
    } catch {
      setHasWebGLError(true);
      if (onLoaded) onLoaded();
      return;
    }

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = false; // Kept off for raw performance
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x181a30, 1.2);
    scene.add(ambientLight);

    // Moon rim light from rear-right
    const moonLight = new THREE.DirectionalLight(0xa5b4fc, 1.6);
    moonLight.position.set(6, 12, -8);
    scene.add(moonLight);

    // Valley glow point lights
    const cyanValleyLight = new THREE.PointLight(0x38bdf8, 3.5, 18, 1.6);
    cyanValleyLight.position.set(-3.5, 1.2, 1.5);
    scene.add(cyanValleyLight);

    const violetValleyLight = new THREE.PointLight(0xc084fc, 3.8, 20, 1.6);
    violetValleyLight.position.set(4.0, 1.8, -1.0);
    scene.add(violetValleyLight);

    const goldValleyLight = new THREE.PointLight(0xfcd34d, 2.8, 15, 1.8);
    goldValleyLight.position.set(0.5, 0.8, 4.0);
    scene.add(goldValleyLight);

    // --- Valley Topography ---
    const terrainGeo = new THREE.PlaneGeometry(50, 60, 64, 64);
    terrainGeo.rotateX(-Math.PI / 2);

    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      // Valley depression along z axis (center x=0 is lower, hills rise on sides)
      const hillDist = Math.abs(x) * 0.35;
      const hills = Math.sin(x * 0.18) * 0.8 + Math.pow(hillDist, 1.7) * 0.18;
      const mounds = Math.sin(x * 0.4 + z * 0.3) * 0.35 + Math.cos(z * 0.2) * 0.4;
      posAttr.setY(i, hills + mounds - 0.8);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x070912,
      roughness: 0.9,
      metalness: 0.1,
      flatShading: false,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.position.set(0, 0, -5);
    scene.add(terrain);

    // Function to sample terrain height at (x, z)
    const getTerrainHeight = (x: number, z: number) => {
      const hillDist = Math.abs(x) * 0.35;
      const hills = Math.sin(x * 0.18) * 0.8 + Math.pow(hillDist, 1.7) * 0.18;
      const mounds = Math.sin(x * 0.4 + (z - 5) * 0.3) * 0.35 + Math.cos((z - 5) * 0.2) * 0.4;
      return hills + mounds - 0.8;
    };

    // --- Instanced Flowers ---
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Palette of glowing colors
    const flowerColors = [
      new THREE.Color("#38BDF8"), // bioluminescent cyan
      new THREE.Color("#818CF8"), // celestial indigo
      new THREE.Color("#C084FC"), // radiant violet
      new THREE.Color("#F472B6"), // blossom rose
      new THREE.Color("#FDE047"), // warm starlight gold
      new THREE.Color("#34D399"), // luminous mint
    ];

    // VARIETY 1: Glowing Bell Blossoms (Lantern Lilies)
    const bellCount = isMobile ? 700 : 1600;
    const bellBlossomGeo = new THREE.ConeGeometry(0.14, 0.32, 7, 1, true);
    bellBlossomGeo.rotateX(Math.PI); // inverted bell
    bellBlossomGeo.translate(0, 0.45, 0);

    const bellMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x111122,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    const bellMesh = new THREE.InstancedMesh(bellBlossomGeo, bellMat, bellCount);

    // VARIETY 2: Radiant Star Lilies
    const starCount = isMobile ? 800 : 1800;
    const starGeo = new THREE.CylinderGeometry(0.22, 0.04, 0.12, 6);
    starGeo.translate(0, 0.35, 0);

    const starMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      emissive: 0x0a0a1f,
      emissiveIntensity: 0.85,
    });
    const starMesh = new THREE.InstancedMesh(starGeo, starMat, starCount);

    // VARIETY 3: Luminescent Spire Reeds (Alliums / Puff Orbs)
    const reedCount = isMobile ? 500 : 1100;
    const reedGeo = new THREE.IcosahedronGeometry(0.12, 1);
    reedGeo.translate(0, 0.65, 0);

    const reedMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      emissive: 0x221133,
      emissiveIntensity: 1.1,
    });
    const reedMesh = new THREE.InstancedMesh(reedGeo, reedMat, reedCount);

    // VARIETY 4: Dense Night Meadow Fern Blades
    const grassCount = isMobile ? 1800 : 4200;
    const bladeGeo = new THREE.ConeGeometry(0.04, 0.55, 3);
    bladeGeo.translate(0, 0.27, 0);

    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x0d212b,
      emissive: 0x06141c,
      emissiveIntensity: 0.4,
      roughness: 0.7,
    });
    const grassMesh = new THREE.InstancedMesh(bladeGeo, grassMat, grassCount);

    // Helper data for dynamic wind & mouse interaction
    interface InstanceInfo {
      x: number;
      y: number;
      z: number;
      scale: number;
      baseRotX: number;
      baseRotY: number;
      baseRotZ: number;
      phase: number;
      swaySpeed: number;
    }

    const bellData: InstanceInfo[] = [];
    const starData: InstanceInfo[] = [];
    const reedData: InstanceInfo[] = [];
    const grassData: InstanceInfo[] = [];

    const dummy = new THREE.Object3D();

    // Populate Bell Instances
    for (let i = 0; i < bellCount; i++) {
      const x = (Math.random() - 0.5) * 36;
      const z = (Math.random() - 0.5) * 44 - 4;
      const y = getTerrainHeight(x, z);
      const scale = 0.6 + Math.random() * 0.75;
      const rotY = Math.random() * Math.PI * 2;
      const rotZ = (Math.random() - 0.5) * 0.35;
      const rotX = (Math.random() - 0.5) * 0.35;

      dummy.position.set(x, y, z);
      dummy.rotation.set(rotX, rotY, rotZ);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      bellMesh.setMatrixAt(i, dummy.matrix);

      const color = flowerColors[Math.floor(Math.random() * flowerColors.length)];
      bellMesh.setColorAt(i, color);

      bellData.push({
        x,
        y,
        z,
        scale,
        baseRotX: rotX,
        baseRotY: rotY,
        baseRotZ: rotZ,
        phase: Math.random() * Math.PI * 2,
        swaySpeed: 1.2 + Math.random() * 1.0,
      });
    }

    // Populate Star Instances
    for (let i = 0; i < starCount; i++) {
      const x = (Math.random() - 0.5) * 34;
      const z = (Math.random() - 0.5) * 42 - 3;
      const y = getTerrainHeight(x, z);
      const scale = 0.55 + Math.random() * 0.7;
      const rotY = Math.random() * Math.PI * 2;
      const rotZ = (Math.random() - 0.5) * 0.25;
      const rotX = (Math.random() - 0.5) * 0.25;

      dummy.position.set(x, y, z);
      dummy.rotation.set(rotX, rotY, rotZ);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      starMesh.setMatrixAt(i, dummy.matrix);

      const color = flowerColors[Math.floor(Math.random() * flowerColors.length)];
      starMesh.setColorAt(i, color);

      starData.push({
        x,
        y,
        z,
        scale,
        baseRotX: rotX,
        baseRotY: rotY,
        baseRotZ: rotZ,
        phase: Math.random() * Math.PI * 2,
        swaySpeed: 1.1 + Math.random() * 0.8,
      });
    }

    // Populate Reed Instances
    for (let i = 0; i < reedCount; i++) {
      const x = (Math.random() - 0.5) * 32;
      const z = (Math.random() - 0.5) * 40 - 2;
      const y = getTerrainHeight(x, z);
      const scale = 0.7 + Math.random() * 0.8;
      const rotY = Math.random() * Math.PI * 2;
      const rotZ = (Math.random() - 0.5) * 0.2;
      const rotX = (Math.random() - 0.5) * 0.2;

      dummy.position.set(x, y, z);
      dummy.rotation.set(rotX, rotY, rotZ);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      reedMesh.setMatrixAt(i, dummy.matrix);

      const color = flowerColors[Math.floor(Math.random() * flowerColors.length)];
      reedMesh.setColorAt(i, color);

      reedData.push({
        x,
        y,
        z,
        scale,
        baseRotX: rotX,
        baseRotY: rotY,
        baseRotZ: rotZ,
        phase: Math.random() * Math.PI * 2,
        swaySpeed: 1.4 + Math.random() * 1.2,
      });
    }

    // Populate Grass/Meadow Instances
    const grassColors = [
      new THREE.Color("#0f2a36"),
      new THREE.Color("#16323f"),
      new THREE.Color("#1e293b"),
      new THREE.Color("#112433"),
    ];

    for (let i = 0; i < grassCount; i++) {
      const x = (Math.random() - 0.5) * 38;
      const z = (Math.random() - 0.5) * 46 - 4;
      const y = getTerrainHeight(x, z);
      const scale = 0.4 + Math.random() * 0.6;
      const rotY = Math.random() * Math.PI * 2;
      const rotZ = (Math.random() - 0.5) * 0.4;
      const rotX = (Math.random() - 0.5) * 0.4;

      dummy.position.set(x, y, z);
      dummy.rotation.set(rotX, rotY, rotZ);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      grassMesh.setMatrixAt(i, dummy.matrix);

      const color = grassColors[Math.floor(Math.random() * grassColors.length)];
      grassMesh.setColorAt(i, color);

      grassData.push({
        x,
        y,
        z,
        scale,
        baseRotX: rotX,
        baseRotY: rotY,
        baseRotZ: rotZ,
        phase: Math.random() * Math.PI * 2,
        swaySpeed: 1.6 + Math.random() * 1.4,
      });
    }

    bellMesh.instanceMatrix.needsUpdate = true;
    starMesh.instanceMatrix.needsUpdate = true;
    reedMesh.instanceMatrix.needsUpdate = true;
    grassMesh.instanceMatrix.needsUpdate = true;

    if (bellMesh.instanceColor) bellMesh.instanceColor.needsUpdate = true;
    if (starMesh.instanceColor) starMesh.instanceColor.needsUpdate = true;
    if (reedMesh.instanceColor) reedMesh.instanceColor.needsUpdate = true;
    if (grassMesh.instanceColor) grassMesh.instanceColor.needsUpdate = true;

    scene.add(bellMesh);
    scene.add(starMesh);
    scene.add(reedMesh);
    scene.add(grassMesh);

    // --- Floating Spores / Ethereal Motes ---
    const sporeCount = isMobile ? 400 : 1000;
    const sporeGeo = new THREE.BufferGeometry();
    const sporePos = new Float32Array(sporeCount * 3);
    const sporeScales = new Float32Array(sporeCount);
    const sporePhases = new Float32Array(sporeCount);

    for (let i = 0; i < sporeCount; i++) {
      sporePos[i * 3] = (Math.random() - 0.5) * 32;
      sporePos[i * 3 + 1] = 0.4 + Math.random() * 5.2;
      sporePos[i * 3 + 2] = (Math.random() - 0.5) * 36 - 2;
      sporeScales[i] = 1.0 + Math.random() * 2.5;
      sporePhases[i] = Math.random() * Math.PI * 2;
    }

    sporeGeo.setAttribute("position", new THREE.BufferAttribute(sporePos, 3));

    // Custom circular soft spore texture
    const sporeCanvas = document.createElement("canvas");
    sporeCanvas.width = 32;
    sporeCanvas.height = 32;
    const sCtx = sporeCanvas.getContext("2d");
    if (sCtx) {
      const gradient = sCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.3, "rgba(167, 139, 250, 0.8)");
      gradient.addColorStop(0.7, "rgba(56, 189, 248, 0.3)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      sCtx.fillStyle = gradient;
      sCtx.fillRect(0, 0, 32, 32);
    }
    const sporeTexture = new THREE.CanvasTexture(sporeCanvas);

    const sporeMat = new THREE.PointsMaterial({
      size: 0.16,
      map: sporeTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.85,
    });
    const spores = new THREE.Points(sporeGeo, sporeMat);
    scene.add(spores);

    // --- Pointer Interaction Setup ---
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2(-999, -999);
    const pointerWorldPos = new THREE.Vector3(0, -999, 0);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      pointer.targetX = normX;
      pointer.targetY = normY;

      mouseCoord.set(normX, normY);
      raycaster.setFromCamera(mouseCoord, camera);
      raycaster.ray.intersectPlane(groundPlane, pointerWorldPos);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const normX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const normY = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
        pointer.targetX = normX * 0.7;
        pointer.targetY = normY * 0.7;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);

    // Notify parent on loaded
    if (onLoaded) {
      setTimeout(() => {
        onLoaded();
      }, 100);
    }

    // --- Animation Loop ---
    let animationFrameId: number;
    let startTime = performance.now();
    let frameCount = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = (performance.now() - startTime) * 0.001;
      frameCount++;

      if (prefersReducedMotion) {
        renderer.render(scene, camera);
        return;
      }

      // Smooth pointer easing
      pointer.x += (pointer.targetX - pointer.x) * 0.05;
      pointer.y += (pointer.targetY - pointer.y) * 0.05;

      // Camera motion: base slight pan from pointer + smooth scroll push
      const scroll = scrollRef.current;
      // Scroll glides camera forward into the flower valley and tilts slightly down
      const targetCamX = pointer.x * 0.8;
      const targetCamY = initialCamPos.y - scroll * 1.2 + pointer.y * 0.4;
      const targetCamZ = initialCamPos.z - scroll * 4.5;

      camera.position.x += (targetCamX - camera.position.x) * 0.06;
      camera.position.y += (targetCamY - camera.position.y) * 0.06;
      camera.position.z += (targetCamZ - camera.position.z) * 0.06;

      const lookTargetY = 1.0 - scroll * 0.8;
      const lookTargetZ = -scroll * 3.5;
      camera.lookAt(targetCamX * 0.3, lookTargetY, lookTargetZ);

      // Swaying lights
      cyanValleyLight.position.x = -3.5 + Math.sin(time * 0.7) * 0.8;
      cyanValleyLight.position.z = 1.5 + Math.cos(time * 0.6) * 0.6;
      violetValleyLight.position.x = 4.0 + Math.cos(time * 0.8) * 0.7;
      violetValleyLight.position.z = -1.0 + Math.sin(time * 0.5) * 0.8;

      // Update Spores position
      const positions = spores.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < sporeCount; i++) {
        // Drifting motion
        positions[i * 3 + 1] += Math.sin(time * 1.2 + sporePhases[i]) * 0.003;
        positions[i * 3] += Math.cos(time * 0.5 + sporePhases[i]) * 0.002;
        if (positions[i * 3 + 1] > 6.0) positions[i * 3 + 1] = 0.5;
      }
      spores.geometry.attributes.position.needsUpdate = true;

      // Update wind sway & interactive displacement on subset per frame to preserve 60fps
      // Full update on bells every 2 frames
      if (frameCount % 2 === 0) {
        const updateBells = (startIdx: number, endIdx: number) => {
          for (let i = startIdx; i < endIdx; i++) {
            const data = bellData[i];
            const wind = Math.sin(time * data.swaySpeed + data.phase) * 0.08;

            // Distance to pointer world position
            const dx = data.x - pointerWorldPos.x;
            const dz = data.z - pointerWorldPos.z;
            const distSq = dx * dx + dz * dz;
            let bendX = 0;
            let bendZ = 0;
            if (distSq < 16) {
              const force = (1 - Math.sqrt(distSq) / 4) * 0.28;
              bendX = (dx / Math.sqrt(distSq + 0.01)) * force;
              bendZ = (dz / Math.sqrt(distSq + 0.01)) * force;
            }

            dummy.position.set(data.x, data.y, data.z);
            dummy.rotation.set(
              data.baseRotX + wind + bendZ,
              data.baseRotY,
              data.baseRotZ + wind * 0.6 + bendX
            );
            dummy.scale.set(data.scale, data.scale, data.scale);
            dummy.updateMatrix();
            bellMesh.setMatrixAt(i, dummy.matrix);
          }
          bellMesh.instanceMatrix.needsUpdate = true;
        };
        updateBells(0, bellCount);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);

      // Dispose geometries & materials
      terrainGeo.dispose();
      terrainMat.dispose();
      bellBlossomGeo.dispose();
      bellMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      reedGeo.dispose();
      reedMat.dispose();
      bladeGeo.dispose();
      grassMat.dispose();
      sporeGeo.dispose();
      sporeMat.dispose();
      sporeTexture.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onLoaded]);

  // Graceful WebGL Fallback if device has no WebGL or if context fails
  if (hasWebGLError) {
    return (
      <div className="absolute inset-0 bg-[#08090D] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 radial-mist opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,#25264A_0%,#08090D_70%)]" />
        {/* Decorative SVG night flower silhouettes */}
        <div className="absolute bottom-0 w-full flex justify-around opacity-40 pointer-events-none">
          <svg className="w-48 h-64 text-[#8D83C9]" viewBox="0 0 100 150" fill="currentColor">
            <path d="M50 150 Q48 90 40 50 Q30 20 50 10 Q70 20 60 50 Q52 90 50 150" />
            <circle cx="50" cy="10" r="12" fill="#38BDF8" className="animate-pulse" />
          </svg>
          <svg className="w-56 h-80 text-[#25264A]" viewBox="0 0 100 150" fill="currentColor">
            <path d="M50 150 Q55 80 45 40 Q35 15 50 5 Q65 15 55 40 Q45 80 50 150" />
            <circle cx="50" cy="5" r="14" fill="#C084FC" className="animate-pulse" />
          </svg>
          <svg className="w-48 h-64 text-[#8D83C9]" viewBox="0 0 100 150" fill="currentColor">
            <path d="M50 150 Q48 90 60 50 Q70 20 50 10 Q30 20 40 50 Q48 90 50 150" />
            <circle cx="50" cy="10" r="12" fill="#F472B6" className="animate-pulse" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ touchAction: "pan-y" }}
      aria-hidden="true"
    />
  );
};
