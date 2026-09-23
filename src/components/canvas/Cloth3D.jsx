import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── 1. Procedural Micro-Weave Textile Bump Texture ──────────────────────────
let cachedWeaveTexture = null;
export function getFabricWeaveTexture() {
  if (cachedWeaveTexture) return cachedWeaveTexture;
  if (typeof document === 'undefined') return null;

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  // Woven twill cross-hatch textile threads
  const step = 4;
  for (let x = 0; x < size; x += step) {
    for (let y = 0; y < size; y += step) {
      const isOver = ((x / step) + (y / step)) % 2 === 0;
      const shade = isOver ? 168 : 92;
      ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
      ctx.fillRect(x, y, step, step);
    }
  }

  cachedWeaveTexture = new THREE.CanvasTexture(canvas);
  cachedWeaveTexture.wrapS = THREE.RepeatWrapping;
  cachedWeaveTexture.wrapT = THREE.RepeatWrapping;
  cachedWeaveTexture.repeat.set(36, 36);
  return cachedWeaveTexture;
}

// ─── 2. High-Fidelity Procedural Garment Fabric Texture ───────────────────────
// Generates 360° woven fabric textures with authentic stitching, pockets,
// buttons, zippers, seams, and fabric grain matching the selected garment.
const garmentTextureCache = new Map();

