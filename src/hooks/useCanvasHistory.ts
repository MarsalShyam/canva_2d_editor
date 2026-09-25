import { useState, useCallback, useRef } from 'react';
import type { Canvas as FabricCanvas } from 'fabric';
import { serializeCanvas, deserializeCanvas } from '../utils/canvasHelpers';
import { MAX_HISTORY_SIZE } from '../utils/constants';

/* It is a Custom hook for canvas undo/redo history management.*/
export function useCanvasHistory(canvas: FabricCanvas | null) {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const historyRef = useRef<string[]>([]);
  const currentIndexRef = useRef(-1);
  const isRestoringRef = useRef(false);

  /* Saveing the current canvas state to history.*/
  const saveState = useCallback(() => {
    if (!canvas || isRestoringRef.current) return;

    const json = serializeCanvas(canvas);
    const currentIndex = currentIndexRef.current;

    // Remove any future states (from redo) when new action happens
    historyRef.current = historyRef.current.slice(0, currentIndex + 1);

    // Adding new state
    historyRef.current.push(json);

    // Trim history if it exceeds max size
    if (historyRef.current.length > MAX_HISTORY_SIZE) {
      historyRef.current = historyRef.current.slice(
        historyRef.current.length - MAX_HISTORY_SIZE
      );
    }

    currentIndexRef.current = historyRef.current.length - 1;
    setCanUndo(currentIndexRef.current > 0);
    setCanRedo(false);
  }, [canvas]);

  /* Undo the last action.*/
  const undo = useCallback(async () => {
    if (!canvas || currentIndexRef.current <= 0) return;

    isRestoringRef.current = true;
    currentIndexRef.current -= 1;

    const json = historyRef.current[currentIndexRef.current];
    await deserializeCanvas(canvas, json);

    isRestoringRef.current = false;
    setCanUndo(currentIndexRef.current > 0);
    setCanRedo(currentIndexRef.current < historyRef.current.length - 1);
  }, [canvas]);

  /* Redoing the last undone action.*/
  const redo = useCallback(async () => {
    if (!canvas || currentIndexRef.current >= historyRef.current.length - 1) return;

    isRestoringRef.current = true;
    currentIndexRef.current += 1;

    const json = historyRef.current[currentIndexRef.current];
    await deserializeCanvas(canvas, json);

    isRestoringRef.current = false;
    setCanUndo(currentIndexRef.current > 0);
    setCanRedo(currentIndexRef.current < historyRef.current.length - 1);
  }, [canvas]);

  /* It clear history entirely (used on fresh load).*/
  const clearHistory = useCallback(() => {
    historyRef.current = [];
    currentIndexRef.current = -1;
    setCanUndo(false);
    setCanRedo(false);
  }, []);

  return {
    saveState,
    undo,
    redo,
    clearHistory,
    canUndo,
    canRedo,
    isRestoring: isRestoringRef.current,
  };
}
