import type { Canvas as FabricCanvas } from 'fabric';

/** Serialize a Fabric.js canvas to a JSON string, persisting custom properties. */
export function serializeCanvas(canvas: FabricCanvas): string {
  try {
    const json =
      (canvas as any).toJSON?.(['selectable', 'evented', 'name', 'data']) ||
      (canvas as any).toObject?.(['selectable', 'evented', 'name', 'data']);
    return JSON.stringify(json);
  } catch (err) {
    console.error('Error serializing canvas:', err);
    return JSON.stringify({ version: '6.0.0', objects: [] });
  }
}

/** Load canvas state from a JSON string produced by serializeCanvas(). */
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
      canvas.renderAll();
    }
  } catch (err) {
    console.error('Failed to deserialize canvas:', err);
  }
}

/** Export the canvas as a PNG data URL at the given pixel multiplier (default 2× for retina). */
export function exportAsPNG(canvas: FabricCanvas, multiplier = 2): string {
  return canvas.toDataURL({ format: 'png', multiplier });
}

/** Export the canvas as an SVG string. */
export function exportAsSVG(canvas: FabricCanvas): string {
  return canvas.toSVG();
}

/** Trigger a browser file download for any string content or data URL. */
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
