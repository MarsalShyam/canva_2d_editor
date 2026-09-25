import { useEffect, useCallback, useRef } from 'react';
import type { Canvas as FabricCanvas } from 'fabric';
import type { ToolType } from '../types/canvas';

interface KeyboardShortcutsConfig {
  canvas: FabricCanvas | null;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onDelete: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onSelectAll: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  setActiveTool: (tool: ToolType) => void;
}

/* Custom hook for keyboard shortcut bindings in the MS Paint editor.*/
export function useKeyboardShortcuts(config: KeyboardShortcutsConfig) {
  const configRef = useRef(config);
  configRef.current = config;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const {
      canvas,
      onSave,
      onUndo,
      onRedo,
      onDelete,
      onCopy,
      onPaste,
      onSelectAll,
      onZoomIn,
      onZoomOut,
      onZoomReset,
      setActiveTool,
    } = configRef.current;

    // Don't trigger shortcuts when typing in inputs, textareas, or active text editing in Fabric
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return;
    }

    // Check if Fabric canvas currently has an active text object in editing mode
    if (canvas) {
      const activeObj = canvas.getActiveObject() as any;
      if (activeObj && activeObj.isEditing) {
        return;
      }
    }

    const isCtrl = e.ctrlKey || e.metaKey;

    // Ctrl+S → Save
    if (isCtrl && e.key.toLowerCase() === 's') {
      e.preventDefault();
      onSave();
      return;
    }

    // Ctrl+Z → Undo
    if (isCtrl && !e.shiftKey && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      onUndo();
      return;
    }

    // Ctrl+Shift+Z or Ctrl+Y → Redo
    if ((isCtrl && e.shiftKey && e.key.toLowerCase() === 'z') || (isCtrl && e.key.toLowerCase() === 'y')) {
      e.preventDefault();
      onRedo();
      return;
    }

    // Ctrl+C → Copy
    if (isCtrl && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      onCopy();
      return;
    }

    // Ctrl+V → Paste
    if (isCtrl && e.key.toLowerCase() === 'v') {
      e.preventDefault();
      onPaste();
      return;
    }

    // Ctrl+A → Select all
    if (isCtrl && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      onSelectAll();
      return;
    }

    // Ctrl++ → Zoom in
    if (isCtrl && (e.key === '=' || e.key === '+')) {
      e.preventDefault();
      onZoomIn();
      return;
    }

    // Ctrl+- → Zoom out
    if (isCtrl && e.key === '-') {
      e.preventDefault();
      onZoomOut();
      return;
    }

    // Ctrl+0 → Reset zoom
    if (isCtrl && e.key === '0') {
      e.preventDefault();
      onZoomReset();
      return;
    }

    // Delete / Backspace → Delete selected object
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (canvas && canvas.getActiveObjects().length > 0) {
        e.preventDefault();
        onDelete();
      }
      return;
    }

    // Single-key Tool shortcuts (when Ctrl is not held)
    if (!isCtrl) {
      switch (e.key.toLowerCase()) {
        case 'v':
          setActiveTool('select');
          break;
        case 'p':
          setActiveTool('pen');
          break;
        case 'f':
        case 'g':
          setActiveTool('fill');
          break;
        case 'e':
          setActiveTool('eraser');
          break;
        case 't':
          setActiveTool('text');
          break;
        case 'r':
          setActiveTool('rectangle');
          break;
        case 'c':
          setActiveTool('circle');
          break;
        case 'l':
          setActiveTool('line');
          break;
        case 's':
          setActiveTool('star');
          break;
        case 'h':
          setActiveTool('heart');
          break;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
