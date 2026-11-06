import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import {
  createOrganicStemGeometry,
  createBellCorollaGeometry,
  createStarLilyBlossomGeometry,
  createDaisyBlossomGeometry,
  createAlliumSprayGeometry,
  createStamenCoreGeometry,
} from "./FlowerGeometries";

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
    const testCanvas = document.createElement("canvas");
    const gl = testCanvas.getContext("webgl2") || testCanvas.getContext("webgl");
    if (!gl) {
      setHasWebGLError(true);
      if (onLoaded) onLoaded();
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = width < 768;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    // Midnight dark background
    scene.background = new THREE.Color(0x04060a);
    // Controlled exponential fog: deep dark night with distant mist
    scene.fog = new THREE.FogExp2(0x04060a, isMobile ? 0.038 : 0.026);

    // --- Camera ---
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    const initialCamPos = new THREE.Vector3(0, 2.65, 9.8);
    camera.position.copy(initialCamPos);

    // --- Renderer ---
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        powerPreference: "high-performance",
        alpha: false,
        stencil: false,
        depth: true,
      });
    } catch {
      setHasWebGLError(true);
      if (onLoaded) onLoaded();
      return;
    }

    const dpr = Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75);
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // --- Post-Processing (Carefully Controlled Bloom) ---
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    // High threshold (0.75) and controlled strength (0.4) ensure delicate ethereal glow
    // without washing out petals or obscuring the scene
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      isMobile ? 0.35 : 0.42, // strength
      0.35,                   // radius
      0.72                    // threshold (only bright glowing cores trigger bloom)
    );
    composer.addPass(bloomPass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    // --- Atmospheric Night Lighting ---
    // Deep midnight indigo ambient
    const ambientLight = new THREE.AmbientLight(0x0c101d, 0.65);
    scene.add(ambientLight);

    // Cool silver-violet moonlight rim light highlighting petal contours
    const moonRimLight = new THREE.DirectionalLight(0x93a5cf, 1.8);
    moonRimLight.position.set(6, 12, -10);
    scene.add(moonRimLight);

    // Soft front-left blue moonlight fill
    const frontMoon = new THREE.DirectionalLight(0x4338ca, 0.5);
    frontMoon.position.set(-6, 5, 8);
    scene.add(frontMoon);

    // Local glowing point lights nestled in the valley
    const cyanLight = new THREE.PointLight(0x38bdf8, 1.8, 16, 2.0);
    cyanLight.position.set(-4.0, 1.2, 1.5);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight(0xc084fc, 2.0, 18, 2.0);
    violetLight.position.set(4.5, 1.4, -1.0);
    scene.add(violetLight);

    const goldLight = new THREE.PointLight(0xfde047, 1.4, 14, 2.2);
    goldLight.position.set(0.0, 0.8, 4.0);
    scene.add(goldLight);

    // --- Valley Topography (Amphitheater Valley with Natural Terraces) ---
    const terrainGeo = new THREE.PlaneGeometry(60, 75, 70, 70);
    terrainGeo.rotateX(-Math.PI / 2);

    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      // Valley bowl: sides rise up smoothly, center channel dips slightly
      const sideDist = Math.abs(x);
      const hills = Math.pow(sideDist * 0.16, 2.0) * 1.35;
      const mounds = Math.sin(x * 0.28 + z * 0.2) * 0.35 + Math.cos(z * 0.16) * 0.4;
      posAttr.setY(i, hills + mounds - 0.75);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x030509,
      roughness: 0.92,
      metalness: 0.05,
      flatShading: false,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.position.set(0, 0, -6);
    scene.add(terrainMesh);

    // Terrain height sampler
    const sampleTerrainHeight = (x: number, z: number) => {
      const sideDist = Math.abs(x);
      const hills = Math.pow(sideDist * 0.16, 2.0) * 1.35;
      const mounds = Math.sin(x * 0.28 + (z - 6) * 0.2) * 0.35 + Math.cos((z - 6) * 0.16) * 0.4;
      return hills + mounds - 0.75;
    };

    // --- GPU Wind & Mouse Pointer Shader Uniforms ---
    const shaderUniforms = {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector3(0, -999, 0) },
    };

    const attachGpuWindShader = (material: THREE.Material, windFactor = 1.0) => {
      material.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = shaderUniforms.uTime;
        shader.uniforms.uPointer = shaderUniforms.uPointer;

        shader.vertexShader = `
          uniform float uTime;
          uniform vec3 uPointer;
        ` + shader.vertexShader;

        shader.vertexShader = shader.vertexShader.replace(
          "#include <begin_vertex>",
          `
          #include <begin_vertex>
          
          float hRatio = clamp(position.y / 0.85, 0.0, 1.5);
          
          #ifdef USE_INSTANCING
            vec3 instWorldPos = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
          #else
            vec3 instWorldPos = vec3(0.0);
          #endif

          // Harmonic organic wind sway
          float wX = sin(uTime * 1.6 + instWorldPos.x * 0.45 + instWorldPos.z * 0.25) * (0.07 * ${windFactor.toFixed(2)} * hRatio);
          float wZ = cos(uTime * 1.25 + instWorldPos.x * 0.3 + instWorldPos.z * 0.35) * (0.05 * ${windFactor.toFixed(2)} * hRatio);
          transformed.x += wX;
          transformed.z += wZ;

          // Pointer proximity reaction
          vec2 pDiff = instWorldPos.xz - uPointer.xz;
          float pDist = length(pDiff);
          if (pDist < 4.0) {
            float pForce = (1.0 - pDist / 4.0) * (0.24 * hRatio);
            vec2 pDir = normalize(pDiff + vec2(0.001));
            transformed.x += pDir.x * pForce;
            transformed.z += pDir.y * pForce;
          }
          `
        );
      };
    };

    // --- Materials with Restrained Bioluminescence ---
    // 1. Slender dark moss green stems
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x061810,
      roughness: 0.75,
      metalness: 0.1,
    });
    attachGpuWindShader(stemMat, 0.7);

    // 2. Sculpted Petals Material (Rich translucent night colors)
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.42,
      metalness: 0.08,
      side: THREE.DoubleSide,
      emissive: 0x080b18,
      emissiveIntensity: 0.3,
    });
    attachGpuWindShader(petalMat, 1.0);

    // 3. Glowing Stamen / Core Material (Soft luminous core)
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.35,
      metalness: 0.05,
      emissive: 0xffffff,
      emissiveIntensity: 0.85, // soft warm glow
    });
    attachGpuWindShader(coreMat, 1.0);

    // 4. Allium spray material (soft starlight embers)
    const alliumMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.45,
      metalness: 0.1,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.55,
    });
    attachGpuWindShader(alliumMat, 1.0);

    // --- Geometries ---
    const bellStemGeo = createOrganicStemGeometry(0.85, 0.08);
    const bellCorollaGeo = createBellCorollaGeometry();
    const bellCoreGeo = createStamenCoreGeometry(0.045);

    const lilyStemGeo = createOrganicStemGeometry(0.75, 0.06);
    const lilyBlossomGeo = createStarLilyBlossomGeometry();
    const lilyCoreGeo = createStamenCoreGeometry(0.055);

    const daisyStemGeo = createOrganicStemGeometry(0.65, 0.05);
    const daisyBlossomGeo = createDaisyBlossomGeometry();
    const daisyCoreGeo = createStamenCoreGeometry(0.06);

    const alliumStemGeo = createOrganicStemGeometry(1.1, 0.04);
    const alliumSprayGeo = createAlliumSprayGeometry();

    // --- Instance Counts (Generous density with smooth 60fps) ---
    const bellCount = isMobile ? 350 : 900;
    const lilyCount = isMobile ? 450 : 1100;
    const daisyCount = isMobile ? 300 : 750;
    const alliumCount = isMobile ? 250 : 650;

    const bellStemMesh = new THREE.InstancedMesh(bellStemGeo, stemMat, bellCount);
    const bellCorollaMesh = new THREE.InstancedMesh(bellCorollaGeo, petalMat, bellCount);
    const bellCoreMesh = new THREE.InstancedMesh(bellCoreGeo, coreMat, bellCount);

    const lilyStemMesh = new THREE.InstancedMesh(lilyStemGeo, stemMat, lilyCount);
    const lilyBlossomMesh = new THREE.InstancedMesh(lilyBlossomGeo, petalMat, lilyCount);
    const lilyCoreMesh = new THREE.InstancedMesh(lilyCoreGeo, coreMat, lilyCount);

    const daisyStemMesh = new THREE.InstancedMesh(daisyStemGeo, stemMat, daisyCount);
    const daisyBlossomMesh = new THREE.InstancedMesh(daisyBlossomGeo, petalMat, daisyCount);
    const daisyCoreMesh = new THREE.InstancedMesh(daisyCoreGeo, coreMat, daisyCount);

    const alliumStemMesh = new THREE.InstancedMesh(alliumStemGeo, stemMat, alliumCount);
    const alliumSprayMesh = new THREE.InstancedMesh(alliumSprayGeo, alliumMat, alliumCount);

    // Restrained, elegant nocturnal palettes
    const bellColors = [
      new THREE.Color("#8B5CF6"), // Twilight violet
      new THREE.Color("#A78BFA"), // Lavender
      new THREE.Color("#6366F1"), // Deep indigo
      new THREE.Color("#38BDF8"), // Pale cyan
    ];

    const lilyColors = [
      new THREE.Color("#F1EBDD"), // Warm cream
      new THREE.Color("#FDE68A"), // Starlight gold
      new THREE.Color("#F472B6"), // Soft blush rose
      new THREE.Color("#C4B5FD"), // Ethereal lilac
      new THREE.Color("#E2E8F0"), // Moonlit pearl
    ];

    const daisyColors = [
      new THREE.Color("#F1EBDD"), // Warm cream ray
      new THREE.Color("#F8FAFC"), // Pure starlight white
      new THREE.Color("#FEF08A"), // Soft butter gold
    ];

    const alliumColors = [
      new THREE.Color("#38BDF8"), // Cyan puff
      new THREE.Color("#34D399"), // Mint luminescence
      new THREE.Color("#C084FC"), // Amethyst starburst
      new THREE.Color("#FCD34D"), // Amber starburst
    ];

    const dummy = new THREE.Object3D();
    const coreDummy = new THREE.Object3D();

    // Helper: generate natural placement (dense hills, open central path)
    const generatePlacement = (spreadX: number, spreadZ: number, offsetZ: number) => {
      let x = (Math.random() - 0.5) * spreadX;
      let z = (Math.random() - 0.5) * spreadZ + offsetZ;

      // Keep immediate center corridor clear for headline & buttons readability
      if (Math.abs(x) < 4.8 && z > 0.5) {
        x = (x >= 0 ? 1 : -1) * (4.8 + Math.random() * (spreadX * 0.45));
      }

      const y = sampleTerrainHeight(x, z);
      return { x, y, z };
    };

    // 1. Populate Bell Lilies
    for (let i = 0; i < bellCount; i++) {
      const { x, y, z } = generatePlacement(40, 52, -4);
      const scale = 0.75 + Math.random() * 0.6;
      const rotY = Math.random() * Math.PI * 2;
      const rotX = (Math.random() - 0.5) * 0.15;
      const rotZ = (Math.random() - 0.5) * 0.15;

      dummy.position.set(x, y, z);
      dummy.rotation.set(rotX, rotY, rotZ);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      bellStemMesh.setMatrixAt(i, dummy.matrix);

      dummy.position.set(x, y + 0.85 * scale, z);
      dummy.rotation.set(rotX + 0.22, rotY, rotZ);
      dummy.scale.set(scale * 0.95, scale * 0.95, scale * 0.95);
      dummy.updateMatrix();
      bellCorollaMesh.setMatrixAt(i, dummy.matrix);

      coreDummy.position.set(x, y + 0.74 * scale, z);
      coreDummy.rotation.set(rotX, rotY, rotZ);
      coreDummy.scale.set(scale * 0.9, scale * 0.9, scale * 0.9);
      coreDummy.updateMatrix();
      bellCoreMesh.setMatrixAt(i, coreDummy.matrix);

      const col = bellColors[Math.floor(Math.random() * bellColors.length)];
      bellCorollaMesh.setColorAt(i, col);
      bellCoreMesh.setColorAt(i, new THREE.Color(col).offsetHSL(0, 0, 0.2));
    }

    // 2. Populate Radiant Star Lilies
    for (let i = 0; i < lilyCount; i++) {
      const { x, y, z } = generatePlacement(38, 50, -3);
      const scale = 0.8 + Math.random() * 0.65;
      const rotY = Math.random() * Math.PI * 2;
      const rotX = (Math.random() - 0.5) * 0.12;
      const rotZ = (Math.random() - 0.5) * 0.12;

      dummy.position.set(x, y, z);
      dummy.rotation.set(rotX, rotY, rotZ);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      lilyStemMesh.setMatrixAt(i, dummy.matrix);

      dummy.position.set(x, y + 0.75 * scale, z);
      dummy.rotation.set(rotX, rotY, rotZ);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      lilyBlossomMesh.setMatrixAt(i, dummy.matrix);

      coreDummy.position.set(x, y + 0.78 * scale, z);
      coreDummy.rotation.set(rotX, rotY, rotZ);
      coreDummy.scale.set(scale * 1.05, scale * 1.05, scale * 1.05);
      coreDummy.updateMatrix();
      lilyCoreMesh.setMatrixAt(i, coreDummy.matrix);

      const col = lilyColors[Math.floor(Math.random() * lilyColors.length)];
      lilyBlossomMesh.setColorAt(i, col);
      lilyCoreMesh.setColorAt(i, new THREE.Color("#FEF08A")); // warm gold anthers
    }

    // 3. Populate Wild Night Daisies
    for (let i = 0; i < daisyCount; i++) {
      const { x, y, z } = generatePlacement(36, 48, -2);
      const scale = 0.7 + Math.random() * 0.55;
      const rotY = Math.random() * Math.PI * 2;
      const rotX = (Math.random() - 0.5) * 0.1;
      const rotZ = (Math.random() - 0.5) * 0.1;

      dummy.position.set(x, y, z);
      dummy.rotation.set(rotX, rotY, rotZ);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      daisyStemMesh.setMatrixAt(i, dummy.matrix);

      dummy.position.set(x, y + 0.65 * scale, z);
      dummy.rotation.set(rotX, rotY, rotZ);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      daisyBlossomMesh.setMatrixAt(i, dummy.matrix);

      coreDummy.position.set(x, y + 0.66 * scale, z);
      coreDummy.rotation.set(rotX, rotY, rotZ);
      coreDummy.scale.set(scale * 1.1, scale * 0.5, scale * 1.1);
      coreDummy.updateMatrix();
      daisyCoreMesh.setMatrixAt(i, coreDummy.matrix);

      const col = daisyColors[Math.floor(Math.random() * daisyColors.length)];
      daisyBlossomMesh.setColorAt(i, col);
      daisyCoreMesh.setColorAt(i, new THREE.Color("#F59E0B")); // amber eye
    }

    // 4. Populate Allium / Puff Sprays
    for (let i = 0; i < alliumCount; i++) {
      const { x, y, z } = generatePlacement(36, 48, -3);
      const scale = 0.85 + Math.random() * 0.65;
      const rotY = Math.random() * Math.PI * 2;

      dummy.position.set(x, y, z);
      dummy.rotation.set(0, rotY, 0);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      alliumStemMesh.setMatrixAt(i, dummy.matrix);

      dummy.position.set(x, y + 1.1 * scale, z);
      dummy.rotation.set(0, rotY, 0);
      dummy.scale.set(scale * 0.85, scale * 0.85, scale * 0.85);
      dummy.updateMatrix();
      alliumSprayMesh.setMatrixAt(i, dummy.matrix);

      const col = alliumColors[Math.floor(Math.random() * alliumColors.length)];
      alliumSprayMesh.setColorAt(i, col);
    }

    const meshes = [
      bellStemMesh, bellCorollaMesh, bellCoreMesh,
      lilyStemMesh, lilyBlossomMesh, lilyCoreMesh,
      daisyStemMesh, daisyBlossomMesh, daisyCoreMesh,
      alliumStemMesh, alliumSprayMesh,
    ];

    meshes.forEach((m) => {
      m.instanceMatrix.needsUpdate = true;
      if (m.instanceColor) m.instanceColor.needsUpdate = true;
      scene.add(m);
    });

    // --- Floating Spores / Ethereal Motes ---
    const sporeCount = isMobile ? 300 : 750;
    const sporeGeo = new THREE.BufferGeometry();
    const sporePos = new Float32Array(sporeCount * 3);
    const sporePhases = new Float32Array(sporeCount);

    for (let i = 0; i < sporeCount; i++) {
      sporePos[i * 3] = (Math.random() - 0.5) * 36;
      sporePos[i * 3 + 1] = 0.3 + Math.random() * 4.8;
      sporePos[i * 3 + 2] = (Math.random() - 0.5) * 44 - 2;
      sporePhases[i] = Math.random() * Math.PI * 2;
    }
    sporeGeo.setAttribute("position", new THREE.BufferAttribute(sporePos, 3));

    const sporeCanvas = document.createElement("canvas");
    sporeCanvas.width = 32;
    sporeCanvas.height = 32;
    const sCtx = sporeCanvas.getContext("2d");
    if (sCtx) {
      const gradient = sCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      gradient.addColorStop(0.3, "rgba(167, 139, 250, 0.65)");
      gradient.addColorStop(0.7, "rgba(56, 189, 248, 0.2)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      sCtx.fillStyle = gradient;
      sCtx.fillRect(0, 0, 32, 32);
    }
    const sporeTexture = new THREE.CanvasTexture(sporeCanvas);

    const sporeMat = new THREE.PointsMaterial({
      size: isMobile ? 0.16 : 0.2,
      map: sporeTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.85,
    });
    const spores = new THREE.Points(sporeGeo, sporeMat);
    scene.add(spores);

    // --- Pointer & Camera Raycaster Setup ---
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
        pointer.targetX = normX * 0.6;
        pointer.targetY = normY * 0.6;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Visibility handling
    let isVisible = true;
    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    if (onLoaded) {
      setTimeout(() => onLoaded(), 120);
    }

    // --- Render Loop ---
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const time = (performance.now() - startTime) * 0.001;

      // Update shader uniforms
      shaderUniforms.uTime.value = time;
      shaderUniforms.uPointer.value.copy(pointerWorldPos);

      // Smooth pointer easing
      pointer.x += (pointer.targetX - pointer.x) * 0.04;
      pointer.y += (pointer.targetY - pointer.y) * 0.04;

      if (!prefersReducedMotion) {
        // Camera cinematic scroll glide: smoothly moves along Z and descends into the flower valley
        const scroll = scrollRef.current;
        const targetCamX = pointer.x * 0.65;
        const targetCamY = initialCamPos.y - scroll * 1.15 + pointer.y * 0.25;
        const targetCamZ = initialCamPos.z - scroll * 5.0;

        camera.position.x += (targetCamX - camera.position.x) * 0.05;
        camera.position.y += (targetCamY - camera.position.y) * 0.05;
        camera.position.z += (targetCamZ - camera.position.z) * 0.05;

        const lookTargetY = 1.0 - scroll * 0.8;
        const lookTargetZ = -scroll * 3.8;
        camera.lookAt(targetCamX * 0.25, lookTargetY, lookTargetZ);

        // Swaying valley point lights
        cyanLight.position.x = -4.0 + Math.sin(time * 0.55) * 0.6;
        cyanLight.position.z = 1.5 + Math.cos(time * 0.45) * 0.5;
        violetLight.position.x = 4.5 + Math.cos(time * 0.65) * 0.5;
        violetLight.position.z = -1.0 + Math.sin(time * 0.4) * 0.6;

        // Floating Spores Animation
        const positions = spores.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < sporeCount; i++) {
          positions[i * 3 + 1] += Math.sin(time * 1.0 + sporePhases[i]) * 0.0022;
          positions[i * 3] += Math.cos(time * 0.4 + sporePhases[i]) * 0.0015;
          if (positions[i * 3 + 1] > 5.2) positions[i * 3 + 1] = 0.35;
        }
        spores.geometry.attributes.position.needsUpdate = true;
      }

      composer.render();
    };

    animate();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      observer.disconnect();

      terrainGeo.dispose();
      terrainMat.dispose();
      bellStemGeo.dispose();
      bellCorollaGeo.dispose();
      bellCoreGeo.dispose();
      lilyStemGeo.dispose();
      lilyBlossomGeo.dispose();
      lilyCoreGeo.dispose();
      daisyStemGeo.dispose();
      daisyBlossomGeo.dispose();
      daisyCoreGeo.dispose();
      alliumStemGeo.dispose();
      alliumSprayGeo.dispose();
      stemMat.dispose();
      petalMat.dispose();
      coreMat.dispose();
      alliumMat.dispose();
      sporeGeo.dispose();
      sporeMat.dispose();
      sporeTexture.dispose();

      composer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onLoaded]);

  if (hasWebGLError) {
    return (
      <div className="absolute inset-0 bg-[#04060A] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 radial-mist opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,#1E1B4B_0%,#04060A_70%)]" />
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
