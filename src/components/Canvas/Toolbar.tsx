import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Save,
  Download,
  Undo2,
  Redo2,
  Home,
  Grid3X3,
  Image,
  FileCode,
  FileJson,
  ChevronDown,
  Loader2,
  Check,
} from 'lucide-react';
import type { ExportFormat } from '../../types/canvas';

interface ToolbarProps {
  canvasTitle: string;
  onTitleChange: (title: string) => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onExport: (format: ExportFormat) => void;
  onToggleGrid: () => void;
  showGrid: boolean;
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
}

export function Toolbar({
  canvasTitle,
  onTitleChange,
  onSave,
  onUndo,
  onRedo,
  onExport,
  onToggleGrid,
  showGrid,
  canUndo,
  canRedo,
  isSaving,
  lastSaved,
}: ToolbarProps) {
  const navigate = useNavigate();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-14 bg-surface-dark/90 backdrop-blur-xl border-b border-border flex items-center justify-between px-3 md:px-5 gap-2 shrink-0"
    >
      {/* Left: Home + Title */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
        <button
          id="toolbar-home"
          onClick={() => navigate('/')}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all shrink-0"
          title="Home"
        >
          <Home className="w-[18px] h-[18px]" />
        </button>

        <div className="h-5 w-px bg-border hidden md:block" />

        {/* Editable title */}
        {isEditingTitle ? (
          <input
            type="text"
            value={canvasTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
            autoFocus
            className="bg-surface px-3 py-1.5 rounded-lg border border-primary/50 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 min-w-0 max-w-[200px]"
          />
        ) : (
          <button
            onClick={() => setIsEditingTitle(true)}
            className="text-sm font-medium text-text-primary hover:text-primary-light transition-colors truncate max-w-[120px] md:max-w-[200px]"
            title="Click to rename"
          >
            {canvasTitle}
          </button>
        )}
      </div>

      {/* Center: Undo/Redo */}
      <div className="flex items-center gap-1">
        <button
          id="toolbar-undo"
          onClick={onUndo}
          disabled={!canUndo}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-[18px] h-[18px]" />
        </button>
        <button
          id="toolbar-redo"
          onClick={onRedo}
          disabled={!canRedo}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-[18px] h-[18px]" />
        </button>

        <div className="h-5 w-px bg-border mx-1 hidden md:block" />

        {/* Grid toggle */}
        <button
          id="toolbar-grid"
          onClick={onToggleGrid}
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
            showGrid
              ? 'bg-primary/20 text-primary-light'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
          }`}
          title="Toggle Grid"
        >
          <Grid3X3 className="w-[18px] h-[18px]" />
        </button>
      </div>

      {/* Right: Save + Export */}
      <div className="flex items-center gap-1.5 md:gap-2 flex-1 justify-end">
        {/* Last saved indicator */}
        {lastSaved && (
          <span className="text-[10px] text-text-muted hidden md:flex items-center gap-1">
            <Check className="w-3 h-3 text-success" />
            Saved {formatTime(lastSaved)}
          </span>
        )}

        {/* Export dropdown */}
        <div className="relative">
          <button
            id="toolbar-export"
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-1.5 px-2.5 md:px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all text-xs font-medium"
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Export</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showExportMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowExportMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 z-50 w-44 bg-surface-dark border border-border-light rounded-xl shadow-2xl overflow-hidden">
                {[
                  { format: 'png' as ExportFormat, icon: Image, label: 'Export as PNG' },
                  { format: 'svg' as ExportFormat, icon: FileCode, label: 'Export as SVG' },
                  { format: 'json' as ExportFormat, icon: FileJson, label: 'Export as JSON' },
                ].map((item) => (
                  <button
                    key={item.format}
                    onClick={() => {
                      onExport(item.format);
                      setShowExportMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Save button */}
        <button
          id="toolbar-save"
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl text-xs md:text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span className="hidden md:inline">{isSaving ? 'Saving...' : 'Save'}</span>
        </button>
      </div>
    </motion.div>
  );
}
