// Canvas Editor TypeScript Types

/** All supported drawing tool identifiers */
export type ToolType =
  | 'select'
  | 'pen'
  | 'eraser'
  | 'fill'
  | 'text'
  | 'rectangle'
  | 'circle'
  | 'triangle'
  | 'line'
  | 'star'
  | 'cloud'
  | 'heart'
  | 'arrow'
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up'
  | 'arrow-down'
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

/** Color preset for the palette */
export interface ColorPreset {
  name: string;
  value: string;
}

/** Supported export formats */
export type ExportFormat = 'png' | 'svg' | 'json';
