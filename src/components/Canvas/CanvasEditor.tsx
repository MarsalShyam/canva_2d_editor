import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ActiveSelection } from 'fabric';
import type { Canvas as FabricCanvas, FabricObject } from 'fabric';
import { Loader2, AlertCircle, Home } from 'lucide-react';

import { RibbonToolbar } from './RibbonToolbar';
import { ContextualPropertyBar } from './ContextualPropertyBar';
import { CanvasArea } from './CanvasArea';
import { StatusBar } from './StatusBar';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { showToast } from '../shared/Toast';

import { useFirestore } from '../../hooks/useFirestore';
import { useCanvasHistory } from '../../hooks/useCanvasHistory';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

import {
  serializeCanvas,
  deserializeCanvas,
  exportAsPNG,
  exportAsSVG,
  downloadFile,
} from '../../utils/canvasHelpers';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  MIN_ZOOM,
  MAX_ZOOM,
  ZOOM_STEP,
  DEFAULT_FILL,
  DEFAULT_STROKE,
  DEFAULT_STROKE_WIDTH,
} from '../../utils/constants';

import type { ToolType, ExportFormat } from '../../types/canvas';

export function CanvasEditor() {
  const { canvasId } = useParams<{ canvasId: string }>();
  const navigate = useNavigate();

  // Canvas & Tools State
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [canvasTitle, setCanvasTitle] = useState('Untitled - Paint');
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [objectCount, setObjectCount] = useState(0);
  const [cursorCoords, setCursorCoords] = useState<{ x: number; y: number } | null>(null);

  // Paint Palette & Colors State
  const [color1, setColor1] = useState(DEFAULT_STROKE); // Foreground / Stroke / Text / Pen
  const [color2, setColor2] = useState(DEFAULT_FILL); // Background / Shape Fill
  const [activeColorSlot, setActiveColorSlot] = useState<'color1' | 'color2'>('color1');
  const [strokeWidth, setStrokeWidth] = useState(DEFAULT_STROKE_WIDTH);
  const [fillEnabled, setFillEnabled] = useState(true);

  // Status & Confirmation
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isLoadingCanvas, setIsLoadingCanvas] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  const clipboardRef = useRef<FabricObject | null>(null);
  const hasLoadedRef = useRef(false);

  // Firestore & History Hooks
  const { saveCanvas, loadCanvas, isSaving, lastSaved } = useFirestore();
  const { saveState, undo, redo, clearHistory, canUndo, canRedo } = useCanvasHistory(canvas);

  // Update object count
  const updateObjectCount = useCallback(() => {
    if (!canvas) return;
    const count = canvas.getObjects().filter((o: any) => !o.data?.isGrid).length;
    setObjectCount(count);
  }, [canvas]);

  // Canvas Ready callback
  const handleCanvasReady = useCallback((c: FabricCanvas) => {
    setCanvas(c);
  }, []);

  // Load Canvas from Firestore on mount
  useEffect(() => {
    if (!canvas || !canvasId || hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const load = async () => {
      try {
        setIsLoadingCanvas(true);
        const doc = await loadCanvas(canvasId);

        if (doc) {
          setCanvasTitle(doc.name || doc.title || 'Untitled - Paint');
          const dataToLoad = doc.canvasJSON || (doc.data ? JSON.stringify(doc.data) : null);

          if (dataToLoad && dataToLoad !== '{}' && dataToLoad !== '{"version":"6.0.0","objects":[]}') {
            await deserializeCanvas(canvas, dataToLoad);
            showToast('success', 'Canvas restored!');
          }
          setIsNotFound(false);
        } else {
          // If document does not exist
          setIsNotFound(true);
        }
      } catch (err) {
        console.error('Failed to load canvas:', err);
        setIsNotFound(true);
      } finally {
        setIsLoadingCanvas(false);
        clearHistory();
        saveState();
        updateObjectCount();
        setHasUnsavedChanges(false);
      }
    };

    load();
  }, [canvas, canvasId, loadCanvas, clearHistory, saveState, updateObjectCount]);

  // Save Canvas handler
  const handleSave = useCallback(async () => {
    if (!canvas || !canvasId) return;

    try {
      const jsonString = serializeCanvas(canvas);
      const parsedData = JSON.parse(jsonString);

      await saveCanvas(canvasId, {
        name: canvasTitle,
        data: parsedData,
      });

      setHasUnsavedChanges(false);
      showToast('success', 'Saved to cloud ✓');
    } catch {
      showToast('error', 'Failed to save canvas.');
    }
  }, [canvas, canvasId, canvasTitle, saveCanvas]);

  // Object modified handler (marks unsaved & records undo)
  const handleObjectModified = useCallback(() => {
    saveState();
    updateObjectCount();
    setHasUnsavedChanges(true);
  }, [saveState, updateObjectCount]);

  // Selection change
  const handleSelectionChange = useCallback((obj: FabricObject | null) => {
    setSelectedObject(obj);
    if (obj) {
      setActiveTool('select');
    }
  }, []);

  // Color selection for active color slot
  const handleColorChange = useCallback(
    (newColor: string) => {
      if (activeColorSlot === 'color1') {
        setColor1(newColor);
        // If an object is selected, update its stroke / text color
        if (selectedObject && canvas) {
          const isText =
            selectedObject.type === 'textbox' ||
            selectedObject.type === 'i-text' ||
            selectedObject.type === 'text';
          if (isText) {
            (selectedObject as any).set('fill', newColor);
          } else {
            (selectedObject as any).set('stroke', newColor);
          }
          canvas.renderAll();
          handleObjectModified();
        }
      } else {
        setColor2(newColor);
        // If a shape object is selected, update its fill color
        if (selectedObject && canvas) {
          (selectedObject as any).set('fill', newColor);
          canvas.renderAll();
          handleObjectModified();
        }
      }
    },
    [activeColorSlot, selectedObject, canvas, handleObjectModified]
  );

  // Stroke width change
  const handleStrokeWidthChange = useCallback(
    (width: number) => {
      setStrokeWidth(width);
      if (selectedObject && canvas) {
        (selectedObject as any).set('strokeWidth', width);
        canvas.renderAll();
        handleObjectModified();
      }
    },
    [selectedObject, canvas, handleObjectModified]
  );

  // Delete selected object
  const handleDelete = useCallback(() => {
    if (!canvas) return;
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length === 0) return;

    activeObjects.forEach((obj) => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.renderAll();
    setSelectedObject(null);
    handleObjectModified();
  }, [canvas, handleObjectModified]);

  // Clear entire canvas (with confirmation)
  const handleConfirmClearCanvas = useCallback(() => {
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = '#FFFFFF';
    canvas.renderAll();
    setSelectedObject(null);
    setIsClearModalOpen(false);
    handleObjectModified();
    showToast('info', 'Canvas cleared');
  }, [canvas, handleObjectModified]);

  // Copy object
  const handleCopy = useCallback(() => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    activeObject.clone().then((cloned: FabricObject) => {
      clipboardRef.current = cloned;
      showToast('info', 'Copied to clipboard');
    });
  }, [canvas]);

  // Paste object
  const handlePaste = useCallback(() => {
    if (!canvas || !clipboardRef.current) return;

    clipboardRef.current.clone().then((cloned: FabricObject) => {
      canvas.discardActiveObject();
      cloned.set({
        left: (cloned.left || 0) + 25,
        top: (cloned.top || 0) + 25,
        evented: true,
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
      handleObjectModified();
      showToast('info', 'Pasted');
    });
  }, [canvas, handleObjectModified]);

  // Duplicate object
  const handleDuplicate = useCallback(() => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    activeObject.clone().then((cloned: FabricObject) => {
      cloned.set({
        left: (cloned.left || 0) + 25,
        top: (cloned.top || 0) + 25,
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
      handleObjectModified();
    });
  }, [canvas, handleObjectModified]);

  // Select all objects
  const handleSelectAll = useCallback(() => {
    if (!canvas) return;
    const objects = canvas.getObjects().filter((o: any) => !o.data?.isGrid && o.selectable !== false);
    if (objects.length === 0) return;

    canvas.discardActiveObject();
    const sel = new ActiveSelection(objects, { canvas });
    canvas.setActiveObject(sel);
    canvas.renderAll();
  }, [canvas]);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(MAX_ZOOM, Number((z + ZOOM_STEP).toFixed(2))));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(MIN_ZOOM, Number((z - ZOOM_STEP).toFixed(2))));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoom(1);
  }, []);

  // Export
  const handleExport = useCallback(
    (format: ExportFormat) => {
      if (!canvas) return;

      switch (format) {
        case 'png': {
          const dataUrl = exportAsPNG(canvas);
          downloadFile(dataUrl, `${canvasTitle}.png`, 'image/png');
          showToast('success', 'Exported as PNG image');
          break;
        }
        case 'svg': {
          const svg = exportAsSVG(canvas);
          downloadFile(svg, `${canvasTitle}.svg`, 'image/svg+xml');
          showToast('success', 'Exported as SVG vector');
          break;
        }
        case 'json': {
          const json = serializeCanvas(canvas);
          downloadFile(json, `${canvasTitle}.json`, 'application/json');
          showToast('success', 'Exported as Fabric JSON');
          break;
        }
      }
    },
    [canvas, canvasTitle]
  );

  // Keyboard Shortcuts (Delete, Undo, Redo, Save, Tools)
  useKeyboardShortcuts({
    canvas,
    onSave: handleSave,
    onUndo: undo,
    onRedo: redo,
    onDelete: handleDelete,
    onCopy: handleCopy,
    onPaste: handlePaste,
    onSelectAll: handleSelectAll,
    onZoomIn: handleZoomIn,
    onZoomOut: handleZoomOut,
    onZoomReset: handleZoomReset,
    setActiveTool,
  });

  // Not Found State Screen (Section 10 Requirement)
  if (isNotFound && !isLoadingCanvas) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#181818] text-white p-6 font-sans">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#252526] border border-[#3e3e42] shadow-2xl text-center space-y-5">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Canvas Not Found</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            The canvas you're trying to access doesn't exist or may have been removed.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] overflow-hidden relative font-sans">
      {/* 1. Top MS Paint Ribbon Toolbar */}
      <RibbonToolbar
        canvasTitle={canvasTitle}
        onTitleChange={setCanvasTitle}
        activeTool={activeTool}
        onToolChange={setActiveTool}
        color1={color1}
        color2={color2}
        activeColorSlot={activeColorSlot}
        onSelectColorSlot={setActiveColorSlot}
        onColorChange={handleColorChange}
        strokeWidth={strokeWidth}
        onStrokeWidthChange={handleStrokeWidthChange}
        fillEnabled={fillEnabled}
        onToggleFill={setFillEnabled}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        lastSaved={lastSaved}
        onSave={handleSave}
        onClearCanvas={() => setIsClearModalOpen(true)}
        onDeleteSelected={handleDelete}
        onExport={handleExport}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
      />

      {/* 2. Contextual Property Bar (Appears when an object is selected) */}
      <ContextualPropertyBar
        canvas={canvas}
        selectedObject={selectedObject}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onSaveState={handleObjectModified}
      />

      {/* 3. Center Canvas Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        <CanvasArea
          activeTool={activeTool}
          zoom={zoom}
          showGrid={showGrid}
          color1={color1}
          color2={color2}
          strokeWidth={strokeWidth}
          fillEnabled={fillEnabled}
          onCanvasReady={handleCanvasReady}
          onSelectionChange={handleSelectionChange}
          onObjectModified={handleObjectModified}
          onZoomChange={setZoom}
          onMouseMoveCoords={setCursorCoords}
        />

        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoadingCanvas && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#181818]/80 backdrop-blur-sm z-40 flex flex-col items-center justify-center gap-3 text-white"
            >
              <Loader2 className="w-9 h-9 text-blue-500 animate-spin" />
              <p className="text-sm font-medium text-gray-300">Loading canvas...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Bottom Status Bar */}
      <StatusBar
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        onZoomChange={setZoom}
        objectCount={objectCount}
        canvasWidth={CANVAS_WIDTH}
        canvasHeight={CANVAS_HEIGHT}
        cursorCoords={cursorCoords}
      />

      {/* 5. Clear Canvas Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isClearModalOpen}
        title="Clear Canvas"
        message="Clear the entire canvas? This cannot be undone."
        confirmLabel="Clear Canvas"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmClearCanvas}
        onCancel={() => setIsClearModalOpen(false)}
      />
    </div>
  );
}
