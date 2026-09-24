import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Save,
  Undo2,
  Redo2,
  MousePointer2,
  Pencil,
  Type,
  Eraser,
  PaintBucket,
  ImagePlus,
  Square,
  Circle,
  Triangle,
  Minus,
  Star,
  Heart,
  Cloud,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Diamond,
  Trash2,
  Download,
  Grid3X3,
  Home,
  Check,
  Loader2,
  FilePlus,
  ChevronDown,
  Palette,
} from 'lucide-react';
import type { ToolType, ExportFormat } from '../../types/canvas';
import {
  STROKE_WIDTH_OPTIONS,
  PAINT_PALETTE_ROW1,
  PAINT_PALETTE_ROW2,
} from '../../utils/constants';

interface RibbonToolbarProps {
  canvasTitle: string;
  onTitleChange: (title: string) => void;
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  // Colors & stroke
  color1: string; // Stroke / Pen / Text
  color2: string; // Fill
  activeColorSlot: 'color1' | 'color2';
  onSelectColorSlot: (slot: 'color1' | 'color2') => void;
  onColorChange: (color: string) => void;
  strokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
  fillEnabled: boolean;
  onToggleFill: (enabled: boolean) => void;
  // History
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  // Save & Status
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  lastSaved: Date | null;
  onSave: () => void;
  // Canvas Actions
  onClearCanvas: () => void;
  onDeleteSelected: () => void;
  onExport: (format: ExportFormat) => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  onAddImage: (file: File) => void;
}

