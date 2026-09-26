import type { Canvas as FabricCanvas, FabricObject } from 'fabric';
import type { ToolType } from '../types/canvas';

export const CANVAS_SERIALIZATION_PROPERTIES = [
  'locked',
  'selectable',
  'evented',
  'lockMovementX',
  'lockMovementY',
  'lockRotation',
  'lockScalingX',
  'lockScalingY',
  'lockUniScaling',
  'hasControls',
  'hasBorders',
  'editable',
  'name',
  'data',
];

/* Serializing a Fabric.js canvas to a JSON string, persisting custom properties. */
export function serializeCanvas(canvas: FabricCanvas): string {
  try {
    const json =
      (canvas as any).toJSON?.(CANVAS_SERIALIZATION_PROPERTIES) ||
      (canvas as any).toObject?.(CANVAS_SERIALIZATION_PROPERTIES);
    return JSON.stringify(json);
  } catch (err) {
    console.error('Error serializing canvas:', err);
    return JSON.stringify({ version: '6.0.0', objects: [] });
  }
}

/* Load canvas state from a JSON string produced by serializeCanvas(). */
export async function deserializeCanvas(
  canvas: FabricCanvas,
  jsonString: string
): Promise<void> {
  if (!canvas) return;
  if (!jsonString || jsonString.trim() === '' || jsonString === '{}') return;

  try {
    const parsed = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
    if (parsed && typeof parsed === 'object' && !parsed.objects) {
      parsed.objects = [];
    }

    if (typeof (canvas as any).loadFromJSON === 'function') {
      const result = (canvas as any).loadFromJSON(parsed);
      if (result && typeof result.then === 'function') {
        await result;
      }

      // Respect and restore saved lock states
      const objects = canvas.getObjects();
      objects.forEach((obj: any) => {
        const isLocked = Boolean(
          obj.locked ||
          obj.data?.locked ||
          obj.selectable === false ||
          obj.lockMovementX === true
        );
        if (isLocked) {
          obj.locked = true;
          if (!obj.data) obj.data = {};
          obj.data.locked = true;
          obj.set({
            selectable: false,
            evented: false,
            lockMovementX: true,
            lockMovementY: true,
            lockRotation: true,
            lockScalingX: true,
            lockScalingY: true,
            hasControls: false,
            editable: false,
          });
        }
      });

      canvas.renderAll();
    }
  } catch (err) {
    console.error('Failed to deserialize canvas:', err);
  }
}

/* Synchronizes canvas objects' selectable/evented states based on active tool and locked state. */
export function syncCanvasInteractivity(
  canvas: FabricCanvas,
  activeTool: ToolType,
  activeObjectToKeep?: FabricObject | null
) {
  const isSelectTool = activeTool === 'select';
  const isFillTool = activeTool === 'fill';
  const objects = canvas.getObjects();

  for (const obj of objects) {
    if ((obj as any).data?.isGrid) continue;

    const isLocked = Boolean(
      (obj as any).locked ||
      (obj as any).data?.locked ||
      (obj as any).lockMovementX === true
    );

    if (isLocked) {
      (obj as any).locked = true;
      if (!(obj as any).data) (obj as any).data = {};
      (obj as any).data.locked = true;
      obj.set({
        selectable: false,
        evented: false,
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        hasControls: false,
        editable: false,
      });
    } else if (isSelectTool) {
      obj.set({
        selectable: true,
        evented: true,
        lockMovementX: false,
        lockMovementY: false,
        lockRotation: false,
        lockScalingX: false,
        lockScalingY: false,
        hasControls: true,
        editable: true,
      });
    } else if (isFillTool) {
      obj.set({
        selectable: false,
        evented: true,
      });
    } else {
      if (activeObjectToKeep && obj === activeObjectToKeep) {
        obj.set({
          selectable: true,
          evented: true,
          lockMovementX: false,
          lockMovementY: false,
          lockRotation: false,
          lockScalingX: false,
          lockScalingY: false,
          hasControls: true,
        });
      } else {
        obj.set({
          selectable: false,
          evented: false,
        });
      }
    }
  }
}

/* Export the canvas as a PNG data URL at the given pixel multiplier (default 2× for retina). */
export function exportAsPNG(canvas: FabricCanvas, multiplier = 2): string {
  return canvas.toDataURL({ format: 'png', multiplier });
}

/* Export the canvas as an SVG string. */
export function exportAsSVG(canvas: FabricCanvas): string {
  return canvas.toSVG();
}

/* Trigger a browser file download for any string content or data URL. */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const isDataUrl = content.startsWith('data:');
  const link = document.createElement('a');
  link.download = filename;

  if (isDataUrl) {
    link.href = content;
  } else {
    const blob = new Blob([content], { type: mimeType });
    link.href = URL.createObjectURL(blob);
  }

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  if (!isDataUrl) {
    URL.revokeObjectURL(link.href);
  }
}
