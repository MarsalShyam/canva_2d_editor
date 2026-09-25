import { useEffect, useRef } from 'react';

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
import { performFloodFill } from '../../utils/floodFill';

interface CanvasAreaProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
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
  onAddImage?: (file: File) => void;
}

export function CanvasArea({
  activeTool,
  onToolChange,
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
  onAddImage,
}: CanvasAreaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const whiteContainerRef = useRef<HTMLDivElement>(null);

  // Request 2: Click outside the white canvas container deselects tool/shape & resets to 'select'
  const handleOuterMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (whiteContainerRef.current && !whiteContainerRef.current.contains(e.target as Node)) {
      if (activeTool !== 'select') {
        onToolChange('select');
      }
      if (fabricRef.current) {
        const activeObj = fabricRef.current.getActiveObject() as any;
        if (activeObj && typeof activeObj.exitEditing === 'function' && activeObj.isEditing) {
          activeObj.exitEditing();
        }
        fabricRef.current.discardActiveObject();
        fabricRef.current.renderAll();
        onSelectionChange(null);
      }
    }
  };

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

  // Helper to construct custom shapes (Star, Cloud, Heart, Arrows, Diamond)
  const isCustomShape = (tool: string) =>
    [
      'star',
      'cloud',
      'heart',
      'arrow',
      'arrow-right',
      'arrow-left',
      'arrow-up',
      'arrow-down',
      'diamond',
    ].includes(tool);

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

    if (type === 'heart') {
      const heartPoints: { x: number; y: number }[] = [];
      const steps = 36;
      for (let i = 0; i < steps; i++) {
        const t = (i / steps) * Math.PI * 2;
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        const nx = (hx + 16) / 32;
        const ny = (hy + 17) / 32;
        heartPoints.push({ x: nx * absW, y: ny * absH });
      }
      return new Polygon(heartPoints, {
        left,
        top,
        fill,
        stroke,
        strokeWidth: sWidth,
      });
    }

    if (type === 'cloud') {
      const cloudNorm = [
        { x: 0.18, y: 0.8 },
        { x: 0.1, y: 0.72 },
        { x: 0.05, y: 0.58 },
        { x: 0.07, y: 0.44 },
        { x: 0.16, y: 0.34 },
        { x: 0.22, y: 0.22 },
        { x: 0.34, y: 0.14 },
        { x: 0.48, y: 0.12 },
        { x: 0.58, y: 0.17 },
        { x: 0.65, y: 0.1 },
        { x: 0.78, y: 0.12 },
        { x: 0.88, y: 0.22 },
        { x: 0.94, y: 0.36 },
        { x: 0.96, y: 0.5 },
        { x: 0.92, y: 0.65 },
        { x: 0.85, y: 0.78 },
        { x: 0.8, y: 0.8 },
      ];
      return new Polygon(
        cloudNorm.map((p) => ({ x: p.x * absW, y: p.y * absH })),
        {
          left,
          top,
          fill,
          stroke,
          strokeWidth: sWidth,
        }
      );
    }

    if (type === 'arrow' || type === 'arrow-right') {
      const points = [
        { x: 0, y: absH * 0.35 },
        { x: absW * 0.6, y: absH * 0.35 },
        { x: absW * 0.6, y: absH * 0.1 },
        { x: absW, y: absH * 0.5 },
        { x: absW * 0.6, y: absH * 0.9 },
        { x: absW * 0.6, y: absH * 0.65 },
        { x: 0, y: absH * 0.65 },
      ];
      return new Polygon(points, {
        left,
        top,
        fill,
        stroke,
        strokeWidth: sWidth,
      });
    }

    if (type === 'arrow-left') {
      const points = [
        { x: absW * 0.4, y: absH * 0.1 },
        { x: absW * 0.4, y: absH * 0.35 },
        { x: absW, y: absH * 0.35 },
        { x: absW, y: absH * 0.65 },
        { x: absW * 0.4, y: absH * 0.65 },
        { x: absW * 0.4, y: absH * 0.9 },
        { x: 0, y: absH * 0.5 },
      ];
      return new Polygon(points, {
        left,
        top,
        fill,
        stroke,
        strokeWidth: sWidth,
      });
    }

    if (type === 'arrow-up') {
      const points = [
        { x: absW * 0.5, y: 0 },
        { x: absW * 0.9, y: absH * 0.4 },
        { x: absW * 0.65, y: absH * 0.4 },
        { x: absW * 0.65, y: absH },
        { x: absW * 0.35, y: absH },
        { x: absW * 0.35, y: absH * 0.4 },
        { x: absW * 0.1, y: absH * 0.4 },
      ];
      return new Polygon(points, {
        left,
        top,
        fill,
        stroke,
        strokeWidth: sWidth,
      });
    }

    if (type === 'arrow-down') {
      const points = [
        { x: absW * 0.35, y: 0 },
        { x: absW * 0.65, y: 0 },
        { x: absW * 0.65, y: absH * 0.6 },
        { x: absW * 0.9, y: absH * 0.6 },
        { x: absW * 0.5, y: absH },
        { x: absW * 0.1, y: absH * 0.6 },
        { x: absW * 0.35, y: absH * 0.6 },
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
      const starPoints: { x: number; y: number }[] = [];
      const spikes = 5;
      const step = Math.PI / spikes;
      for (let i = 0; i < 2 * spikes; i++) {
        const r = i % 2 === 0 ? 0.5 : 0.22;
        const angle = i * step - Math.PI / 2;
        starPoints.push({
          x: (0.5 + Math.cos(angle) * r) * absW,
          y: (0.5 + Math.sin(angle) * r) * absH,
        });
      }
      return new Polygon(starPoints, {
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

    // 2. Mouse down handler for drag-to-create, fill, & text creation
    canvas.on('mouse:down', (opt) => {
      const currentTool = propsRef.current.activeTool;
      if (currentTool === 'select' || currentTool === 'pen' || currentTool === 'eraser') return;

      const pointer = canvas.getScenePoint(opt.e);
      const { color1, color2, strokeWidth, fillEnabled } = propsRef.current;
      const fillColor = fillEnabled ? color2 : 'transparent';
      const strokeColor = color1;

      // Handle Fill Tool (Paint Bucket)
      if (currentTool === 'fill') {
        const activeFillColor = propsRef.current.color2 || '#22c55e';
        const target = opt.target;

        // If clicked on an existing vector object with fill property
        if (target && !(target as any).data?.isGrid && (target as any).set) {
          (target as any).set('fill', activeFillColor);
          canvas.renderAll();
          onObjectModified();
          return;
        }

        // Run pixel-level flood fill for enclosed pencil/line areas
        const filled = performFloodFill(canvas, pointer.x, pointer.y, activeFillColor);
        if (filled) {
          onObjectModified();
        }
        return;
      }

      // Handle Text tool: single click adds Textbox or focuses existing text area (Request 3)
      if (currentTool === 'text') {
        const activeObj = canvas.getActiveObject() as any;
        const target = (opt.target || canvas.findTarget(opt.e)) as any;

        const isTargetText =
          target &&
          (target.type === 'textbox' ||
            target.type === 'i-text' ||
            target.type === 'text');

        const isActiveText =
          activeObj &&
          (activeObj.type === 'textbox' ||
            activeObj.type === 'i-text' ||
            activeObj.type === 'text');

        // Check if click was inside active text object bounds
        let isInsideActiveText = false;
        if (isActiveText) {
          if (target === activeObj) {
            isInsideActiveText = true;
          } else if (typeof activeObj.containsPoint === 'function') {
            isInsideActiveText = activeObj.containsPoint(pointer);
          } else if (activeObj.getBoundingRect) {
            const rect = activeObj.getBoundingRect();
            isInsideActiveText =
              pointer.x >= rect.left &&
              pointer.x <= rect.left + rect.width &&
              pointer.y >= rect.top &&
              pointer.y <= rect.top + rect.height;
          }
        }

        // If clicking inside an open or selected text area, keep focus on it without creating a new area
        if (isTargetText || isInsideActiveText) {
          const textToFocus = isTargetText ? target : activeObj;

          if (canvas.getActiveObject() !== textToFocus) {
            canvas.setActiveObject(textToFocus);
          }

          if (typeof textToFocus.enterEditing === 'function' && !textToFocus.isEditing) {
            textToFocus.enterEditing();
          }

          canvas.renderAll();
          onSelectionChange(textToFocus);
          return;
        }

        // Clicking outside existing text area: exit editing on previous text if needed
        if (isActiveText && typeof activeObj.exitEditing === 'function' && activeObj.isEditing) {
          activeObj.exitEditing();
        }

        // Create new text area as usual
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

      if (currentTool === 'rectangle') {
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
      } else if (currentTool === 'circle') {
        initialObj = new Circle({
          left: pointer.x,
          top: pointer.y,
          radius: 1,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth,
        });
      } else if (currentTool === 'triangle') {
        initialObj = new Triangle({
          left: pointer.x,
          top: pointer.y,
          width: 1,
          height: 1,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth,
        });
      } else if (currentTool === 'line') {
        initialObj = new Line([pointer.x, pointer.y, pointer.x, pointer.y], {
          stroke: strokeColor,
          strokeWidth: Math.max(1, strokeWidth),
        });
      } else if (isCustomShape(currentTool)) {
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
      } else if (isCustomShape(currentTool)) {
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

    // 4. Mouse up handler (finalize shape creation without deselecting tool)
    canvas.on('mouse:up', () => {
      if (isDrawingShapeRef.current && activeShapeRef.current) {
        isDrawingShapeRef.current = false;
        shapeOriginRef.current = null;
        activeShapeRef.current = null;

        // Keep current tool active (do not force 'select') so user can draw multiple shapes
        canvas.discardActiveObject();
        canvas.renderAll();
        onObjectModified();
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
    } else if (activeTool === 'fill') {
      canvas.selection = false;
      canvas.defaultCursor = 'cell';
      canvas.hoverCursor = 'cell';
    } else if (activeTool === 'text') {
      canvas.selection = false;
      canvas.defaultCursor = 'text';
      canvas.hoverCursor = 'text';
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

  // Clean up any old Fabric line grid objects that may have been in canvas
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const gridObjects = canvas.getObjects().filter((o: any) => o.data?.isGrid);
    if (gridObjects.length > 0) {
      gridObjects.forEach((o) => canvas.remove(o));
      canvas.renderAll();
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto relative bg-[#18181b] flex items-center justify-center p-8 select-none"
      onMouseDown={handleOuterMouseDown}
      onMouseLeave={() => onMouseMoveCoords(null)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/') && onAddImage) {
          onAddImage(file);
        }
      }}
    >
      {/* MS Paint Logical White Canvas Container (1200 × 700) */}
      <div
        ref={whiteContainerRef}
        className="relative shadow-2xl bg-white rounded-none border border-[#444444] transition-shadow hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]"
        style={{
          width: CANVAS_WIDTH * zoom,
          height: CANVAS_HEIGHT * zoom,
        }}
      >
        <canvas ref={canvasRef} id="fabric-paint-canvas" />

        {/* Visual Grid Lines Overlay (Request 4) */}
        {showGrid && (
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0, 0, 0, 0.12) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0, 0, 0, 0.12) 1px, transparent 1px)
              `,
              backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
            }}
          />
        )}

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
