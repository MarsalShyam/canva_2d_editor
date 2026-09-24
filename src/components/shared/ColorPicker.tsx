import { useState, useRef, useEffect, useCallback } from 'react';
import { COLOR_PRESETS } from '../../utils/constants';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleInputChange = (hex: string) => {
    setInputValue(hex);
    if (/^#[0-9a-fA-F]{6}$/.test(hex) || hex === 'transparent') {
      onChange(hex);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-xs font-medium text-text-secondary mb-1.5">
        {label}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-surface-dark border border-border hover:border-border-light transition-colors"
      >
        <div
          className="w-5 h-5 rounded-md border border-white/20 shrink-0"
          style={{
            background:
              value === 'transparent'
                ? 'repeating-conic-gradient(#666 0% 25%, transparent 0% 50%) 50%/12px 12px'
                : value,
          }}
        />
        <span className="text-xs text-text-primary font-mono uppercase truncate">
          {value === 'transparent' ? 'None' : value}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-56 p-3 rounded-xl bg-surface-dark border border-border-light shadow-2xl">
          {/* Color grid */}
          <div className="grid grid-cols-6 gap-1.5 mb-3">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => {
                  onChange(preset.value);
                  setInputValue(preset.value);
                }}
                className={`w-7 h-7 rounded-lg border-2 transition-all hover:scale-110 ${
                  value === preset.value
                    ? 'border-primary ring-2 ring-primary/30 scale-110'
                    : 'border-transparent'
                }`}
                style={{
                  background:
                    preset.value === 'transparent'
                      ? 'repeating-conic-gradient(#666 0% 25%, transparent 0% 50%) 50%/8px 8px'
                      : preset.value,
                }}
                title={preset.name}
              />
            ))}
          </div>

          {/* Hex input */}
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value === 'transparent' ? '#000000' : value}
              onChange={(e) => {
                onChange(e.target.value);
                setInputValue(e.target.value);
              }}
              className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
            />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              className="flex-1 px-2 py-1.5 text-xs font-mono bg-surface rounded-lg border border-border text-text-primary focus:outline-none focus:border-primary"
              placeholder="#000000"
            />
          </div>
        </div>
      )}
    </div>
  );
}
