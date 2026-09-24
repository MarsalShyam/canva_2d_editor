import { useState, useEffect } from 'react';
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
  Copy,
  FlipHorizontal,
  FlipVertical,
  ArrowUpToLine,
  ArrowDownToLine,
  Lock,
  Unlock,
  RotateCcw,
} from 'lucide-react';
import type { Canvas as FabricCanvas, FabricObject } from 'fabric';
import { FONT_OPTIONS, STROKE_WIDTH_OPTIONS } from '../../utils/constants';

interface ContextualPropertyBarProps {
  canvas: FabricCanvas | null;
  selectedObject: FabricObject | null;
  onDelete: () => void;
  onDuplicate: () => void;
  onSaveState: () => void;
}

export function ContextualPropertyBar({
  canvas,
  selectedObject,
  onDelete,
  onDuplicate,
  onSaveState,
}: ContextualPropertyBarProps) {
  const [fill, setFill] = useState('#22C55E');
  const [stroke, setStroke] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [opacity, setOpacity] = useState(1);
  const [fontSize, setFontSize] = useState(28);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [textAlign, setTextAlign] = useState('left');
  const [isLocked, setIsLocked] = useState(false);

  const isText =
    selectedObject?.type === 'textbox' ||
    selectedObject?.type === 'i-text' ||
    selectedObject?.type === 'text';

  const isLineOrPath =
    selectedObject?.type === 'line' ||
    selectedObject?.type === 'path';

  // Sync state whenever selectedObject changes
  useEffect(() => {
    if (!selectedObject) return;
    const obj = selectedObject as any;

    setFill(obj.fill === 'transparent' || !obj.fill ? 'transparent' : obj.fill);
    setStroke(obj.stroke || '#000000');
    setStrokeWidth(obj.strokeWidth || 0);
    setOpacity(obj.opacity ?? 1);
    setIsLocked(!obj.selectable);

    if (isText) {
      setFontSize(obj.fontSize || 28);
      setFontFamily(obj.fontFamily || 'Arial');
      setIsBold(obj.fontWeight === 'bold' || obj.fontWeight === 700);
      setIsItalic(obj.fontStyle === 'italic');
      setTextAlign(obj.textAlign || 'left');
    }
  }, [selectedObject, isText]);

  if (!selectedObject || !canvas) return null;

  const updateProp = (key: string, value: any) => {
    if (!selectedObject || !canvas) return;
    (selectedObject as any).set(key, value);
    canvas.renderAll();
    onSaveState();
  };

  const handleFlip = (axis: 'x' | 'y') => {
    if (!selectedObject || !canvas) return;
    const key = axis === 'x' ? 'flipX' : 'flipY';
    (selectedObject as any).set(key, !(selectedObject as any)[key]);
    canvas.renderAll();
    onSaveState();
  };

  const handleBringToFront = () => {
    if (!selectedObject || !canvas) return;
    canvas.bringObjectToFront(selectedObject);
    canvas.renderAll();
    onSaveState();
  };

  const handleSendToBack = () => {
    if (!selectedObject || !canvas) return;
    canvas.sendObjectToBack(selectedObject);
    canvas.renderAll();
    onSaveState();
  };

  const handleToggleLock = () => {
    if (!selectedObject || !canvas) return;
    const locked = !isLocked;
    (selectedObject as any).set({
      selectable: !locked,
      evented: !locked,
      lockMovementX: locked,
      lockMovementY: locked,
      lockRotation: locked,
      lockScalingX: locked,
      lockScalingY: locked,
    });
    setIsLocked(locked);
    canvas.renderAll();
  };

  const handleResetAngle = () => {
    if (!selectedObject || !canvas) return;
    (selectedObject as any).set('angle', 0);
    canvas.renderAll();
    onSaveState();
  };

  return (
    <div className="h-10 bg-[#252526] border-b border-[#383838] px-4 flex items-center justify-between gap-3 text-xs text-gray-200 select-none overflow-x-auto shadow-inner">
      {/* Left: Selected object type tag & quick styling */}
      <div className="flex items-center gap-2.5 shrink-0">
        <span className="px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 font-semibold uppercase text-[10px] tracking-wider border border-blue-500/40">
          {selectedObject.type}
        </span>

        {/* Text specific controls */}
        {isText ? (
          <div className="flex items-center gap-2 border-r border-[#3e3e3e] pr-2.5">
            {/* Font Family */}
            <select
              value={fontFamily}
              onChange={(e) => {
                setFontFamily(e.target.value);
                updateProp('fontFamily', e.target.value);
              }}
              className="bg-[#1e1e1e] text-xs text-gray-200 border border-[#3e3e3e] rounded px-2 py-1 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f} value={f} style={{ fontFamily: f }}>
                  {f}
                </option>
              ))}
            </select>

            {/* Font Size */}
            <div className="flex items-center gap-1 bg-[#1e1e1e] border border-[#3e3e3e] rounded px-1.5 py-0.5">
              <button
                onClick={() => {
                  const s = Math.max(10, fontSize - 2);
                  setFontSize(s);
                  updateProp('fontSize', s);
                }}
                className="w-5 h-5 flex items-center justify-center hover:bg-[#333333] rounded text-gray-300"
              >
                -
              </button>
              <span className="w-6 text-center font-mono text-xs">{fontSize}</span>
              <button
                onClick={() => {
                  const s = Math.min(180, fontSize + 2);
                  setFontSize(s);
                  updateProp('fontSize', s);
                }}
                className="w-5 h-5 flex items-center justify-center hover:bg-[#333333] rounded text-gray-300"
              >
                +
              </button>
            </div>

            {/* Bold / Italic */}
            <div className="flex items-center gap-0.5 bg-[#1e1e1e] border border-[#3e3e3e] rounded p-0.5">
              <button
                onClick={() => {
                  const next = !isBold;
                  setIsBold(next);
                  updateProp('fontWeight', next ? 'bold' : 'normal');
                }}
                className={`p-1 rounded hover:bg-[#333333] transition-colors ${
                  isBold ? 'bg-blue-600/30 text-blue-400 font-bold' : 'text-gray-300'
                }`}
                title="Bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  const next = !isItalic;
                  setIsItalic(next);
                  updateProp('fontStyle', next ? 'italic' : 'normal');
                }}
                className={`p-1 rounded hover:bg-[#333333] transition-colors ${
                  isItalic ? 'bg-blue-600/30 text-blue-400' : 'text-gray-300'
                }`}
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-0.5 bg-[#1e1e1e] border border-[#3e3e3e] rounded p-0.5">
              {(['left', 'center', 'right'] as const).map((align) => {
                const Icon = align === 'left' ? AlignLeft : align === 'center' ? AlignCenter : AlignRight;
                return (
                  <button
                    key={align}
                    onClick={() => {
                      setTextAlign(align);
                      updateProp('textAlign', align);
                    }}
                    className={`p-1 rounded hover:bg-[#333333] transition-colors ${
                      textAlign === align ? 'bg-blue-600/30 text-blue-400' : 'text-gray-300'
                    }`}
                    title={`Align ${align}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </div>

            {/* Text Color input */}
            <div className="flex items-center gap-1.5">
              <label className="text-[11px] text-gray-400">Color:</label>
              <input
                type="color"
                value={fill === 'transparent' ? '#000000' : fill}
                onChange={(e) => {
                  setFill(e.target.value);
                  updateProp('fill', e.target.value);
                }}
                className="w-6 h-6 rounded cursor-pointer border border-[#3e3e3e] bg-transparent p-0"
                title="Text Color"
              />
            </div>
          </div>
        ) : (
          /* Non-text object properties (Fill, Stroke, Stroke width) */
          <div className="flex items-center gap-2 border-r border-[#3e3e3e] pr-2.5">
            {!isLineOrPath && (
              <div className="flex items-center gap-1.5">
                <label className="text-[11px] text-gray-400">Fill:</label>
                <input
                  type="color"
                  value={fill === 'transparent' ? '#ffffff' : fill}
                  onChange={(e) => {
                    setFill(e.target.value);
                    updateProp('fill', e.target.value);
                  }}
                  className="w-6 h-6 rounded cursor-pointer border border-[#3e3e3e] bg-transparent p-0"
                  title="Shape Fill Color"
                />
                <button
                  onClick={() => {
                    setFill('transparent');
                    updateProp('fill', 'transparent');
                  }}
                  className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${
                    fill === 'transparent'
                      ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                      : 'border-[#3e3e3e] text-gray-400 hover:bg-[#333333]'
                  }`}
                  title="No fill (transparent)"
                >
                  None
                </button>
              </div>
            )}

            {/* Stroke Color */}
            <div className="flex items-center gap-1.5">
              <label className="text-[11px] text-gray-400">Stroke:</label>
              <input
                type="color"
                value={stroke === 'transparent' ? '#000000' : stroke}
                onChange={(e) => {
                  setStroke(e.target.value);
                  updateProp('stroke', e.target.value);
                }}
                className="w-6 h-6 rounded cursor-pointer border border-[#3e3e3e] bg-transparent p-0"
                title="Stroke Color"
              />
            </div>

            {/* Stroke Width */}
            <div className="flex items-center gap-1.5">
              <label className="text-[11px] text-gray-400">Width:</label>
              <select
                value={strokeWidth}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setStrokeWidth(val);
                  updateProp('strokeWidth', val);
                }}
                className="bg-[#1e1e1e] text-xs text-gray-200 border border-[#3e3e3e] rounded px-1.5 py-0.5 focus:outline-none cursor-pointer"
              >
                {STROKE_WIDTH_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Opacity slider */}
        <div className="flex items-center gap-1.5 border-r border-[#3e3e3e] pr-2.5">
          <label className="text-[11px] text-gray-400">Opacity:</label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={opacity}
            onChange={(e) => {
              const val = Number(e.target.value);
              setOpacity(val);
              updateProp('opacity', val);
            }}
            className="w-16 h-1 bg-[#3a3a3a] rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <span className="w-8 text-right font-mono text-[10px] text-gray-300">
            {Math.round(opacity * 100)}%
          </span>
        </div>
      </div>

      {/* Right: Layering, Flip, Duplicate, Lock, Delete */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => handleFlip('x')}
          className="p-1.5 rounded hover:bg-[#333333] text-gray-300 hover:text-white transition-colors"
          title="Flip Horizontal"
        >
          <FlipHorizontal className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => handleFlip('y')}
          className="p-1.5 rounded hover:bg-[#333333] text-gray-300 hover:text-white transition-colors"
          title="Flip Vertical"
        >
          <FlipVertical className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-[#3e3e3e] mx-0.5" />

        <button
          onClick={handleBringToFront}
          className="p-1.5 rounded hover:bg-[#333333] text-gray-300 hover:text-white transition-colors"
          title="Bring to Front"
        >
          <ArrowUpToLine className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleSendToBack}
          className="p-1.5 rounded hover:bg-[#333333] text-gray-300 hover:text-white transition-colors"
          title="Send to Back"
        >
          <ArrowDownToLine className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleResetAngle}
          className="p-1.5 rounded hover:bg-[#333333] text-gray-300 hover:text-white transition-colors"
          title="Reset Rotation (0°)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-[#3e3e3e] mx-0.5" />

        <button
          onClick={handleToggleLock}
          className={`p-1.5 rounded hover:bg-[#333333] transition-colors ${
            isLocked ? 'text-amber-400 bg-amber-950/30' : 'text-gray-300 hover:text-white'
          }`}
          title={isLocked ? 'Unlock Object' : 'Lock Object'}
        >
          {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={onDuplicate}
          className="p-1.5 rounded hover:bg-[#333333] text-gray-300 hover:text-white transition-colors"
          title="Duplicate Object (Ctrl+D)"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onDelete}
          className="p-1.5 rounded hover:bg-rose-950/40 text-rose-400 transition-colors"
          title="Delete Object (Del)"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
