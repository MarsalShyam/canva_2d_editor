import { useEffect, useRef, useCallback } from 'react';
import {
  Canvas,
  Rect,
  Circle,
  Triangle,
  Line,
  Textbox,
  Polygon,
  PencilBrush,
} from 'fabric';
import type { Canvas as FabricCanvas, FabricObject } from 'fabric';
import type { ToolType } from '../../types/canvas';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  MIN_ZOOM,
  MAX_ZOOM,
  ZOOM_STEP,
} from '../../utils/constants';

interface CanvasAreaProps {
  activeTool: ToolType;
  zoom: number;
  showGrid: boolean;
  color1: string; // Stroke / Pen / Text
  color2: string; // Fill
  strokeWidth: number;
  fillEnabled: boolean;
  onCanvasReady: (canvas: FabricCanvas) => void;
  onSelectionChange: (obj: FabricObject | null) => void;
  onObjectModified: () => void;
  onZoomChange: (zoom: number) => void;
  onMouseMoveCoords: (coords: { x: number; y: number } | null) => void;
}

export function CanvasArea({
  activeTool,
  zoom,
  showGrid,
  color1,
  color2,
  strokeWidth,
  fillEnabled,
  onCanvasReady,
  onSelectionChange,
  onObjectModified,
  onZoomChange,
  onMouseMoveCoords,
}: CanvasAreaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Drag-to-create shape tracking
  const isDrawingShapeRef = useRef(false);
  const shapeOriginRef = useRef<{ x: number; y: number } | null>(null);
  const activeShapeRef = useRef<FabricObject | null>(null);

  // References for current tool & color settings
  const propsRef = useRef({
    activeTool,
    color1,
    color2,
    strokeWidth,
    fillEnabled,
  });
  propsRef.current = {
    activeTool,
    color1,
    color2,
    strokeWidth,
    fillEnabled,
  };

  // Helper to construct custom shapes (Star, Arrow, Diamond)
  const createCustomShape = (
    type: string,
    x: number,
    y: number,
    w: number,
    h: number,
    fill: string,
    stroke: string,
    sWidth: number
  ): FabricObject => {
    const absW = Math.max(10, Math.abs(w));
    const absH = Math.max(10, Math.abs(h));
    const left = Math.min(x, x + w);
    const top = Math.min(y, y + h);

    if (type === 'diamond') {
      const points = [
        { x: absW / 2, y: 0 },
        { x: absW, y: absH / 2 },
        { x: absW / 2, y: absH },
        { x: 0, y: absH / 2 },
      ];
      return new Polygon(points, {
        left,
        top,
        fill,
        stroke,
        strokeWidth: sWidth,
      });
    }

    if (type === 'arrow') {
      const points = [
        { x: 0, y: absH * 0.3 },
        { x: absW * 0.6, y: absH * 0.3 },
        { x: absW * 0.6, y: 0 },
        { x: absW, y: absH * 0.5 },
        { x: absW * 0.6, y: absH },
        { x: absW * 0.6, y: absH * 0.7 },
        { x: 0, y: absH * 0.7 },
      ];
      return new Polygon(points, {
        left,
        top,
        fill,
        stroke,
        strokeWidth: sWidth,
      });
    }

    if (type === 'star') {
      const points = [
        { x: absW * 0.5, y: 0 },
        { x: absW * 0.62, y: absH * 0.35 },
        { x: absW, y: absH * 0.35 },
        { x: absW * 0.69, y: absH * 0.57 },
        { x: absW * 0.81, y: absH },
        { x: absW * 0.5, y: absH * 0.75 },
        { x: absW * 0.19, y: absH },
        { x: absW * 0.31, y: absH * 0.57 },
        { x: 0, y: absH * 0.35 },
        { x: absW * 0.38, y: absH * 0.35 },
      ];
      return new Polygon(points, {
        left,
        top,
        fill,
        stroke,
        strokeWidth: sWidth,
      });
    }

    return new Rect({
      left,
      top,
      width: absW,
      height: absH,
      fill,
      stroke,
      strokeWidth: sWidth,
    });
  };

  // 1. Initialize Fabric Canvas
  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: '#FFFFFF',
      selection: true,
      preserveObjectStacking: true,
      stopContextMenu: true,
      fireRightClick: true,
    });

    fabricRef.current = canvas;
    onCanvasReady(canvas);

    // Selection listeners
    canvas.on('selection:created', (e) => {
      onSelectionChange(e.selected?.[0] || null);
    });
    canvas.on('selection:updated', (e) => {
      onSelectionChange(e.selected?.[0] || null);
    });
    canvas.on('selection:cleared', () => {
      onSelectionChange(null);
    });

    // Object modification listener (for undo/redo & persistence)
    canvas.on('object:modified', () => {
      onObjectModified();
    });

    // Path created listener (Pen tool freehand drawing finished)
    canvas.on('path:created', () => {
      onObjectModified();
    });

    // 2. Mouse down handler for drag-to-create & text creation
    canvas.on('mouse:down', (opt) => {
      const currentTool = propsRef.current.activeTool;
      if (currentTool === 'select' || currentTool === 'pen' || currentTool === 'eraser') return;

      const pointer = canvas.getScenePoint(opt.e);
      const { color1, color2, strokeWidth, fillEnabled } = propsRef.current;
      const fillColor = fillEnabled ? color2 : 'transparent';
      const strokeColor = color1;

      // Handle Text tool: single click adds Textbox and enters editing
      if (currentTool === 'text') {
        const textObj = new Textbox('Type here...', {
          left: pointer.x,
          top: pointer.y,
          fontSize: 28,
          fontFamily: 'Arial',
          fill: color1,
          width: 220,
          editable: true,
        });

        canvas.add(textObj);
        canvas.setActiveObject(textObj);
        textObj.enterEditing();
        textObj.selectAll();
        canvas.renderAll();
        onObjectModified();
        onSelectionChange(textObj);
        return;
      }

      // Start drag-to-create shape
      isDrawingShapeRef.current = true;
      shapeOriginRef.current = { x: pointer.x, y: pointer.y };

      let initialObj: FabricObject | null = null;

      switch (currentTool) {
        case 'rectangle':
          initialObj = new Rect({
            left: pointer.x,
            top: pointer.y,
            width: 1,
            height: 1,
            fill: fillColor,
            stroke: strokeColor,
            strokeWidth,
            rx: 2,
            ry: 2,
          });
          break;

        case 'circle':
          initialObj = new Circle({
            left: pointer.x,
            top: pointer.y,
            radius: 1,
            fill: fillColor,
            stroke: strokeColor,
            strokeWidth,
          });
          break;

        case 'triangle':
          initialObj = new Triangle({
            left: pointer.x,
            top: pointer.y,
            width: 1,
            height: 1,
            fill: fillColor,
            stroke: strokeColor,
            strokeWidth,
          });
          break;

        case 'line':
          initialObj = new Line([pointer.x, pointer.y, pointer.x, pointer.y], {
            stroke: strokeColor,
            strokeWidth: Math.max(1, strokeWidth),
          });
          break;

        case 'star':
        case 'arrow':
        case 'diamond':
          initialObj = createCustomShape(
            currentTool,
            pointer.x,
            pointer.y,
            1,
            1,
            fillColor,
            strokeColor,
            strokeWidth
          );
          break;
      }

      if (initialObj) {
        activeShapeRef.current = initialObj;
        canvas.add(initialObj);
        canvas.renderAll();
      }
    });

    // 3. Mouse move handler for live drag preview & coordinate tracking
    canvas.on('mouse:move', (opt) => {
      const pointer = canvas.getScenePoint(opt.e);
      onMouseMoveCoords({ x: Math.round(pointer.x), y: Math.round(pointer.y) });

      if (!isDrawingShapeRef.current || !shapeOriginRef.current || !activeShapeRef.current) return;

      const origin = shapeOriginRef.current;
      const currentTool = propsRef.current.activeTool;
      const shape = activeShapeRef.current;

      const width = pointer.x - origin.x;
      const height = pointer.y - origin.y;

      if (currentTool === 'rectangle' || currentTool === 'triangle') {
        const left = width > 0 ? origin.x : pointer.x;
        const top = height > 0 ? origin.y : pointer.y;
        (shape as any).set({
          left,
          top,
          width: Math.max(2, Math.abs(width)),
          height: Math.max(2, Math.abs(height)),
        });
      } else if (currentTool === 'circle') {
        const radius = Math.max(2, Math.sqrt(width * width + height * height) / 2);
        const left = Math.min(origin.x, pointer.x);
        const top = Math.min(origin.y, pointer.y);
        (shape as any).set({
          left,
          top,
          radius,
        });
      } else if (currentTool === 'line') {
        (shape as any).set({
          x2: pointer.x,
          y2: pointer.y,
        });
      } else if (currentTool === 'star' || currentTool === 'arrow' || currentTool === 'diamond') {
        canvas.remove(shape);
        const { color1, color2, strokeWidth, fillEnabled } = propsRef.current;
        const fillColor = fillEnabled ? color2 : 'transparent';
        const newShape = createCustomShape(
          currentTool,
          origin.x,
          origin.y,
          width,
          height,
          fillColor,
          color1,
          strokeWidth
        );
        activeShapeRef.current = newShape;
        canvas.add(newShape);
      }

      canvas.renderAll();
    });

    // 4. Mouse up handler (finalize shape creation)
    canvas.on('mouse:up', () => {
      if (isDrawingShapeRef.current && activeShapeRef.current) {
        const shape = activeShapeRef.current;
        isDrawingShapeRef.current = false;
        shapeOriginRef.current = null;
        activeShapeRef.current = null;

        canvas.setActiveObject(shape);
        canvas.renderAll();
        onObjectModified();
        onSelectionChange(shape);
      }
    });

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update active tool behavior (Drawing mode / Cursor / Selection)
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = false;
    canvas.selection = true;
    canvas.defaultCursor = 'default';
    canvas.hoverCursor = 'move';

    if (activeTool === 'pen') {
      canvas.isDrawingMode = true;
      const brush = new PencilBrush(canvas);
      brush.color = color1;
      brush.width = strokeWidth;
      canvas.freeDrawingBrush = brush;
      canvas.defaultCursor = 'crosshair';
    } else if (activeTool === 'eraser') {
      canvas.isDrawingMode = true;
      const brush = new PencilBrush(canvas);
      brush.color = '#FFFFFF';
      brush.width = Math.max(16, strokeWidth * 3);
      canvas.freeDrawingBrush = brush;
      canvas.defaultCursor = 'crosshair';
    } else if (activeTool !== 'select') {
      canvas.selection = false;
      canvas.defaultCursor = 'crosshair';
      canvas.hoverCursor = 'crosshair';
    }
  }, [activeTool, color1, strokeWidth]);

  // Update brush when color1 or strokeWidth changes
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas || !canvas.freeDrawingBrush) return;

    if (activeTool === 'pen') {
      canvas.freeDrawingBrush.color = color1;
      canvas.freeDrawingBrush.width = strokeWidth;
    }
  }, [activeTool, color1, strokeWidth]);

  // Handle Zoom
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.setZoom(zoom);
    canvas.setDimensions({
      width: CANVAS_WIDTH * zoom,
      height: CANVAS_HEIGHT * zoom,
    });
  }, [zoom]);

  // Mouse wheel zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
        const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom + delta));
        onZoomChange(newZoom);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [zoom, onZoomChange]);

  // Draw or clear Grid Lines on canvas
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const gridObjects = canvas.getObjects().filter((o: any) => o.data?.isGrid);
    gridObjects.forEach((o) => canvas.remove(o));

    if (showGrid) {
      const gridSize = 40;
      const gridColor = 'rgba(0, 0, 0, 0.07)';

      for (let i = 0; i <= CANVAS_WIDTH; i += gridSize) {
        const line = new Line([i, 0, i, CANVAS_HEIGHT], {
          stroke: gridColor,
          strokeWidth: 1,
          selectable: false,
          evented: false,
          data: { isGrid: true },
        });
        canvas.add(line);
        canvas.sendObjectToBack(line);
      }

      for (let i = 0; i <= CANVAS_HEIGHT; i += gridSize) {
        const line = new Line([0, i, CANVAS_WIDTH, i], {
          stroke: gridColor,
          strokeWidth: 1,
          selectable: false,
          evented: false,
          data: { isGrid: true },
        });
        canvas.add(line);
        canvas.sendObjectToBack(line);
      }
    }

    canvas.renderAll();
  }, [showGrid]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto relative bg-[#18181b] flex items-center justify-center p-8 select-none"
      onMouseLeave={() => onMouseMoveCoords(null)}
    >
      {/* MS Paint Logical White Canvas Container (1200 × 700) */}
      <div
        className="relative shadow-2xl bg-white rounded-none border border-[#444444] transition-shadow hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]"
        style={{
          width: CANVAS_WIDTH * zoom,
          height: CANVAS_HEIGHT * zoom,
        }}
      >
        <canvas ref={canvasRef} id="fabric-paint-canvas" />

        {/* Small corner resize indicator dots just like Windows Paint */}
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-gray-600 pointer-events-none" />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-gray-600 pointer-events-none" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-gray-600 pointer-events-none" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-gray-600 pointer-events-none" />
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-white border border-gray-600 pointer-events-none" />
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border border-gray-600 pointer-events-none" />
      </div>
    </div>
  );
}
