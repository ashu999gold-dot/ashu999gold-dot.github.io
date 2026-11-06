import * as THREE from "three";

/**
 * Procedural Geometry Generator for Night Flower Valley
 * Creates detailed, recognizable flower geometries with realistic petals,
 * stems, leaves, and glowing stamen centers.
 */

// 1. SCULPTED PETAL GEOMETRY (Curved, tapered organic petal surface)
export function createSculptedPetalGeometry(
  length = 0.45,
  width = 0.18,
  curvature = 0.12,
  segmentsU = 8,
  segmentsV = 12
): THREE.BufferGeometry {
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let j = 0; j <= segmentsV; j++) {
    const v = j / segmentsV; // 0 (base) to 1 (tip)
    // Width profile: narrow base, wide at 40%, tapered tip
    const w = Math.sin(Math.pow(v, 0.7) * Math.PI) * width;
    // Arch curvature: petal arcs upward then curls gently downward at tip
    const archY = Math.sin(v * Math.PI * 0.9) * curvature;
    const droopZ = Math.pow(v, 2.2) * (length * 0.35);

    for (let i = 0; i <= segmentsU; i++) {
      const u = i / segmentsU; // 0 (left) to 1 (right)
      const uCentered = (u - 0.5) * 2; // -1 to 1

      // Central petal fold (crease along spine)
      const foldY = -Math.abs(uCentered) * (width * 0.25) * (1 - v * 0.5);

      const x = uCentered * (w * 0.5);
      const y = v * length + archY + foldY;
      const z = droopZ;

      positions.push(x, y, z);
      normals.push(0, 0, 1); // placeholder, computed below
      uvs.push(u, v);
    }
  }

  for (let j = 0; j < segmentsV; j++) {
    for (let i = 0; i < segmentsU; i++) {
      const a = j * (segmentsU + 1) + i;
      const b = a + 1;
      const c = (j + 1) * (segmentsU + 1) + i;
      const d = c + 1;
      indices.push(a, b, c);
      indices.push(b, d, c);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

// 2. BELL COROLLA GEOMETRY (Fluted campanula/foxglove bell with ruffled petal lobes)
export function createBellCorollaGeometry(): THREE.BufferGeometry {
  // Profile points for LatheGeometry representing a flared fluted bell
  const points: THREE.Vector2[] = [];
  const steps = 16;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Base is narrow calyx (0.04), swells into bell belly (0.16), flares outward at rim (0.26)
    const radius = 0.04 + Math.sin(t * Math.PI * 0.75) * 0.12 + Math.pow(t, 3) * 0.1;
    const y = t * 0.48;
    points.push(new THREE.Vector2(radius, y));
  }

  const geometry = new THREE.LatheGeometry(points, 12);
  // Invert bell so it droops gracefully like a bluebell
  geometry.rotateX(Math.PI);
  geometry.translate(0, 0.48, 0);

  // Slightly scallop the rim vertices for organic petal lobes
  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    if (y < 0.1) {
      const angle = Math.atan2(pos.getZ(i), pos.getX(i));
      const lobe = Math.sin(angle * 6) * 0.025;
      pos.setY(i, y + lobe);
    }
  }
  geometry.computeVertexNormals();
  return geometry;
}

// 3. COMPLETE STAR LILY BLOSSOM GEOMETRY (6 sculpted radial petals merged into one)
export function createStarLilyBlossomGeometry(): THREE.BufferGeometry {
  const petalBase = createSculptedPetalGeometry(0.42, 0.16, 0.1, 6, 8);
  const petalCount = 6;
  const mergedGeos: THREE.BufferGeometry[] = [];

  for (let i = 0; i < petalCount; i++) {
    const petal = petalBase.clone();
    const angle = (i / petalCount) * Math.PI * 2;
    // Alternate tilt slightly for layered look (inner 3 and outer 3)
    const tilt = i % 2 === 0 ? 0.38 : 0.48;
    const scale = i % 2 === 0 ? 1.0 : 0.92;

    petal.scale(scale, scale, scale);
    petal.rotateX(tilt);
    petal.rotateY(angle);
    mergedGeos.push(petal);
  }

  // Merge geometries
  const merged = mergeBufferGeometries(mergedGeos);
  petalBase.dispose();
  mergedGeos.forEach((g) => g.dispose());
  return merged;
}

// 4. DAISY RAY PETAL BLOSSOM GEOMETRY (14 delicate radiating petals)
export function createDaisyBlossomGeometry(): THREE.BufferGeometry {
  const petalCount = 14;
  const petalBase = createSculptedPetalGeometry(0.32, 0.08, 0.04, 4, 6);
  const mergedGeos: THREE.BufferGeometry[] = [];

  for (let i = 0; i < petalCount; i++) {
    const petal = petalBase.clone();
    const angle = (i / petalCount) * Math.PI * 2;
    // Radial splay with slight cup
    petal.rotateX(Math.PI / 2 - 0.12);
    petal.rotateZ(angle);
    mergedGeos.push(petal);
  }

  const merged = mergeBufferGeometries(mergedGeos);
  petalBase.dispose();
  mergedGeos.forEach((g) => g.dispose());
  return merged;
}

