import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
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
import { ColorPicker } from '../shared/ColorPicker';
import { FONT_OPTIONS } from '../../utils/constants';

interface PropertiesPanelProps {
  canvas: FabricCanvas | null;
  selectedObject: FabricObject | null;
  onDelete: () => void;
  onCopy: () => void;
  onSaveState: () => void;
}

export function PropertiesPanel({
  canvas,
  selectedObject,
  onDelete,
  onCopy,
  onSaveState,
}: PropertiesPanelProps) {
  const [fill, setFill] = useState('#6C5CE7');
  const [stroke, setStroke] = useState('#FFFFFF');
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [angle, setAngle] = useState(0);
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState('Inter');
  const [isLocked, setIsLocked] = useState(false);

  const isText = selectedObject?.type === 'textbox' || selectedObject?.type === 'i-text' || selectedObject?.type === 'text';

  // Sync properties from selected object
  const syncProps = useCallback(() => {
    if (!selectedObject) return;

    const obj = selectedObject as any;
    setFill((obj.fill as string) || 'transparent');
    setStroke((obj.stroke as string) || 'transparent');
    setStrokeWidth(obj.strokeWidth || 0);
    setOpacity(obj.opacity ?? 1);
    setAngle(Math.round(obj.angle || 0));
    setIsLocked(!obj.selectable);

    if (isText) {
      setFontSize(obj.fontSize || 24);
      setFontFamily(obj.fontFamily || 'Inter');
    }
  }, [selectedObject, isText]);

  useEffect(() => {
    syncProps();
  }, [syncProps]);

  // Sync when object is modified (moved, resized, rotated)
  useEffect(() => {
    if (!canvas || !selectedObject) return;

    const handleModified = () => syncProps();
    canvas.on('object:modified', handleModified);
    return () => {
      canvas.off('object:modified', handleModified);
    };
  }, [canvas, selectedObject, syncProps]);

  const updateProperty = (prop: string, value: any) => {
    if (!selectedObject || !canvas) return;
    (selectedObject as any).set(prop, value);
    canvas.renderAll();
    onSaveState();
  };

  const handleFlip = (axis: 'x' | 'y') => {
    if (!selectedObject || !canvas) return;
    if (axis === 'x') {
      (selectedObject as any).set('flipX', !(selectedObject as any).flipX);
    } else {
      (selectedObject as any).set('flipY', !(selectedObject as any).flipY);
    }
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

  const handleResetRotation = () => {
    if (!selectedObject || !canvas) return;
    (selectedObject as any).set('angle', 0);
    setAngle(0);
    canvas.renderAll();
    onSaveState();
  };

  return (
    <AnimatePresence mode="wait">
      {selectedObject ? (
        <motion.div
          key="properties"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-60 md:w-64 bg-surface-dark/90 backdrop-blur-xl border-l border-border overflow-y-auto shrink-0"
        >
          <div className="p-4 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                Properties
              </h3>
              <span className="text-[10px] font-medium text-text-muted px-2 py-0.5 bg-surface rounded-full capitalize">
                {selectedObject.type}
              </span>
            </div>

            {/* Quick Actions */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2">
                Actions
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { icon: Copy, action: onCopy, label: 'Duplicate' },
                  { icon: Trash2, action: onDelete, label: 'Delete', danger: true },
                  { icon: FlipHorizontal, action: () => handleFlip('x'), label: 'Flip H' },
                  { icon: FlipVertical, action: () => handleFlip('y'), label: 'Flip V' },
                  { icon: ArrowUpToLine, action: handleBringToFront, label: 'To Front' },
                  { icon: ArrowDownToLine, action: handleSendToBack, label: 'To Back' },
                  {
                    icon: isLocked ? Lock : Unlock,
                    action: handleToggleLock,
                    label: isLocked ? 'Unlock' : 'Lock',
                    active: isLocked,
                  },
                  { icon: RotateCcw, action: handleResetRotation, label: 'Reset Rotation' },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={item.action}
                    className={`w-full aspect-square rounded-lg flex items-center justify-center transition-all ${
                      (item as any).danger
                        ? 'text-danger/70 hover:bg-danger/10 hover:text-danger'
                        : (item as any).active
                        ? 'bg-primary/20 text-primary-light'
                        : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                    }`}
                    title={item.label}
                  >
                    <item.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-3">
              <ColorPicker
                label="Fill Color"
                value={fill}
                onChange={(color) => {
                  setFill(color);
                  updateProperty('fill', color);
                }}
              />
              <ColorPicker
                label="Stroke Color"
                value={stroke}
                onChange={(color) => {
                  setStroke(color);
                  updateProperty('stroke', color);
                }}
              />
            </div>

            {/* Stroke Width */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Stroke Width
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={strokeWidth}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setStrokeWidth(val);
                    updateProperty('strokeWidth', val);
                  }}
                  className="flex-1 h-1.5 bg-surface rounded-full appearance-none cursor-pointer accent-primary"
                />
                <span className="text-xs text-text-secondary w-6 text-right font-mono">{strokeWidth}</span>
              </div>
            </div>

            {/* Opacity */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Opacity
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setOpacity(val);
                    updateProperty('opacity', val);
                  }}
                  className="flex-1 h-1.5 bg-surface rounded-full appearance-none cursor-pointer accent-primary"
                />
                <span className="text-xs text-text-secondary w-10 text-right font-mono">
                  {Math.round(opacity * 100)}%
                </span>
              </div>
            </div>

            {/* Rotation */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Rotation
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  value={angle}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setAngle(val);
                    updateProperty('angle', val);
                  }}
                  className="flex-1 h-1.5 bg-surface rounded-full appearance-none cursor-pointer accent-primary"
                />
                <span className="text-xs text-text-secondary w-8 text-right font-mono">{angle}°</span>
              </div>
            </div>

            {/* Text properties */}
            {isText && (
              <div className="space-y-3 pt-2 border-t border-border">
                <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Text
                </h4>

                {/* Font family */}
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Font Family
                  </label>
                  <select
                    value={fontFamily}
                    onChange={(e) => {
                      setFontFamily(e.target.value);
                      updateProperty('fontFamily', e.target.value);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-xs text-text-primary focus:outline-none focus:border-primary cursor-pointer"
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font} value={font} style={{ fontFamily: font }}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Font size */}
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Font Size
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const val = Math.max(8, fontSize - 2);
                        setFontSize(val);
                        updateProperty('fontSize', val);
                      }}
                      className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all text-sm font-bold"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={fontSize}
                      onChange={(e) => {
                        const val = Math.max(8, Number(e.target.value));
                        setFontSize(val);
                        updateProperty('fontSize', val);
                      }}
                      className="flex-1 px-2 py-1.5 text-center text-xs font-mono bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                      min="8"
                      max="200"
                    />
                    <button
                      onClick={() => {
                        const val = Math.min(200, fontSize + 2);
                        setFontSize(val);
                        updateProperty('fontSize', val);
                      }}
                      className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all text-sm font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Text alignment */}
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Alignment
                  </label>
                  <div className="flex gap-1">
                    {['left', 'center', 'right'].map((align) => (
                      <button
                        key={align}
                        onClick={() => updateProperty('textAlign', align)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                          (selectedObject as any)?.textAlign === align
                            ? 'bg-primary/20 text-primary-light'
                            : 'bg-surface text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                        }`}
                      >
                        {align}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font weight */}
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Weight
                  </label>
                  <div className="flex gap-1">
                    {[
                      { label: 'Light', value: 300 },
                      { label: 'Normal', value: 400 },
                      { label: 'Bold', value: 700 },
                    ].map((w) => (
                      <button
                        key={w.value}
                        onClick={() => updateProperty('fontWeight', w.value)}
                        className={`flex-1 py-1.5 rounded-lg text-xs transition-all ${
                          (selectedObject as any)?.fontWeight === w.value
                            ? 'bg-primary/20 text-primary-light font-semibold'
                            : 'bg-surface text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                        }`}
                        style={{ fontWeight: w.value }}
                      >
                        {w.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-60 md:w-64 bg-surface-dark/90 backdrop-blur-xl border-l border-border flex flex-col items-center justify-center shrink-0"
        >
          <div className="text-center px-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-surface flex items-center justify-center">
              <MousePointer2Icon className="w-5 h-5 text-text-muted" />
            </div>
            <p className="text-sm text-text-secondary font-medium">No Selection</p>
            <p className="text-xs text-text-muted mt-1">
              Click an object to edit its properties
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MousePointer2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z" />
    </svg>
  );
}
