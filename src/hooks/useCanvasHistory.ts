import { useState, useCallback, useRef } from 'react';
import type { Canvas as FabricCanvas } from 'fabric';
import { serializeCanvas, deserializeCanvas } from '../utils/canvasHelpers';
import { MAX_HISTORY_SIZE } from '../utils/constants';

/* Manages an in-memory undo/redo history stack for a Fabric.js canvas. */
export function useCanvasHistory(canvas: FabricCanvas | null) {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const canvasRef = useRef<FabricCanvas | null>(canvas);
  canvasRef.current = canvas;

  const historyRef = useRef<string[]>([]);
  const currentIndexRef = useRef(-1);
  const isRestoringRef = useRef(false);

  /* Snapshot the current canvas state and push it onto the history stack. */
  const saveState = useCallback(() => {
    const c = canvasRef.current || canvas;
    if (!c || isRestoringRef.current) return;

    const json = serializeCanvas(c);
    const currentIndex = currentIndexRef.current;

    // Avoid duplicate history entries if canvas state hasn't changed
    if (currentIndex >= 0 && historyRef.current[currentIndex] === json) {
      return;
    }

    // Discard any redo states that existed ahead of the current position
    historyRef.current = historyRef.current.slice(0, currentIndex + 1);
    historyRef.current.push(json);

    // Keep the stack bounded to MAX_HISTORY_SIZE
    if (historyRef.current.length > MAX_HISTORY_SIZE) {
      historyRef.current = historyRef.current.slice(
        historyRef.current.length - MAX_HISTORY_SIZE
      );
    }

    currentIndexRef.current = historyRef.current.length - 1;
    setCanUndo(currentIndexRef.current > 0);
    setCanRedo(false);
  }, [canvas]);

  /* Restore the previous canvas state. */
  const undo = useCallback(async () => {
    const c = canvasRef.current || canvas;
    if (!c || currentIndexRef.current <= 0 || isRestoringRef.current) return;

    isRestoringRef.current = true;
    try {
      currentIndexRef.current -= 1;
      c.discardActiveObject();
      await deserializeCanvas(c, historyRef.current[currentIndexRef.current]);
    } finally {
      isRestoringRef.current = false;
      setCanUndo(currentIndexRef.current > 0);
      setCanRedo(currentIndexRef.current < historyRef.current.length - 1);
    }
  }, [canvas]);

  /* Re-apply the last undone state. */
  const redo = useCallback(async () => {
    const c = canvasRef.current || canvas;
    if (
      !c ||
      currentIndexRef.current >= historyRef.current.length - 1 ||
      isRestoringRef.current
    ) {
      return;
    }

    isRestoringRef.current = true;
    try {
      currentIndexRef.current += 1;
      c.discardActiveObject();
      await deserializeCanvas(c, historyRef.current[currentIndexRef.current]);
    } finally {
      isRestoringRef.current = false;
      setCanUndo(currentIndexRef.current > 0);
      setCanRedo(currentIndexRef.current < historyRef.current.length - 1);
    }
  }, [canvas]);

  /* Wipe the entire history stack — called on fresh canvas load. */
  const clearHistory = useCallback(() => {
    historyRef.current = [];
    currentIndexRef.current = -1;
    setCanUndo(false);
    setCanRedo(false);
  }, []);

  return { saveState, undo, redo, clearHistory, canUndo, canRedo };
}
