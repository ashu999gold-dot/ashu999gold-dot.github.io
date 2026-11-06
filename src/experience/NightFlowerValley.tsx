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
  isAudioMuted?: boolean;
  onAudioToggle?: () => void;
}

export const NightFlowerValley: React.FC<NightFlowerValleyProps> = ({
  onLoaded,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGLError, setHasWebGLError] = useState(false);

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
    scene.background = new THREE.Color(0x04060a);
    // Exponential atmospheric fog with subtle deep night mist
    scene.fog = new THREE.FogExp2(0x04060a, isMobile ? 0.035 : 0.024);

    // --- Camera Hierarchy with Breathing Rig (HeroPage Technique) ---
    // cameraContainer moves along valley path
    // breathContainer adds organic periodic sway & subtle breathing
    // camera performs rotational tilt towards cursor
    const cameraContainer = new THREE.Group();
    const breathContainer = new THREE.Group();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);

    const initialCamPos = new THREE.Vector3(0, 2.5, 9.5);
    cameraContainer.position.copy(initialCamPos);
    breathContainer.add(camera);
    cameraContainer.add(breathContainer);
    scene.add(cameraContainer);

    // --- Renderer Setup with Intelligent DPR Capping (HeroPage Technique) ---
    // On desktop/integrated GPUs, capping composer to 1.0 eliminates fillrate choking
    // while keeping geometry crisp and maintaining solid 60 FPS
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

    const dpr = Math.min(window.devicePixelRatio, isMobile ? 1.0 : 1.25);
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // --- Post-Processing with Fill-Rate Optimization ---
    // HeroPage caps composer pixel ratio to 1.0 to avoid 4x overdraw on high-DPI
    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(1.0);
    composer.setSize(width, height);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      isMobile ? 0.32 : 0.40, // controlled strength
      0.32,                   // radius
      0.72                    // threshold (cores glow, background dark)
    );
    composer.addPass(bloomPass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    // --- Atmospheric Night Lighting ---
    const ambientLight = new THREE.AmbientLight(0x0a0f1d, 0.7);
    scene.add(ambientLight);

    const moonRimLight = new THREE.DirectionalLight(0x93a5cf, 1.8);
    moonRimLight.position.set(6, 12, -10);
    scene.add(moonRimLight);

    const frontMoon = new THREE.DirectionalLight(0x4338ca, 0.45);
    frontMoon.position.set(-6, 5, 8);
    scene.add(frontMoon);

    const cyanLight = new THREE.PointLight(0x38bdf8, 1.6, 16, 2.0);
    cyanLight.position.set(-4.0, 1.2, 1.5);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight(0xc084fc, 1.8, 18, 2.0);
    violetLight.position.set(4.5, 1.4, -1.0);
    scene.add(violetLight);

    const goldLight = new THREE.PointLight(0xfde047, 1.3, 14, 2.2);
    goldLight.position.set(0.0, 0.8, 4.0);
    scene.add(goldLight);

    // --- Valley Topography ---
    const terrainGeo = new THREE.PlaneGeometry(60, 75, 50, 50);
    terrainGeo.rotateX(-Math.PI / 2);

    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const sideDist = Math.abs(x);
      const hills = Math.pow(sideDist * 0.16, 2.0) * 1.35;
      const mounds = Math.sin(x * 0.28 + z * 0.2) * 0.35 + Math.cos(z * 0.16) * 0.4;
      posAttr.setY(i, hills + mounds - 0.75);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x030509,
      roughness: 0.94,
      metalness: 0.05,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.position.set(0, 0, -6);
    scene.add(terrainMesh);

    const sampleTerrainHeight = (x: number, z: number) => {
      const sideDist = Math.abs(x);
      const hills = Math.pow(sideDist * 0.16, 2.0) * 1.35;
      const mounds = Math.sin(x * 0.28 + (z - 6) * 0.2) * 0.35 + Math.cos((z - 6) * 0.16) * 0.4;
      return hills + mounds - 0.75;
    };

    // --- GPU Shaders & Fast Noise (Replicated from HeroPage) ---
    // In HeroPage, fastNoise3d and screen-space pointer displacement execute 100% on GPU
    const shaderUniforms = {
      uTime: { value: 0 },
      uMousePosition: { value: new THREE.Vector2(0, 0) },
      uResolution: { value: new THREE.Vector2(width, height) },
      uDispersalProgress: { value: 0 },
    };

    const attachGpuValleyShader = (material: THREE.Material, windFactor = 1.0) => {
      material.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = shaderUniforms.uTime;
        shader.uniforms.uMousePosition = shaderUniforms.uMousePosition;
        shader.uniforms.uResolution = shaderUniforms.uResolution;
        shader.uniforms.uDispersalProgress = shaderUniforms.uDispersalProgress;

        shader.vertexShader = `
          uniform float uTime;
          uniform vec2 uMousePosition;
          uniform vec2 uResolution;
          uniform float uDispersalProgress;
          varying float vHoverGlow;

          // Ultra-fast trigonometric 3D noise from HeroPage
          vec3 fastNoise3d(vec3 pos, float time) {
            vec3 p1 = pos * 0.12 + time * 0.02;
            vec3 p2 = pos * 0.18 + time * 0.03;
            vec3 p3 = pos * 0.09 + time * 0.025;

            float noise1 = sin(p1.x * 2.1 + cos(p1.y * 1.7) + sin(p1.z * 2.3)) *
                           cos(p1.y * 1.9 + sin(p1.z * 1.3) + cos(p1.x * 2.7));
            float noise2 = cos(p2.x * 1.8 + sin(p2.y * 2.4) + cos(p2.z * 1.6)) *
                           sin(p2.y * 2.2 + cos(p2.z * 1.8) + sin(p2.x * 1.4));
            float noise3 = sin(p3.x * 1.3 + cos(p3.y * 2.7) + sin(p3.z * 1.9)) *
                           cos(p3.y * 1.7 + sin(p3.z * 2.1) + cos(p3.x * 1.5));

            return vec3(noise1, noise2, noise3) * 0.5;
          }
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

          // 1. Organic botanical wind breeze via GPU noise (HeroPage)
          vec3 wind = fastNoise3d(instWorldPos * 1.2 + vec3(0.0, 0.0, transformed.y), uTime * 0.5);
          transformed.x += wind.x * (0.09 * ${windFactor.toFixed(2)} * hRatio);
          transformed.z += wind.z * (0.07 * ${windFactor.toFixed(2)} * hRatio);
          transformed.y += wind.y * (0.02 * ${windFactor.toFixed(2)} * hRatio);

          // 2. Screen-Space Mouse Displacement (HeroPage Technique - Zero CPU Raycast)
          vec4 clipPos = projectionMatrix * modelViewMatrix * vec4(instWorldPos, 1.0);
          float hoverGlow = 0.0;
          if (clipPos.w > 0.0) {
            vec2 ndc = clipPos.xy / clipPos.w;
            float aspect = uResolution.x / max(1.0, uResolution.y);
            vec2 screenDiff = ndc - uMousePosition;
            screenDiff.x *= aspect;
            float screenDist = length(screenDiff);

            if (screenDist < 0.85) {
              float pushForce = (1.0 - smoothstep(0.0, 0.85, screenDist)) * 0.32 * hRatio;
              vec2 pushDir = normalize(screenDiff + vec2(0.0001));
              transformed.x += pushDir.x * pushForce;
              transformed.z += pushDir.y * pushForce;
              hoverGlow = (1.0 - screenDist / 0.85);
            }
          }
          vHoverGlow = hoverGlow;

          // 3. CTA Dispersal Effect (HeroPage startHoverTransition)
          if (uDispersalProgress > 0.001) {
            float seed = fract(sin(dot(instWorldPos.xz, vec2(12.9898, 78.233))) * 43758.5453);
            float dispMult = uDispersalProgress * (1.1 + seed * 0.9);
            transformed.x += sin(seed * 6.28) * dispMult * 1.6;
            transformed.y += dispMult * 2.2 * (0.4 + seed);
            transformed.z += cos(seed * 6.28) * dispMult * 1.6;
          }
          `
        );

        shader.fragmentShader = `
          varying float vHoverGlow;
        ` + shader.fragmentShader;

        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <dithering_fragment>",
          `
          #include <dithering_fragment>
          // Subtle touch/hover bioluminescence brightening (HeroPage technique)
          gl_FragColor.rgb += gl_FragColor.rgb * (vHoverGlow * 0.45);
          `
        );
      };
    };

    // --- Materials with Restrained Bioluminescence ---
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x061810,
      roughness: 0.75,
      metalness: 0.1,
    });
    attachGpuValleyShader(stemMat, 0.7);

    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.42,
      metalness: 0.08,
      side: THREE.DoubleSide,
      emissive: 0x080b18,
      emissiveIntensity: 0.3,
    });
    attachGpuValleyShader(petalMat, 1.0);

    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.35,
      metalness: 0.05,
      emissive: 0xffffff,
      emissiveIntensity: 0.85,
    });
    attachGpuValleyShader(coreMat, 1.0);

    const alliumMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.45,
      metalness: 0.1,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.55,
    });
    attachGpuValleyShader(alliumMat, 1.0);

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

    // Instance counts tuned for high visual richness and guaranteed 60fps
    const bellCount = isMobile ? 300 : 750;
    const lilyCount = isMobile ? 380 : 900;
    const daisyCount = isMobile ? 260 : 650;
    const alliumCount = isMobile ? 220 : 550;

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

    const bellColors = [
      new THREE.Color("#8B5CF6"),
      new THREE.Color("#A78BFA"),
      new THREE.Color("#6366F1"),
      new THREE.Color("#38BDF8"),
    ];

    const lilyColors = [
      new THREE.Color("#F1EBDD"),
      new THREE.Color("#FDE68A"),
      new THREE.Color("#F472B6"),
      new THREE.Color("#C4B5FD"),
      new THREE.Color("#E2E8F0"),
    ];

    const daisyColors = [
      new THREE.Color("#F1EBDD"),
      new THREE.Color("#F8FAFC"),
      new THREE.Color("#FEF08A"),
    ];

    const alliumColors = [
      new THREE.Color("#38BDF8"),
      new THREE.Color("#34D399"),
      new THREE.Color("#C084FC"),
      new THREE.Color("#FCD34D"),
    ];

    const dummy = new THREE.Object3D();
    const coreDummy = new THREE.Object3D();

    const generatePlacement = (spreadX: number, spreadZ: number, offsetZ: number) => {
      let x = (Math.random() - 0.5) * spreadX;
      let z = (Math.random() - 0.5) * spreadZ + offsetZ;
      if (Math.abs(x) < 4.8 && z > 0.5) {
        x = (x >= 0 ? 1 : -1) * (4.8 + Math.random() * (spreadX * 0.45));
      }
      const y = sampleTerrainHeight(x, z);
      return { x, y, z };
    };

    // Populate Bell Lilies
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

    // Populate Radiant Star Lilies
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
      lilyCoreMesh.setColorAt(i, new THREE.Color("#FEF08A"));
    }

    // Populate Wild Night Daisies
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
      daisyCoreMesh.setColorAt(i, new THREE.Color("#F59E0B"));
    }

    // Populate Allium / Puff Sprays
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

    // --- Floating Spores Animated 100% on GPU (HeroPage Zero-CPU Technique) ---
    const sporeCount = isMobile ? 300 : 700;
    const sporeGeo = new THREE.BufferGeometry();
    const sporePos = new Float32Array(sporeCount * 3);
    const sporePhases = new Float32Array(sporeCount);
    const sporeSpeeds = new Float32Array(sporeCount * 3);

    for (let i = 0; i < sporeCount; i++) {
      sporePos[i * 3] = (Math.random() - 0.5) * 36;
      sporePos[i * 3 + 1] = 0.3 + Math.random() * 4.8;
      sporePos[i * 3 + 2] = (Math.random() - 0.5) * 44 - 2;
      sporePhases[i] = Math.random() * Math.PI * 2;
      sporeSpeeds[i * 3] = 0.4 + Math.random() * 0.6;
      sporeSpeeds[i * 3 + 1] = 0.5 + Math.random() * 0.5;
      sporeSpeeds[i * 3 + 2] = 0.4 + Math.random() * 0.6;
    }
    sporeGeo.setAttribute("position", new THREE.BufferAttribute(sporePos, 3));
    sporeGeo.setAttribute("aPhase", new THREE.BufferAttribute(sporePhases, 1));
    sporeGeo.setAttribute("aSpeed", new THREE.BufferAttribute(sporeSpeeds, 3));

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
      size: isMobile ? 0.16 : 0.22,
      map: sporeTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.85,
    });

    // Animate spores purely inside the GPU vertex shader - zero CPU re-uploads!
    sporeMat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = shaderUniforms.uTime;
      shader.uniforms.uDispersalProgress = shaderUniforms.uDispersalProgress;

      shader.vertexShader = `
        uniform float uTime;
        uniform float uDispersalProgress;
        attribute float aPhase;
        attribute vec3 aSpeed;
      ` + shader.vertexShader;

      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
        #include <begin_vertex>
        // Harmonic GPU drifting
        transformed.x += cos(uTime * aSpeed.x * 0.4 + aPhase) * 0.35;
        transformed.y += sin(uTime * aSpeed.y * 0.6 + aPhase) * 0.25;
        transformed.z += sin(uTime * aSpeed.z * 0.4 + aPhase) * 0.3;

        // Dispersal puff
        if (uDispersalProgress > 0.001) {
          transformed.y += uDispersalProgress * 2.5 * aSpeed.y;
          transformed.x += sin(aPhase) * uDispersalProgress * 1.8;
          transformed.z += cos(aPhase) * uDispersalProgress * 1.8;
        }
        `
      );
    };

    const spores = new THREE.Points(sporeGeo, sporeMat);
    scene.add(spores);

    // --- Audio Ambient Soundtrack with Lowpass Filter (HeroPage Architecture) ---
    let audioListener: THREE.AudioListener | null = null;
    let backgroundSound: THREE.Audio | null = null;
    let lowPassFilter: BiquadFilterNode | null = null;
    let isAudioPlaying = false;
    let isAudioLoaded = false;

    const initAudio = (autoPlay = true) => {
      try {
        if (!audioListener) {
          audioListener = new THREE.AudioListener();
          camera.add(audioListener);
        }
        if (!backgroundSound) {
          backgroundSound = new THREE.Audio(audioListener);
        }

        const audioLoader = new THREE.AudioLoader();
        audioLoader.load(
          `${import.meta.env.BASE_URL}audio/ge-ambient.mp3`,
          (buffer) => {
            if (!backgroundSound || !audioListener) return;
            backgroundSound.setBuffer(buffer);
            backgroundSound.setLoop(true);
            backgroundSound.setVolume(0.45);

            if (audioListener.context) {
              lowPassFilter = audioListener.context.createBiquadFilter();
              lowPassFilter.type = "lowpass";
              lowPassFilter.frequency.value = 20000;
              lowPassFilter.Q.value = 0.5;
              backgroundSound.setFilter(lowPassFilter);
            }
            isAudioLoaded = true;
            if (autoPlay) {
              if (audioListener.context.state === "suspended") {
                audioListener.context.resume();
              }
              backgroundSound.play();
            }
          },
          undefined,
          (err) => console.log("Ambient sound not loaded:", err)
        );
      } catch (e) {
        console.log("Audio not supported:", e);
      }
    };

    const toggleAudioPlay = () => {
      isAudioPlaying = !isAudioPlaying;
      if (!isAudioLoaded) {
        initAudio(isAudioPlaying);
        return isAudioPlaying;
      }
      if (audioListener?.context && audioListener.context.state === "suspended") {
        audioListener.context.resume();
      }
      if (backgroundSound) {
        if (isAudioPlaying) {
          backgroundSound.play();
        } else {
          backgroundSound.pause();
        }
      }
      return isAudioPlaying;
    };

    // Attach global window hook for audio toggle & renderer info
    (window as unknown as { __toggleValleyAudio?: () => boolean; __valleyRenderer?: THREE.WebGLRenderer; __valleyUniforms?: typeof shaderUniforms }).__toggleValleyAudio = toggleAudioPlay;
    (window as unknown as { __valleyRenderer?: THREE.WebGLRenderer; __valleyUniforms?: typeof shaderUniforms }).__valleyRenderer = renderer;
    (window as unknown as { __valleyUniforms?: typeof shaderUniforms }).__valleyUniforms = shaderUniforms;

    // --- Decoupled Passive Scroll Listener (Zero React Re-renders!) ---
    let targetScroll = 0;
    let smoothedScroll = 0;

    const handleScroll = () => {
      const hero = container.parentElement;
      const heroH = hero ? hero.offsetHeight : window.innerHeight;
      targetScroll = Math.max(0, Math.min(1.5, window.scrollY / heroH));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // --- Mouse & Pointer Damping ---
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = normX;
      mouse.targetY = normY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const normX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const normY = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
        mouse.targetX = normX * 0.5;
        mouse.targetY = normY * 0.5;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // --- Hover Transition & Dispersal Listeners ---
    let buttonHoverTarget = 0;
    let buttonHoverProgress = 0;

    const setupHoverListeners = () => {
      const hoverElements = document.querySelectorAll("[data-valley-hover='true']");
      hoverElements.forEach((el) => {
        el.addEventListener("pointerenter", () => {
          buttonHoverTarget = 1;
          if (lowPassFilter && audioListener?.context) {
            lowPassFilter.frequency.setTargetAtTime(800, audioListener.context.currentTime, 0.25);
          }
        });
        el.addEventListener("pointerleave", () => {
          buttonHoverTarget = 0;
          if (lowPassFilter && audioListener?.context) {
            lowPassFilter.frequency.setTargetAtTime(20000, audioListener.context.currentTime, 0.35);
          }
        });
      });
    };
    // Re-check after DOM mount
    setTimeout(setupHoverListeners, 400);

    // Resize Handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      shaderUniforms.uResolution.value.set(w, h);
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
      setTimeout(() => onLoaded(), 100);
    }

    // --- High-Performance Animation Loop with Delta-Time Damping ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const dt = Math.min(0.064, clock.getDelta());
      const time = clock.getElapsedTime();

      // Delta-time based exponential damping (HeroPage Formula)
      // Guarantees consistent feel at 30, 60, 120, or 144 Hz
      const damp = 1.0 - Math.exp(-6.0 * dt);
      const slowDamp = 1.0 - Math.exp(-3.5 * dt);

      // 1. Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * damp;
      mouse.y += (mouse.targetY - mouse.y) * damp;

      // 2. Smooth scroll interpolation
      smoothedScroll += (targetScroll - smoothedScroll) * slowDamp;

      // 3. Smooth button hover dispersal transition
      buttonHoverProgress += (buttonHoverTarget - buttonHoverProgress) * (1.0 - Math.exp(-8.0 * dt));

      // 4. Update GPU Uniforms
      shaderUniforms.uTime.value = time;
      shaderUniforms.uMousePosition.value.set(mouse.x, mouse.y);
      shaderUniforms.uDispersalProgress.value = buttonHoverProgress;

      if (!prefersReducedMotion) {
        // Idle camera auto-drift (HeroPage Technique)
        const autoDriftZ = Math.sin(time * 0.15) * 0.2;

        // Camera scroll path
        const targetCamX = mouse.x * 0.7;
        const targetCamY = initialCamPos.y - smoothedScroll * 1.25 + mouse.y * 0.22;
        const targetCamZ = initialCamPos.z - smoothedScroll * 5.2 + autoDriftZ;

        cameraContainer.position.x += (targetCamX - cameraContainer.position.x) * damp;
        cameraContainer.position.y += (targetCamY - cameraContainer.position.y) * damp;
        cameraContainer.position.z += (targetCamZ - cameraContainer.position.z) * damp;

        // Camera look target
        const lookTargetY = 1.05 - smoothedScroll * 0.85;
        const lookTargetZ = -smoothedScroll * 4.0;
        camera.lookAt(targetCamX * 0.3, lookTargetY, lookTargetZ);

        // Subtle rotational tilt towards cursor (HeroPage Technique)
        const targetRotY = -mouse.x * 0.045;
        const targetRotX = mouse.y * 0.035;
        camera.rotation.y += (targetRotY - camera.rotation.y) * slowDamp;
        camera.rotation.x += (targetRotX - camera.rotation.x) * slowDamp;

        // Organic harmonic breathing container (HeroPage Technique)
        breathContainer.position.y = 0.025 * Math.cos(1.15 * time);
        breathContainer.position.z = 0.065 * Math.sin(0.95 * time);
        breathContainer.rotation.z = 0.006 * Math.sin(0.75 * time);

        // Dynamic FOV expansion on CTA hover (HeroPage Technique)
        const targetFov = 40 + buttonHoverProgress * 4.5;
        if (Math.abs(camera.fov - targetFov) > 0.01) {
          camera.fov += (targetFov - camera.fov) * damp;
          camera.updateProjectionMatrix();
        }

        // Swaying valley point lights
        cyanLight.position.x = -4.0 + Math.sin(time * 0.55) * 0.5;
        cyanLight.position.z = 1.5 + Math.cos(time * 0.45) * 0.4;
        violetLight.position.x = 4.5 + Math.cos(time * 0.65) * 0.4;
        violetLight.position.z = -1.0 + Math.sin(time * 0.4) * 0.5;
      }

      // Render through composer and measure execution time
      const t0 = performance.now();
      composer.render();
      const renderMs = performance.now() - t0;
      (window as unknown as { __lastRenderMs?: number; __avgRenderMs?: number; __frameCount?: number }).__lastRenderMs = renderMs;
      const win = window as unknown as { __renderTimes?: number[] };
      win.__renderTimes = win.__renderTimes || [];
      win.__renderTimes.push(renderMs);
      if (win.__renderTimes.length > 60) win.__renderTimes.shift();
    };

    animate();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", handleScroll);
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
      if (backgroundSound) {
        backgroundSound.stop();
        backgroundSound.disconnect();
      }
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