// 5. ALLIUM / PUFF SPRAY GEOMETRY (Cluster of delicate radiating florets)
export function createAlliumSprayGeometry(): THREE.BufferGeometry {
  const pedicelCount = 28;
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  // Fibonacci sphere distribution for florets
  const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
  let vOffset = 0;

  for (let i = 0; i < pedicelCount; i++) {
    const y = 1 - (i / (pedicelCount - 1)) * 2; // -1 to 1
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = phi * i;

    const dirX = Math.cos(theta) * radiusAtY;
    const dirY = y;
    const dirZ = Math.sin(theta) * radiusAtY;

    // Pedicel rod (line segment with tiny cross section)
    const floretDist = 0.22 + (i % 3) * 0.03;
    const endX = dirX * floretDist;
    const endY = dirY * floretDist;
    const endZ = dirZ * floretDist;

    // Create a diamond floret at the tip
    const fSize = 0.045;
    // 4 vertices of a diamond floret facing outward
    const baseIdx = vOffset;
    positions.push(endX - fSize * 0.5, endY, endZ);
    positions.push(endX + fSize * 0.5, endY, endZ);
    positions.push(endX, endY + fSize * 0.5, endZ);
    positions.push(endX, endY - fSize * 0.5, endZ);

    normals.push(dirX, dirY, dirZ);
    normals.push(dirX, dirY, dirZ);
    normals.push(dirX, dirY, dirZ);
    normals.push(dirX, dirY, dirZ);

    uvs.push(0, 0, 1, 0, 0.5, 1, 0.5, 0);

    indices.push(baseIdx, baseIdx + 1, baseIdx + 2);
    indices.push(baseIdx, baseIdx + 3, baseIdx + 1);

    vOffset += 4;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  return geometry;
}

// 6. ORGANIC SLENDER STEM WITH LEAF PAIR
export function createOrganicStemGeometry(height = 0.85, curveAmount = 0.08): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(curveAmount * 0.4, height * 0.35, curveAmount * 0.2),
    new THREE.Vector3(curveAmount, height * 0.7, -curveAmount * 0.3),
    new THREE.Vector3(0, height, 0),
  ]);

  const stemGeo = new THREE.TubeGeometry(curve, 10, 0.02, 6, false);

  // Add a pair of small curved leaves branching from stem
  const leafBase = createSculptedPetalGeometry(0.24, 0.08, 0.06, 3, 5);

  const leaf1 = leafBase.clone();
  leaf1.rotateX(0.7);
  leaf1.rotateZ(0.6);
  leaf1.translate(0, height * 0.35, 0);

  const leaf2 = leafBase.clone();
  leaf2.rotateX(0.7);
  leaf2.rotateZ(-0.6);
  leaf2.rotateY(Math.PI);
  leaf2.translate(0, height * 0.5, 0);

  const merged = mergeBufferGeometries([stemGeo, leaf1, leaf2]);
  leafBase.dispose();
  leaf1.dispose();
  leaf2.dispose();
  stemGeo.dispose();
  return merged;
}

// 7. GLOWING STAMEN / ANTHER CORE GEOMETRY
export function createStamenCoreGeometry(radius = 0.065): THREE.BufferGeometry {
  // A glowing central spherical core with 5 tiny protruding anther beads
  const core = new THREE.SphereGeometry(radius, 8, 8);
  const antherGeo = new THREE.SphereGeometry(radius * 0.35, 6, 6);
  const geos: THREE.BufferGeometry[] = [core];

  for (let i = 0; i < 5; i++) {
    const anther = antherGeo.clone();
    const angle = (i / 5) * Math.PI * 2;
    anther.translate(
      Math.cos(angle) * (radius * 1.3),
      radius * 0.8,
      Math.sin(angle) * (radius * 1.3)
    );
    geos.push(anther);
  }

  const merged = mergeBufferGeometries(geos);
  antherGeo.dispose();
  return merged;
}

// HELPER: Merge Buffer Geometries
function mergeBufferGeometries(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
  let totalPos = 0;
  let totalNorm = 0;
  let totalIndices = 0;

  for (const g of geometries) {
    totalPos += g.attributes.position.array.length;
    if (g.attributes.normal) totalNorm += g.attributes.normal.array.length;
    if (g.index) totalIndices += g.index.array.length;
  }

  const mergedPos = new Float32Array(totalPos);
  const mergedNorm = new Float32Array(totalNorm);
  const mergedIndices: number[] = [];

  let posOffset = 0;
  let normOffset = 0;
  let vertexOffset = 0;

  for (const g of geometries) {
    const pos = g.attributes.position.array;
    mergedPos.set(pos, posOffset);
    posOffset += pos.length;

    if (g.attributes.normal) {
      const norm = g.attributes.normal.array;
      mergedNorm.set(norm, normOffset);
      normOffset += norm.length;
    }

    if (g.index) {
      const ind = g.index.array;
      for (let i = 0; i < ind.length; i++) {
        mergedIndices.push(ind[i] + vertexOffset);
      }
    }
    vertexOffset += g.attributes.position.count;
  }

  const merged = new THREE.BufferGeometry();
  merged.setAttribute("position", new THREE.BufferAttribute(mergedPos, 3));
  if (totalNorm > 0) {
    merged.setAttribute("normal", new THREE.BufferAttribute(mergedNorm, 3));
  }
  if (mergedIndices.length > 0) {
    merged.setIndex(mergedIndices);
  }
  merged.computeVertexNormals();
  return merged;
}