export function getGarmentTexture(item) {
  if (!item) return null;
  if (typeof document === 'undefined') return null;

  const key = `${item.id}_${item.meshColor || ''}_${item.category || ''}`;
  if (garmentTextureCache.has(key)) {
    return garmentTextureCache.get(key);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  const baseHex = item.meshColor || '#383838';
  const cat = (item.bodyPart || item.category || 'torso').toLowerCase();

  // 1. Base fabric color fill
  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Micro-fabric fiber noise and texture variation
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  for (let y = 0; y < canvas.height; y += 4) {
    ctx.fillRect(0, y, canvas.width, 2);
  }
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  for (let x = 0; x < canvas.width; x += 6) {
    ctx.fillRect(x, 0, 3, canvas.height);
  }

  // 3. Side Seams at u=0.25 (left side) and u=0.75 (right side)
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.lineWidth = 4;
  ctx.setLineDash([8, 6]);

  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.25, 0);
  ctx.lineTo(canvas.width * 0.25, canvas.height);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.75, 0);
  ctx.lineTo(canvas.width * 0.75, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // 4. Back Yoke & Center Back Seam (u=0.0 and u=1.0)
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height * 0.3);
  ctx.lineTo(canvas.width * 0.25, canvas.height * 0.3);
  ctx.moveTo(canvas.width * 0.75, canvas.height * 0.3);
  ctx.lineTo(canvas.width, canvas.height * 0.3);
  ctx.stroke();

  // 5. Garment-specific Front Details (centered at u=0.5 -> x = 1024)
  const cx = canvas.width * 0.5;

  if (cat === 'jacket' || cat === 'coat') {
    // ── Metallic Front Zipper ──
    const zipWidth = 14;
    ctx.fillStyle = 'rgba(20, 20, 20, 0.8)';
    ctx.fillRect(cx - zipWidth / 2, canvas.height * 0.08, zipWidth, canvas.height * 0.88);

    // Brass/silver zipper teeth
    ctx.fillStyle = '#b0b8c0';
    for (let y = canvas.height * 0.1; y < canvas.height * 0.94; y += 8) {
      ctx.fillRect(cx - 5, y, 10, 4);
    }

    // Zipper pull slider
    ctx.fillStyle = '#d0d8e0';
    ctx.fillRect(cx - 7, canvas.height * 0.22, 14, 24);

    // Contrast topstitching flanking zipper
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.moveTo(cx - 18, canvas.height * 0.08);
    ctx.lineTo(cx - 18, canvas.height * 0.95);
    ctx.moveTo(cx + 18, canvas.height * 0.08);
    ctx.lineTo(cx + 18, canvas.height * 0.95);
    ctx.stroke();

    // Chest Cargo Flap Pockets
    const drawPocket = (px, py, pw, ph) => {
      // Pocket body
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(px, py, pw, ph);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.lineWidth = 3;
      ctx.strokeRect(px, py, pw, ph);
      // Flap
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(px - 4, py - 6, pw + 8, 30);
      ctx.strokeRect(px - 4, py - 6, pw + 8, 30);
      // Snap button
      ctx.beginPath();
      ctx.arc(px + pw / 2, py + 14, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#a8b0b8';
      ctx.fill();
      ctx.stroke();
    };

    // Upper chest pockets
    drawPocket(cx - 240, canvas.height * 0.26, 170, 150);
    drawPocket(cx + 70, canvas.height * 0.26, 170, 150);

    // Lower hip pockets
    drawPocket(cx - 270, canvas.height * 0.54, 200, 180);
    drawPocket(cx + 70, canvas.height * 0.54, 200, 180);
    ctx.setLineDash([]);
  } else if (cat === 'top' || cat === 'shirt') {
    // ── Oxford Shirt / Polo Placket & Buttons ──
    const placketW = 34;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(cx - placketW / 2, canvas.height * 0.05, placketW, canvas.height * 0.9);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - placketW / 2, canvas.height * 0.05, placketW, canvas.height * 0.9);

    // Pearl buttons
    for (let y = canvas.height * 0.16; y < canvas.height * 0.88; y += 95) {
      ctx.beginPath();
      ctx.arc(cx, y, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#f8f8f4';
      ctx.fill();
      ctx.strokeStyle = '#c0c0b8';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Thread holes
      ctx.fillStyle = '#555555';
      ctx.fillRect(cx - 3, y - 2, 2, 2);
      ctx.fillRect(cx + 1, y - 2, 2, 2);
      ctx.fillRect(cx - 3, y + 1, 2, 2);
      ctx.fillRect(cx + 1, y + 1, 2, 2);
    }
  } else if (cat === 'pants' || cat === 'shorts') {
    // ── Trousers / Jeans Front Fly & Waistband ──
    // Waistband
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, canvas.width, 70);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 70);
    ctx.lineTo(canvas.width, 70);
    ctx.stroke();

    // Belt loops
    const loopPositions = [cx - 280, cx - 120, cx + 120, cx + 280, canvas.width * 0.25, canvas.width * 0.75];
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    loopPositions.forEach((lx) => {
      ctx.fillRect(lx, 6, 18, 60);
      ctx.strokeRect(lx, 6, 18, 60);
    });

    // Front waistband button
    ctx.beginPath();
    ctx.arc(cx, 35, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#c8d0d8';
    ctx.fill();
    ctx.stroke();

    // J-stitch Fly
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, 70);
    ctx.lineTo(cx, 280);
    ctx.arcTo(cx, 330, cx - 60, 330, 45);
    ctx.stroke();

    // Front pockets
    ctx.beginPath();
    ctx.moveTo(cx - 150, 70);
    ctx.arcTo(cx - 360, 70, cx - 360, 240, 90);
    ctx.moveTo(cx + 150, 70);
    ctx.arcTo(cx + 360, 70, cx + 360, 240, 90);
    ctx.stroke();
  } else if (cat === 'dress') {
    // ── Elegant Dress Bodice Seams & Neckline ──
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 3;
    // Princess seams curving from armhole to waist
    ctx.beginPath();
    ctx.moveTo(cx - 160, canvas.height * 0.15);
    ctx.quadraticCurveTo(cx - 80, canvas.height * 0.35, cx - 60, canvas.height * 0.52);
    ctx.moveTo(cx + 160, canvas.height * 0.15);
    ctx.quadraticCurveTo(cx + 80, canvas.height * 0.35, cx + 60, canvas.height * 0.52);
    ctx.stroke();

    // Empire waist ribbon line
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.52);
    ctx.lineTo(canvas.width, canvas.height * 0.52);
    ctx.stroke();
  }

  // Bottom Hem rolled stitching
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - 20);
  ctx.lineTo(canvas.width, canvas.height - 20);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  garmentTextureCache.set(key, texture);
  return texture;
}

