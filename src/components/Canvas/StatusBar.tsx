import { ZoomIn, ZoomOut, Maximize, MousePointer2 } from 'lucide-react';
import { MIN_ZOOM, MAX_ZOOM } from '../../utils/constants';

interface StatusBarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onZoomChange: (zoom: number) => void;
  objectCount: number;
  canvasWidth: number;
  canvasHeight: number;
  cursorCoords: { x: number; y: number } | null;
}

export function StatusBar({
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onZoomChange,
  objectCount,
  canvasWidth,
  canvasHeight,
  cursorCoords,
}: StatusBarProps) {
  const zoomPercent = Math.round(zoom * 100);

  return (
    <div className="h-7 bg-[#1f1f1f] text-[#a0a0a0] border-t border-[#2e2e2e] flex items-center justify-between px-3 text-[11px] select-none shrink-0 font-sans shadow-md">
      {/* Left: Pointer Coordinates & Canvas Size */}
      <div className="flex items-center gap-4">
        {/* Live Cursor Coordinates */}
        <div className="flex items-center gap-1.5 min-w-[90px]">
          <MousePointer2 className="w-3 h-3 text-gray-400" />
          <span>
            {cursorCoords ? `${cursorCoords.x}, ${cursorCoords.y}px` : '---, ---'}
          </span>
        </div>

        <div className="h-3.5 w-px bg-[#333333]" />

        {/* Canvas dimensions */}
        <div className="flex items-center gap-1">
          <span className="font-mono">{canvasWidth} × {canvasHeight}px</span>
        </div>

        <div className="h-3.5 w-px bg-[#333333]" />

        {/* Object count */}
        <div className="hidden sm:flex items-center gap-1 text-gray-400">
          <span>{objectCount} object{objectCount !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Right: Zoom controls & Slider */}
      <div className="flex items-center gap-2">
        {/* Fit to window */}
        <button
          onClick={onZoomReset}
          className="p-1 rounded hover:bg-[#2e2e2e] text-gray-400 hover:text-white transition-colors"
          title="Fit Canvas to Screen (100%)"
        >
          <Maximize className="w-3.5 h-3.5" />
        </button>

        {/* Zoom Out Button */}
        <button
          onClick={onZoomOut}
          disabled={zoom <= MIN_ZOOM}
          className="p-1 rounded hover:bg-[#2e2e2e] text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
          title="Zoom Out (Ctrl -)"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        {/* Zoom slider */}
        <input
          type="range"
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          step="0.05"
          value={zoom}
          onChange={(e) => onZoomChange(Number(e.target.value))}
          className="w-20 h-1 bg-[#333333] rounded-lg appearance-none cursor-pointer accent-blue-500"
        />

        {/* Zoom In Button */}
        <button
          onClick={onZoomIn}
          disabled={zoom >= MAX_ZOOM}
          className="p-1 rounded hover:bg-[#2e2e2e] text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
          title="Zoom In (Ctrl +)"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        {/* Zoom Percentage */}
        <button
          onClick={onZoomReset}
          className="w-12 text-center font-mono py-0.5 rounded hover:bg-[#2e2e2e] text-gray-300 hover:text-white transition-colors"
          title="Click to reset to 100%"
        >
          {zoomPercent}%
        </button>
      </div>
    </div>
  );
}
