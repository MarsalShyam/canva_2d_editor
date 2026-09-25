import { FabricImage } from 'fabric';
import type { Canvas as FabricCanvas } from 'fabric';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';

function hexToRgba(hex: string): [number, number, number, number] {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map((x) => x + x).join('');
  }
  const num = parseInt(c, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255, 255];
}

export function performFloodFill(
  canvas: FabricCanvas,
  clickX: number,
  clickY: number,
  fillColorHex: string,
  tolerance = 36
): boolean {
  const startX = Math.round(clickX);
  const startY = Math.round(clickY);

  if (startX < 0 || startX >= CANVAS_WIDTH || startY < 0 || startY >= CANVAS_HEIGHT) {
    return false;
  }

  // 1. Rendering current canvas state into offscreen canvas
  const offscreen = document.createElement('canvas');
  offscreen.width = CANVAS_WIDTH;
  offscreen.height = CANVAS_HEIGHT;
  const ctx = offscreen.getContext('2d', { willReadFrequently: true });
  if (!ctx) return false;

  // Background white
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Lower canvas element from Fabric
  const lowerCanvas = canvas.lowerCanvasEl;
  if (lowerCanvas) {
    ctx.drawImage(lowerCanvas, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  const srcImageData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  const srcData = srcImageData.data;

  // 2. Identify the starting color
  const startIndex = (startY * CANVAS_WIDTH + startX) * 4;
  const startR = srcData[startIndex];
  const startG = srcData[startIndex + 1];
  const startB = srcData[startIndex + 2];
  const startA = srcData[startIndex + 3];

  const [fillR, fillG, fillB, fillA] = hexToRgba(fillColorHex);

  // Checking if already same color
  const isSameColor =
    Math.abs(startR - fillR) < 5 &&
    Math.abs(startG - fillG) < 5 &&
    Math.abs(startB - fillB) < 5 &&
    Math.abs(startA - fillA) < 5;

  if (isSameColor) return false;

  // 3. Flood Filling using BFS queue- Dsa skill used here
  const visited = new Uint8Array(CANVAS_WIDTH * CANVAS_HEIGHT);
  const queue = new Int32Array(CANVAS_WIDTH * CANVAS_HEIGHT);
  let queueHead = 0;
  let queueTail = 0;

  const startCoord = startX + startY * CANVAS_WIDTH;
  queue[queueTail++] = startCoord;
  visited[startCoord] = 1;

  let minX = startX;
  let maxX = startX;
  let minY = startY;
  let maxY = startY;

  const tolSq = tolerance * tolerance;

  while (queueHead < queueTail) {
    const coord = queue[queueHead++];
    const cx = coord % CANVAS_WIDTH;
    const cy = Math.floor(coord / CANVAS_WIDTH);

    if (cx < minX) minX = cx;
    if (cx > maxX) maxX = cx;
    if (cy < minY) minY = cy;
    if (cy > maxY) maxY = cy;

    // Check 4 neighbors
    const neighbors = [
      cx > 0 ? coord - 1 : -1,
      cx < CANVAS_WIDTH - 1 ? coord + 1 : -1,
      cy > 0 ? coord - CANVAS_WIDTH : -1,
      cy < CANVAS_HEIGHT - 1 ? coord + CANVAS_WIDTH : -1,
    ];

    for (let i = 0; i < 4; i++) {
      const nCoord = neighbors[i];
      if (nCoord === -1 || visited[nCoord] === 1) continue;

      const nIndex = nCoord * 4;
      const dr = srcData[nIndex] - startR;
      const dg = srcData[nIndex + 1] - startG;
      const db = srcData[nIndex + 2] - startB;
      const da = srcData[nIndex + 3] - startA;

      if (dr * dr + dg * dg + db * db + da * da <= tolSq) {
        visited[nCoord] = 1;
        queue[queueTail++] = nCoord;
      }
    }
  }

  // If no area was filled then return false
  if (queueTail === 0) return false;

  // 4. Patch canvas of bounding box
  const patchWidth = maxX - minX + 1;
  const patchHeight = maxY - minY + 1;

  const patchCanvas = document.createElement('canvas');
  patchCanvas.width = patchWidth;
  patchCanvas.height = patchHeight;
  const patchCtx = patchCanvas.getContext('2d');
  if (!patchCtx) return false;

  const patchImageData = patchCtx.createImageData(patchWidth, patchHeight);
  const patchData = patchImageData.data;

  for (let i = 0; i < queueTail; i++) {
    const coord = queue[i];
    const cx = coord % CANVAS_WIDTH;
    const cy = Math.floor(coord / CANVAS_WIDTH);

    const px = cx - minX;
    const py = cy - minY;
    const patchIndex = (py * patchWidth + px) * 4;

    patchData[patchIndex] = fillR;
    patchData[patchIndex + 1] = fillG;
    patchData[patchIndex + 2] = fillB;
    patchData[patchIndex + 3] = fillA;
  }

  patchCtx.putImageData(patchImageData, 0, 0);

  // 5. Create FabricImage from patch canvas
  const fillImage = new FabricImage(patchCanvas, {
    left: minX,
    top: minY,
    selectable: true,
  });

  canvas.add(fillImage);

  // Position it behind pen strokes / outlines so boundaries look crisp
  canvas.sendObjectToBack(fillImage);
  canvas.renderAll();

  return true;
}
