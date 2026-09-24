import { motion } from 'framer-motion';
import {
  MousePointer2,
  Square,
  Circle,
  Triangle,
  Minus,
  Type,
  Pen,
  Eraser,
} from 'lucide-react';
import type { ToolType } from '../../types/canvas';

interface ShapePanelProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
}

const tools: { type: ToolType; icon: React.ElementType; label: string; shortcut: string }[] = [
  { type: 'select', icon: MousePointer2, label: 'Select', shortcut: 'V' },
  { type: 'rectangle', icon: Square, label: 'Rectangle', shortcut: 'R' },
  { type: 'circle', icon: Circle, label: 'Circle', shortcut: 'C' },
  { type: 'triangle', icon: Triangle, label: 'Triangle', shortcut: 'T' },
  { type: 'line', icon: Minus, label: 'Line', shortcut: 'L' },
  { type: 'text', icon: Type, label: 'Text', shortcut: 'T' },
  { type: 'pen', icon: Pen, label: 'Pen', shortcut: 'P' },
  { type: 'eraser', icon: Eraser, label: 'Eraser', shortcut: 'E' },
];

export function ShapePanel({ activeTool, onToolChange }: ShapePanelProps) {
  return (
    <div className="w-16 md:w-[72px] bg-surface-dark/90 backdrop-blur-xl border-r border-border flex flex-col items-center py-4 gap-1 shrink-0 overflow-y-auto">
      {/* Logo mark */}
      <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
        <span className="text-white text-xs font-bold font-[family-name:var(--font-family-display)]">CF</span>
      </div>

      <div className="w-8 h-px bg-border mb-2" />

      {/* Tool buttons */}
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isActive = activeTool === tool.type;

        return (
          <div key={tool.type} className="tooltip-container relative" data-tooltip={`${tool.label} (${tool.shortcut})`}>
            <button
              id={`tool-${tool.type}`}
              onClick={() => onToolChange(tool.type)}
              className={`relative w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="tool-indicator"
                  className="absolute inset-0 rounded-xl bg-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="w-[18px] h-[18px] md:w-5 md:h-5 relative z-10" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
