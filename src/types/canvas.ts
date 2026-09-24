// Canvas Editor TypeScript Types


/** Supported shape and tool types */
export type ToolType =
  | 'select'
  | 'pen'
  | 'eraser'
  | 'text'
  | 'rectangle'
  | 'circle'
  | 'triangle'
  | 'line'
  | 'star'
  | 'arrow'
  | 'diamond';

/** Object properties editable in the properties panel */
export interface ObjectProperties {
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string | number;
  fontStyle?: string;
  textAlign?: string;
  angle: number;
  scaleX: number;
  scaleY: number;
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Firestore canvas document schema */
export interface CanvasDocument {
  id?: string;
  name?: string;
  title?: string;
  data?: any;
  canvasJSON?: string;
  width?: number;
  height?: number;
  createdAt: any;
  updatedAt: any;
}

/** Canvas history entry for undo/redo */
export interface HistoryEntry {
  json: string;
  timestamp: number;
}

/** Color preset */
export interface ColorPreset {
  name: string;
  value: string;
}

/** Export format */
export type ExportFormat = 'png' | 'svg' | 'json';
