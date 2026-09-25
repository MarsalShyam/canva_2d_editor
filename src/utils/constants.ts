import type { ColorPreset } from '../types/canvas';

/** Canvas dimensions (1200 × 700 px) */
export const CANVAS_WIDTH = 1200;
export const CANVAS_HEIGHT = 700;

/** Zoom limits and step increment */
export const MIN_ZOOM = 0.25;
export const MAX_ZOOM = 4;
export const ZOOM_STEP = 0.1;

/** Default canvas object styling */
export const DEFAULT_FILL = '#22C55E';
export const DEFAULT_STROKE = '#000000';
export const DEFAULT_STROKE_WIDTH = 2;

/** Maximum undo/redo history entries kept in memory */
export const MAX_HISTORY_SIZE = 50;

/** Stroke width options shown in the ribbon toolbar */
export const STROKE_WIDTH_OPTIONS = [
  { label: '1px', value: 1 },
  { label: '2px', value: 2 },
  { label: '4px', value: 4 },
  { label: '8px', value: 8 },
  { label: '12px', value: 12 },
  { label: '16px', value: 16 },
  { label: '24px', value: 24 },
];

/** MS Paint–style 2-row color palette — Row 1 (dark/primary colors) */
export const PAINT_PALETTE_ROW1: ColorPreset[] = [
  { name: 'Black', value: '#000000' },
  { name: 'Dark Gray', value: '#7F7F7F' },
  { name: 'Dark Red', value: '#880015' },
  { name: 'Red', value: '#ED1C24' },
  { name: 'Orange', value: '#FF7F27' },
  { name: 'Yellow', value: '#FFF200' },
  { name: 'Green', value: '#22B14C' },
  { name: 'Turquoise', value: '#00A2E8' },
  { name: 'Indigo', value: '#3F48CC' },
  { name: 'Purple', value: '#A349A4' },
];

/** MS Paint–style 2-row color palette — Row 2 (light/pastel colors) */
export const PAINT_PALETTE_ROW2: ColorPreset[] = [
  { name: 'White', value: '#FFFFFF' },
  { name: 'Light Gray', value: '#C3C3C3' },
  { name: 'Brown', value: '#B97A57' },
  { name: 'Rose', value: '#FFAEC9' },
  { name: 'Gold', value: '#FFC90E' },
  { name: 'Light Yellow', value: '#EFE4B0' },
  { name: 'Lime', value: '#B5E61D' },
  { name: 'Light Turquoise', value: '#99D9EA' },
  { name: 'Steel Blue', value: '#7092BE' },
  { name: 'Lavender', value: '#C8BFE7' },
];

/** Full 20-color palette used by the ColorPicker dropdown */
export const COLOR_PRESETS: ColorPreset[] = [
  ...PAINT_PALETTE_ROW1,
  ...PAINT_PALETTE_ROW2,
];

/** Font family options for the text properties panel */
export const FONT_OPTIONS = [
  'Arial',
  'Segoe UI',
  'Calibri',
  'Comic Sans MS',
  'Impact',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Trebuchet MS',
  'Verdana',
  'Inter',
];