export function RibbonToolbar({
  canvasTitle,
  onTitleChange,
  activeTool,
  onToolChange,
  color1,
  color2,
  activeColorSlot,
  onSelectColorSlot,
  onColorChange,
  strokeWidth,
  onStrokeWidthChange,
  fillEnabled,
  onToggleFill,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  isSaving,
  hasUnsavedChanges,
  lastSaved,
  onSave,
  onClearCanvas,
  onDeleteSelected,
  onExport,
  showGrid,
  onToggleGrid,
  onAddImage,
}: RibbonToolbarProps) {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<'file' | 'edit' | 'view' | 'export' | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const customColorInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAddImage(file);
      e.target.value = '';
    }
  };

  // Close menus on click outside
  useEffect(() => {
    const handleWindowClick = () => setActiveMenu(null);
    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, []);

  const shapeTools: { type: ToolType; icon: React.ElementType; label: string }[] = [
    { type: 'line', icon: Minus, label: 'Line (L)' },
    { type: 'rectangle', icon: Square, label: 'Rectangle (R)' },
    { type: 'circle', icon: Circle, label: 'Circle (C)' },
    { type: 'triangle', icon: Triangle, label: 'Triangle' },
    { type: 'star', icon: Star, label: 'Star' },
    { type: 'heart', icon: Heart, label: 'Heart' },
    { type: 'cloud', icon: Cloud, label: 'Cloud' },
    { type: 'diamond', icon: Diamond, label: 'Diamond' },
    { type: 'arrow-right', icon: ArrowRight, label: 'Arrow Right' },
    { type: 'arrow-left', icon: ArrowLeft, label: 'Arrow Left' },
    { type: 'arrow-up', icon: ArrowUp, label: 'Arrow Up' },
    { type: 'arrow-down', icon: ArrowDown, label: 'Arrow Down' },
  ];

  return (
    <div className="bg-[#202020] text-[#e0e0e0] border-b border-[#2d2d2d] select-none shrink-0 font-sans shadow-md">
      {/* 1. Windows 11 Title Bar */}
      <div className="h-9 px-3 flex items-center justify-between border-b border-[#2b2b2b] bg-[#181818] text-xs text-gray-300">
        {/* Left: Quick Access Toolbar + Editable Title */}
        <div className="flex items-center gap-2 min-w-0" onClick={(e) => e.stopPropagation()}>
          <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
            🎨
          </div>

          {/* Quick Access Icons */}
          <div className="flex items-center gap-0.5 ml-1 border-r border-[#333333] pr-2">
            <button
              onClick={onSave}
              disabled={isSaving}
              className="p-1 rounded hover:bg-[#2e2e2e] text-gray-300 hover:text-white disabled:opacity-40 transition-colors"
              title="Save (Ctrl+S)"
            >
              <Save className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="p-1 rounded hover:bg-[#2e2e2e] text-gray-300 hover:text-white disabled:opacity-40 transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-1 rounded hover:bg-[#2e2e2e] text-gray-300 hover:text-white disabled:opacity-40 transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Canvas Title (Editable) */}
          {isEditingTitle ? (
            <input
              type="text"
              value={canvasTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
              autoFocus
              className="bg-[#2a2a2a] text-white px-2 py-0.5 rounded border border-blue-500 text-xs focus:outline-none max-w-[200px]"
            />
          ) : (
            <span
              onClick={() => setIsEditingTitle(true)}
              className="font-medium text-gray-200 hover:text-blue-400 cursor-pointer truncate max-w-[220px]"
              title="Click to rename canvas"
            >
              {canvasTitle} - Paint
            </span>
          )}

          {/* Unsaved / Saved Status */}
          <div className="ml-3 flex items-center gap-1.5 text-[11px]">
            {isSaving ? (
              <span className="text-amber-400 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                Saving...
              </span>
            ) : hasUnsavedChanges ? (
              <span className="text-amber-400 flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Unsaved changes
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Saved ✓ {lastSaved ? lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
              </span>

            )}
          </div>
        </div>

        {/* Right: Home & Export links */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded hover:bg-[#2e2e2e] text-gray-300 hover:text-white transition-colors text-xs"
            title="Return to Home"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </button>
        </div>
      </div>

      {/* 2. Menu Bar (File / Edit / View / Export) */}
      <div className="h-7 px-3 flex items-center gap-1 bg-[#202020] text-xs border-b border-[#2b2b2b] relative">
        {/* File Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === 'file' ? null : 'file');
            }}
            className={`px-2.5 py-1 rounded hover:bg-[#2c2c2c] transition-colors ${
              activeMenu === 'file' ? 'bg-[#2c2c2c] text-white font-medium' : 'text-gray-300'
            }`}
          >
            File
          </button>

          {activeMenu === 'file' && (
            <div
              className="absolute left-0 top-full mt-1 z-50 w-52 bg-[#252526] border border-[#3c3c3c] rounded-lg shadow-2xl py-1 text-xs text-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setActiveMenu(null);
                  navigate('/');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#37373d] transition-colors"
              >
                <FilePlus className="w-4 h-4 text-blue-400" />
                New Canvas (Home)
              </button>
              <button
                onClick={() => {
                  setActiveMenu(null);
                  onSave();
                }}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#37373d] transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Save className="w-4 h-4 text-emerald-400" />
                  Save
                </span>
                <span className="text-gray-400 text-[10px]">Ctrl+S</span>
              </button>
              <div className="h-px bg-[#333333] my-1" />
              <button
                onClick={() => {
                  setActiveMenu(null);
                  onClearCanvas();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-400 hover:bg-[#37373d] transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear Canvas...
              </button>
            </div>
          )}
        </div>

        {/* Edit Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === 'edit' ? null : 'edit');
            }}
            className={`px-2.5 py-1 rounded hover:bg-[#2c2c2c] transition-colors ${
              activeMenu === 'edit' ? 'bg-[#2c2c2c] text-white font-medium' : 'text-gray-300'
            }`}
          >
            Edit
          </button>

          {activeMenu === 'edit' && (
            <div
              className="absolute left-0 top-full mt-1 z-50 w-52 bg-[#252526] border border-[#3c3c3c] rounded-lg shadow-2xl py-1 text-xs text-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                disabled={!canUndo}
                onClick={() => {
                  setActiveMenu(null);
                  onUndo();
                }}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#37373d] disabled:opacity-40 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Undo2 className="w-4 h-4" />
                  Undo
                </span>
                <span className="text-gray-400 text-[10px]">Ctrl+Z</span>
              </button>
              <button
                disabled={!canRedo}
                onClick={() => {
                  setActiveMenu(null);
                  onRedo();
                }}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#37373d] disabled:opacity-40 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Redo2 className="w-4 h-4" />
                  Redo
                </span>
                <span className="text-gray-400 text-[10px]">Ctrl+Y</span>
              </button>
              <div className="h-px bg-[#333333] my-1" />
              <button
                onClick={() => {
                  setActiveMenu(null);
                  onDeleteSelected();
                }}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#37373d] text-rose-300 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  Delete Selected
                </span>
                <span className="text-gray-400 text-[10px]">Del</span>
              </button>
            </div>
          )}
        </div>

        {/* View Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === 'view' ? null : 'view');
            }}
            className={`px-2.5 py-1 rounded hover:bg-[#2c2c2c] transition-colors ${
              activeMenu === 'view' ? 'bg-[#2c2c2c] text-white font-medium' : 'text-gray-300'
            }`}
          >
            View
          </button>

          {activeMenu === 'view' && (
            <div
              className="absolute left-0 top-full mt-1 z-50 w-48 bg-[#252526] border border-[#3c3c3c] rounded-lg shadow-2xl py-1 text-xs text-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setActiveMenu(null);
                  onToggleGrid();
                }}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#37373d] transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Grid3X3 className="w-4 h-4 text-blue-400" />
                  Grid Lines
                </span>
                {showGrid && <Check className="w-3.5 h-3.5 text-blue-400" />}
              </button>
            </div>
          )}
        </div>

        {/* Export Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === 'export' ? null : 'export');
            }}
            className={`px-2.5 py-1 rounded hover:bg-[#2c2c2c] transition-colors flex items-center gap-1 ${
              activeMenu === 'export' ? 'bg-[#2c2c2c] text-white font-medium' : 'text-gray-300'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Export
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {activeMenu === 'export' && (
            <div
              className="absolute left-0 top-full mt-1 z-50 w-48 bg-[#252526] border border-[#3c3c3c] rounded-lg shadow-2xl py-1 text-xs text-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setActiveMenu(null);
                  onExport('png');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#37373d] transition-colors"
              >
                PNG Image (.png)
              </button>
              <button
                onClick={() => {
                  setActiveMenu(null);
                  onExport('svg');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#37373d] transition-colors"
              >
                SVG Vector (.svg)
              </button>
              <button
                onClick={() => {
                  setActiveMenu(null);
                  onExport('json');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#37373d] transition-colors"
              >
                Fabric JSON (.json)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Main MS Paint Ribbon Tool Groups */}
      <div className="px-4 py-2 flex items-center gap-4 overflow-x-auto min-h-[96px]">
        {/* Section A: Selection & Clipboard */}
        <div className="flex flex-col items-center border-r border-[#333333] pr-3 shrink-0">
          <div className="flex items-center gap-1.5 mb-1.5">
            <button
              onClick={() => onToolChange('select')}
              className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center gap-0.5 border transition-all ${
                activeTool === 'select'
                  ? 'bg-blue-600/30 border-blue-500 text-white shadow-inner'
                  : 'bg-[#292929] border-[#383838] text-gray-300 hover:bg-[#333333] hover:text-white'
              }`}
              title="Select / Move Object (V)"
            >
              <MousePointer2 className="w-5 h-5" />
            </button>
            <button
              onClick={onDeleteSelected}
              className="w-10 h-10 rounded-lg flex flex-col items-center justify-center gap-0.5 border bg-[#292929] border-[#383838] text-rose-300 hover:bg-rose-950/40 hover:border-rose-500 transition-all"
              title="Delete Selected Object (Del)"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <span className="text-[10px] text-gray-400 font-medium tracking-wide">Selection</span>
        </div>

        {/* Section B: Tools (Pencil, Fill Bucket, Text, Eraser, Add Image) */}
        <div className="flex flex-col items-center border-r border-[#333333] pr-3 shrink-0">
          <input
            type="file"
            ref={imageInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleImageFileChange}
          />
          <div className="grid grid-cols-5 gap-1 mb-1.5">
            {/* Pencil / Freehand Pen */}
            <button
              onClick={() => onToolChange('pen')}
              className={`w-8 h-8 rounded-md flex items-center justify-center border transition-all ${
                activeTool === 'pen'
                  ? 'bg-blue-600/30 border-blue-500 text-white shadow-sm'
                  : 'bg-[#292929] border-[#383838] text-gray-300 hover:bg-[#333333] hover:text-white'
              }`}
              title="Pencil / Freehand Drawing (P)"
            >
              <Pencil className="w-4 h-4" />
            </button>

            {/* Fill Tool (Paint Bucket) */}
            <button
              onClick={() => onToolChange('fill')}
              className={`w-8 h-8 rounded-md flex items-center justify-center border transition-all ${
                activeTool === 'fill'
                  ? 'bg-blue-600/30 border-blue-500 text-white shadow-sm'
                  : 'bg-[#292929] border-[#383838] text-gray-300 hover:bg-[#333333] hover:text-white'
              }`}
              title="Fill Enclosed Area / Paint Bucket (F)"
            >
              <PaintBucket className="w-4 h-4" />
            </button>

            {/* Text Tool */}
            <button
              onClick={() => onToolChange('text')}
              className={`w-8 h-8 rounded-md flex items-center justify-center border transition-all ${
                activeTool === 'text'
                  ? 'bg-blue-600/30 border-blue-500 text-white shadow-sm'
                  : 'bg-[#292929] border-[#383838] text-gray-300 hover:bg-[#333333] hover:text-white'
              }`}
              title="Text (A / T)"
            >
              <Type className="w-4 h-4 font-bold" />
            </button>

            {/* Eraser Tool */}
            <button
              onClick={() => onToolChange('eraser')}
              className={`w-8 h-8 rounded-md flex items-center justify-center border transition-all ${
                activeTool === 'eraser'
                  ? 'bg-blue-600/30 border-blue-500 text-white shadow-sm'
                  : 'bg-[#292929] border-[#383838] text-gray-300 hover:bg-[#333333] hover:text-white'
              }`}
              title="Eraser (E)"
            >
              <Eraser className="w-4 h-4" />
            </button>

            {/* Insert Image Button */}
            <button
              onClick={() => imageInputRef.current?.click()}
              className="w-8 h-8 rounded-md flex items-center justify-center border border-[#383838] bg-[#292929] text-gray-300 hover:bg-indigo-600/30 hover:border-indigo-500 hover:text-white transition-all"
              title="Insert Image from Computer"
            >
              <ImagePlus className="w-4 h-4" />
            </button>
          </div>
          <span className="text-[10px] text-gray-400 font-medium tracking-wide">Tools</span>
        </div>

        {/* Section C: Shapes Grid (12 Shapes) */}
        <div className="flex flex-col items-center border-r border-[#333333] pr-3 shrink-0">
          <div className="grid grid-cols-6 gap-1 p-1 bg-[#1a1a1a] rounded-lg border border-[#333333] mb-1.5">
            {shapeTools.map((shape) => {
              const Icon = shape.icon;
              const isSelected = activeTool === shape.type;
              return (
                <button
                  key={shape.type}
                  onClick={() => onToolChange(shape.type)}
                  className={`w-7 h-7 rounded flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md ring-1 ring-blue-400'
                      : 'text-gray-300 hover:bg-[#2e2e2e] hover:text-white'
                  }`}
                  title={shape.label}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>
          <span className="text-[10px] text-gray-400 font-medium tracking-wide">Shapes</span>
        </div>

        {/* Section D: Size / Stroke Width & Fill Toggle */}
        <div className="flex flex-col items-center border-r border-[#333333] pr-3 shrink-0">
          <div className="flex items-center gap-2 mb-1.5">
            {/* Stroke Width Selector */}
            <div className="flex flex-col gap-1">
              <select
                value={strokeWidth}
                onChange={(e) => onStrokeWidthChange(Number(e.target.value))}
                className="bg-[#2a2a2a] text-xs text-gray-200 border border-[#3e3e3e] rounded px-2 py-1 focus:outline-none focus:border-blue-500 cursor-pointer"
                title="Line / Outline Thickness"
              >
                {STROKE_WIDTH_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    Size: {opt.label}
                  </option>
                ))}
              </select>

              {/* Fill enabled toggle */}
              <label className="flex items-center gap-1.5 text-[11px] text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fillEnabled}
                  onChange={(e) => onToggleFill(e.target.checked)}
                  className="rounded bg-[#2a2a2a] border-[#3e3e3e] text-blue-600 focus:ring-0 w-3.5 h-3.5"
                />
                <span>Fill Shapes</span>
              </label>
            </div>
          </div>
          <span className="text-[10px] text-gray-400 font-medium tracking-wide">Size & Fill</span>
        </div>

        {/* Section E: Color 1 & Color 2 Slots (Standard MS Paint Layout) */}
        <div className="flex flex-col items-center border-r border-[#333333] pr-3 shrink-0">
          <div className="flex items-center gap-2 mb-1.5">
            {/* Color 1 (Primary / Stroke / Text / Pen) */}
            <div
              onClick={() => onSelectColorSlot('color1')}
              className={`flex flex-col items-center p-1 rounded-lg cursor-pointer border transition-all ${
                activeColorSlot === 'color1'
                  ? 'bg-blue-600/20 border-blue-500 shadow-sm'
                  : 'border-transparent hover:bg-[#2a2a2a]'
              }`}
              title="Color 1 (Foreground / Stroke / Pen / Text Color)"
            >
              <div
                className="w-7 h-7 rounded-md border-2 border-white/50 shadow-inner"
                style={{ backgroundColor: color1 }}
              />
              <span className="text-[9px] text-gray-300 mt-0.5 font-medium">Color 1</span>
            </div>

            {/* Color 2 (Secondary / Fill Color) */}
            <div
              onClick={() => onSelectColorSlot('color2')}
              className={`flex flex-col items-center p-1 rounded-lg cursor-pointer border transition-all ${
                activeColorSlot === 'color2'
                  ? 'bg-blue-600/20 border-blue-500 shadow-sm'
                  : 'border-transparent hover:bg-[#2a2a2a]'
              }`}
              title="Color 2 (Background / Shape Fill Color)"
            >
              <div
                className="w-7 h-7 rounded-md border-2 border-white/50 shadow-inner"
                style={{ backgroundColor: color2 === 'transparent' ? '#ffffff' : color2 }}
              />
              <span className="text-[9px] text-gray-300 mt-0.5 font-medium">Color 2</span>
            </div>
          </div>
          <span className="text-[10px] text-gray-400 font-medium tracking-wide">Active Colors</span>
        </div>

        {/* Section F: MS Paint 2-Row Color Palette */}
        <div className="flex flex-col items-center border-r border-[#333333] pr-3 shrink-0">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex flex-col gap-1">
              {/* Palette Row 1 */}
              <div className="flex items-center gap-1">
                {PAINT_PALETTE_ROW1.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => onColorChange(c.value)}
                    className="w-4 h-4 rounded-full border border-[#111111] hover:scale-125 transition-transform shadow-sm"
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
              {/* Palette Row 2 */}
              <div className="flex items-center gap-1">
                {PAINT_PALETTE_ROW2.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => onColorChange(c.value)}
                    className="w-4 h-4 rounded-full border border-[#111111] hover:scale-125 transition-transform shadow-sm"
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Custom Color Wheel Button */}
            <div className="relative">
              <button
                onClick={() => customColorInputRef.current?.click()}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 via-yellow-400 to-cyan-400 border border-white/40 flex items-center justify-center hover:scale-110 shadow-sm transition-transform"
                title="Edit / Custom Color"
              >
                <Palette className="w-3.5 h-3.5 text-black drop-shadow" />
              </button>
              <input
                ref={customColorInputRef}
                type="color"
                value={activeColorSlot === 'color1' ? color1 : color2}
                onChange={(e) => onColorChange(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer pointer-events-none"
              />
            </div>
          </div>
          <span className="text-[10px] text-gray-400 font-medium tracking-wide">Colours</span>
        </div>

        {/* Section G: Prominent Save & Clear Actions */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <button
            onClick={onClearCanvas}
            className="px-3 py-2 rounded-lg bg-[#2b2b2b] hover:bg-rose-950/50 text-rose-300 border border-[#3e3e3e] hover:border-rose-500 text-xs font-medium transition-all"
            title="Clear the entire canvas (confirmation dialog)"
          >
            Clear Canvas
          </button>

          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs shadow-md disabled:opacity-50 transition-all"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {isSaving ? 'Saving...' : 'Save Canvas'}
          </button>
        </div>
      </div>
    </div>
  );
}