// ─── 3. Torso Garment 3D Mesh with Baked AO Shadowing (Tops, Jackets, Coats) ─
export function createTorsoGarmentGeometry({ category = 'top', scale = 1, gender = 'Female' }) {
  const geo = new THREE.BufferGeometry();
  const positions = [];
  const uvs = [];
  const indices = [];
  const colors = [];

  const isMale = gender === 'Male' || gender === 'M';
  const isJacket = category === 'jacket';
  const isCoat = category === 'full' || category === 'coat';
  const isCrop = category === 'crop';

  const yBottom = isCoat ? (isMale ? 0.60 : 0.58) : isJacket ? (isMale ? 0.84 : 0.88) : isCrop ? 1.10 : (isMale ? 0.88 : 0.93);
  const yTop = isMale ? 1.51 : 1.47;
  const radialSegs = 56;
  const heightSegs = 44;
  const zCenterBase = (isMale ? -0.015 : -0.045) * scale;
  const layerOffset = (isCoat ? 0.026 : isJacket ? 0.020 : 0.014) * scale;

  for (let j = 0; j <= heightSegs; j++) {
    const v = j / heightSegs;
    const y = (yBottom + v * (yTop - yBottom)) * scale;
    const yNorm = y / scale;

    let rx, rz;
    if (isMale) {
      if (yNorm < 1.10) {
        const t = Math.max(0, (yNorm - yBottom) / (1.10 - yBottom));
        rx = THREE.MathUtils.lerp(0.23, 0.22, t);
        rz = THREE.MathUtils.lerp(0.18, 0.17, t);
      } else if (yNorm < 1.35) {
        const t = (yNorm - 1.10) / (1.35 - 1.10);
        rx = THREE.MathUtils.lerp(0.22, 0.24, t);
        rz = THREE.MathUtils.lerp(0.17, 0.175, t);
      } else {
        const t = (yNorm - 1.35) / (yTop - 1.35);
        rx = THREE.MathUtils.lerp(0.24, 0.25, t);
        rz = THREE.MathUtils.lerp(0.175, 0.16, t);
      }
    } else {
      if (yNorm < 1.05) {
        const t = Math.max(0, (yNorm - yBottom) / (1.05 - yBottom));
        rx = THREE.MathUtils.lerp(0.22, 0.19, t);
        rz = THREE.MathUtils.lerp(0.18, 0.16, t);
      } else if (yNorm < 1.25) {
        const t = (yNorm - 1.05) / (1.25 - 1.05);
        rx = THREE.MathUtils.lerp(0.19, 0.23, t);
        rz = THREE.MathUtils.lerp(0.16, 0.18, t);
      } else {
        const t = (yNorm - 1.25) / (yTop - 1.25);
        rx = THREE.MathUtils.lerp(0.23, 0.25, t);
        rz = THREE.MathUtils.lerp(0.18, 0.16, t);
      }
    }

    rx = (rx + layerOffset) * scale;
    rz = (rz + layerOffset) * scale;

    for (let i = 0; i <= radialSegs; i++) {
      const u = i / radialSegs;
      const theta = -Math.PI + u * Math.PI * 2; // -pi to +pi
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);

      let x = rx * sinT;
      let z = zCenterBase + rz * cosT;

      // Realistic physical cloth folds
      // 1. Waist gathering horizontal compression folds
      const waistFoldAmp = isMale ? 0.007 : 0.014;
      const waistFold =
        waistFoldAmp *
        Math.sin(yNorm * 26 + cosT * 1.5) *
        Math.exp(-Math.pow((yNorm - 1.10) / 0.10, 2)) *
        (1 + 0.3 * Math.cos(2 * theta));

      // 2. Diagonal tension drape lines radiating from shoulders across chest
      const drapeFold =
        0.010 *
        Math.cos(4 * theta + 10 * (yNorm - 1.22)) *
        Math.exp(-Math.pow((yNorm - 1.28) / 0.14, 2));

      // 3. Bust forward curve
      const bustCurve =
        0.016 *
        Math.pow(Math.max(0, cosT), 1.5) *
        Math.exp(-Math.pow((yNorm - 1.27) / 0.12, 2));

      // 4. Front zipper / button placket ridge
      const frontRidge =
        0.007 *
        Math.exp(-Math.pow(sinT / 0.12, 2)) *
        (cosT > 0.4 ? 1 : 0);

      // 5. Collar lapel fold at neckline
      const collarFold =
        yNorm > 1.39
          ? 0.014 * Math.max(0, cosT) * ((yNorm - 1.39) / 0.08)
          : 0;

      // 6. Hem roll at bottom edge
      const hemRoll =
        yNorm < yBottom + 0.03
          ? 0.009 * (1 - (yNorm - yBottom) / 0.03)
          : 0;

      // 7. Upper arm & shoulder sleeve drape
      const sleeveDrape =
        yNorm > 1.15 && yNorm < 1.47
          ? 0.055 *
            Math.pow(Math.abs(sinT), 2) *
            Math.sin(((yNorm - 1.15) / (1.47 - 1.15)) * Math.PI)
          : 0;

      // 8. Fabric micro-wrinkles
      const micro = 0.0025 * Math.sin(24 * theta + 32 * yNorm);

      const totalDisp =
        (waistFold + drapeFold + bustCurve + frontRidge + collarFold + hemRoll + micro) * scale;
      x += sinT * (totalDisp + sleeveDrape * scale);
      z += cosT * totalDisp;

      positions.push(x, y, z);
      uvs.push(u, 1 - v);

      // Baked Ambient Occlusion (AO): darken valleys of folds, highlight crests
      const aoShade = THREE.MathUtils.clamp(
        1.0 + (waistFold + drapeFold) * 12.0 - (bustCurve > 0 ? 0.05 : 0),
        0.72,
        1.10
      );
      colors.push(aoShade, aoShade, aoShade);
    }
  }

  for (let j = 0; j < heightSegs; j++) {
    for (let i = 0; i < radialSegs; i++) {
      const a = j * (radialSegs + 1) + i;
      const b = j * (radialSegs + 1) + (i + 1);
      const c = (j + 1) * (radialSegs + 1) + (i + 1);
      const d = (j + 1) * (radialSegs + 1) + i;
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

// ─── 4. Pants / Shorts 3D Mesh with Pelvis Saddle, Knee Bunching & Whiskering ─
export function createPantsGarmentGeometry({ category = 'pants', scale = 1, gender = 'Female' }) {
  const geo = new THREE.BufferGeometry();
  const positions = [];
  const uvs = [];
  const indices = [];
  const colors = [];

  const isMale = gender === 'Male' || gender === 'M';
  const isShorts = category === 'shorts';
  const yBottom = isShorts ? (isMale ? 0.68 : 0.65) : (isMale ? 0.14 : 0.15);
  const yWaist = isMale ? 1.02 : 0.96;
  const yCrotch = isMale ? 0.84 : 0.78;
  const zCenter = (isMale ? -0.01 : -0.02) * scale;
  const offset = 0.016 * scale;

  // ── A. Pelvis / Hips / Waistband Unit (Continuous 360° Saddle) ──────────
  const yPelvisBottom = yCrotch - 0.03;
  const pelvisHeightSegs = 14;
  const pelvisRadialSegs = 48;
  const pelvisBaseIndex = 0;

  for (let j = 0; j <= pelvisHeightSegs; j++) {
    const vP = j / pelvisHeightSegs;
    const y = (yPelvisBottom + vP * (yWaist - yPelvisBottom)) * scale;
    const yNorm = y / scale;

    const tP = (yNorm - yPelvisBottom) / (yWaist - yPelvisBottom);
    let rx = THREE.MathUtils.lerp(isMale ? 0.222 : 0.210, isMale ? 0.204 : 0.188, tP);
    let rz = THREE.MathUtils.lerp(isMale ? 0.174 : 0.165, isMale ? 0.162 : 0.152, tP);

    rx = (rx + offset) * scale;
    rz = (rz + offset) * scale;

    for (let i = 0; i <= pelvisRadialSegs; i++) {
      const u = i / pelvisRadialSegs;
      const theta = -Math.PI + u * Math.PI * 2;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);

      let x = rx * sinT;
      let z = zCenter + rz * cosT;

      // Realistic anatomical folds & tailoring seams on the pelvis
      const whisker =
        0.009 * Math.cos(5 * theta + 14 * yNorm) * Math.exp(-Math.pow((yNorm - yCrotch) / 0.08, 2));
      const flyRidge =
        0.006 * Math.exp(-Math.pow(sinT / 0.10, 2)) * (cosT > 0.4 ? 1 : 0);
      const seatCurve =
        0.012 * Math.pow(Math.max(0, -cosT), 1.6) * Math.exp(-Math.pow((yNorm - (yCrotch + 0.06)) / 0.10, 2));

      const disp = (whisker + flyRidge + seatCurve) * scale;
      x += sinT * disp;
      z += cosT * disp;

      positions.push(x, y, z);
      // Map UV to upper denim/canvas zone (waistband, belt loops, front fly button)
      uvs.push(u, THREE.MathUtils.lerp(0.65, 1.0, vP));

      const ao = THREE.MathUtils.clamp(
        1.0 + (whisker + flyRidge) * 12.0 - (cosT < -0.3 ? 0.04 : 0),
        0.72,
        1.08
      );
      colors.push(ao, ao, ao);
    }
  }

  for (let j = 0; j < pelvisHeightSegs; j++) {
    for (let i = 0; i < pelvisRadialSegs; i++) {
      const a = pelvisBaseIndex + j * (pelvisRadialSegs + 1) + i;
      const b = pelvisBaseIndex + j * (pelvisRadialSegs + 1) + (i + 1);
      const c = pelvisBaseIndex + (j + 1) * (pelvisRadialSegs + 1) + (i + 1);
      const d = pelvisBaseIndex + (j + 1) * (pelvisRadialSegs + 1) + i;
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  // ── B. Left & Right Legs (Extending from yBottom into the Pelvis Saddle) ─
  const yLegTop = yCrotch + 0.04;
  const legRadialSegs = 32;
  const legHeightSegs = isShorts ? 14 : 26;

  function addLeg(xCenterSign, uOffset) {
    const baseIndex = positions.length / 3;
    const xCenter = xCenterSign * (isMale ? 0.098 : 0.106) * scale;

    for (let j = 0; j <= legHeightSegs; j++) {
      const vL = j / legHeightSegs;
      const y = (yBottom + vL * (yLegTop - yBottom)) * scale;
      const yNorm = y / scale;

      const tL = (yNorm - yBottom) / (yLegTop - yBottom);
      let r = THREE.MathUtils.lerp(
        isMale ? 0.112 : 0.106,
        isMale ? 0.126 : 0.120,
        tL
      );
      r = (r + offset) * scale;

      for (let i = 0; i <= legRadialSegs; i++) {
        const u = i / legRadialSegs;
        const theta = -Math.PI + u * Math.PI * 2;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);

        let x = xCenter + r * sinT;
        let z = zCenter + r * cosT;

        // Folds on legs
        const kneeFold = !isShorts
          ? 0.016 * Math.sin(yNorm * 28) * Math.exp(-Math.pow((yNorm - 0.50) / 0.08, 2))
          : 0;
        const crease = 0.005 * Math.max(0, cosT - 0.8) / 0.2;
        const hemCuff =
          yNorm < yBottom + 0.03 ? 0.008 * (1 - (yNorm - yBottom) / 0.03) : 0;
        const micro = 0.002 * Math.sin(20 * theta + 28 * yNorm);

        const disp = (kneeFold + crease + hemCuff + micro) * scale;
        x += sinT * disp;
        z += cosT * disp;

        positions.push(x, y, z);
        // Map UV to lower fabric zone (leg weave, bottom hem stitch)
        uvs.push(uOffset + u * 0.5, THREE.MathUtils.lerp(0.0, 0.65, vL));

        const ao = THREE.MathUtils.clamp(1.0 + kneeFold * 14.0, 0.72, 1.08);
        colors.push(ao, ao, ao);
      }
    }

    for (let j = 0; j < legHeightSegs; j++) {
      for (let i = 0; i < legRadialSegs; i++) {
        const a = baseIndex + j * (legRadialSegs + 1) + i;
        const b = baseIndex + j * (legRadialSegs + 1) + (i + 1);
        const c = baseIndex + (j + 1) * (legRadialSegs + 1) + (i + 1);
        const d = baseIndex + (j + 1) * (legRadialSegs + 1) + i;
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }
  }

  // Left Leg
  addLeg(-1, 0.0);
  // Right Leg
  addLeg(1, 0.5);

  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

// ─── 5. Dress / Skirt 3D Mesh with Cascading Fluted Pleats ───────────────────
export function createDressGarmentGeometry({ scale = 1 }) {
  const geo = new THREE.BufferGeometry();
  const positions = [];
  const uvs = [];
  const indices = [];
  const colors = [];

  const yBottom = 0.38;
  const yWaist = 0.98;
  const yTop = 1.45;
  const radialSegs = 56;
  const heightSegs = 50;
  const zCenter = -0.045 * scale;

  for (let j = 0; j <= heightSegs; j++) {
    const v = j / heightSegs;
    const y = (yBottom + v * (yTop - yBottom)) * scale;
    const yNorm = y / scale;

    let rx, rz;
    if (yNorm < yWaist) {
      // Skirt: flared A-line cone
      const skirtT = (yWaist - yNorm) / (yWaist - yBottom);
      rx = THREE.MathUtils.lerp(0.20, 0.40, skirtT);
      rz = THREE.MathUtils.lerp(0.17, 0.36, skirtT);
    } else {
      // Bodice
      const bodiceT = (yNorm - yWaist) / (yTop - yWaist);
      rx = THREE.MathUtils.lerp(0.20, 0.23, bodiceT);
      rz = THREE.MathUtils.lerp(0.17, 0.16, bodiceT);
    }

    rx = (rx + 0.016) * scale;
    rz = (rz + 0.016) * scale;

    for (let i = 0; i <= radialSegs; i++) {
      const u = i / radialSegs;
      const theta = -Math.PI + u * Math.PI * 2;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);

      let x = rx * sinT;
      let z = zCenter + rz * cosT;

      let foldDisp = 0;
      let ao = 1.0;

      // Cascading fluted drapery folds on skirt
      if (yNorm < yWaist) {
        const skirtT = (yWaist - yNorm) / (yWaist - yBottom);
        const flute = 0.028 * Math.sin(10 * theta) * Math.pow(skirtT, 1.2);
        foldDisp = flute * scale;
        ao = THREE.MathUtils.clamp(1.0 + Math.sin(10 * theta) * 0.25 * skirtT, 0.70, 1.10);
      } else {
        const waistFold =
          0.012 * Math.sin(yNorm * 24) * Math.exp(-Math.pow((yNorm - yWaist) / 0.08, 2));
        const bust =
          0.014 * Math.pow(Math.max(0, cosT), 1.5) * Math.exp(-Math.pow((yNorm - 1.26) / 0.12, 2));
        foldDisp = (waistFold + bust) * scale;
        ao = THREE.MathUtils.clamp(1.0 + waistFold * 12.0, 0.75, 1.05);
      }

      x += sinT * foldDisp;
      z += cosT * foldDisp;

      positions.push(x, y, z);
      uvs.push(u, 1 - v);
      colors.push(ao, ao, ao);
    }
  }

  for (let j = 0; j < heightSegs; j++) {
    for (let i = 0; i < radialSegs; i++) {
      const a = j * (radialSegs + 1) + i;
      const b = j * (radialSegs + 1) + (i + 1);
      const c = (j + 1) * (radialSegs + 1) + (i + 1);
      const d = (j + 1) * (radialSegs + 1) + i;
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

// ─── 6. 3D Cloth Item Component ───────────────────────────────────────────────
// Seamlessly encases the 3D human body in 360° with true physical volume,
// authentic drape folds, ambient occlusion crevice shading, woven fabric bump,
// and realistic PBR lighting sheen.
export function ClothItem3D({ item, scale = 1, gender = 'Female' }) {
  const meshRef = useRef();
  const cat = (item.bodyPart || item.category || 'torso').toLowerCase();

  // Generate procedural garment texture with stitching & hardware
  const texture = useMemo(() => getGarmentTexture(item), [item]);
  const bumpTexture = useMemo(() => getFabricWeaveTexture(), []);

  // Generate continuous 3D garment geometry
  const geometry = useMemo(() => {
    if (cat === 'dress' || cat === 'full' || cat === 'set') {
      return createDressGarmentGeometry({ scale });
    }
    if (cat === 'pants' || cat === 'legs' || cat === 'shorts' || cat === 'lower') {
      return createPantsGarmentGeometry({ category: cat, scale, gender });
    }
    return createTorsoGarmentGeometry({ category: cat, scale, gender });
  }, [cat, scale, gender]);

  // Subtle natural fabric breathing & drape dynamics
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const breath = 1 + Math.sin(t * 1.8) * 0.0025;
    meshRef.current.scale.set(breath, 1.0, breath);
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      castShadow
      receiveShadow
    >
      <meshPhysicalMaterial
        map={texture}
        vertexColors={true}
        bumpMap={bumpTexture}
        bumpScale={0.0032}
        roughness={cat === 'jacket' ? 0.72 : 0.82}
        metalness={cat === 'jacket' ? 0.04 : 0.01}
        sheen={0.92}
        sheenColor={new THREE.Color('#f1f5f9')}
        sheenRoughness={0.36}
        clearcoat={cat === 'jacket' ? 0.06 : 0.0}
        side={THREE.DoubleSide}
        depthWrite={true}
      />
    </mesh>
  );
}
