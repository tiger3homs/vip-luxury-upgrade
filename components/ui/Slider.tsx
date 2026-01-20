import React, { useState, useRef, useEffect, useCallback } from 'react';

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue?: (value: number) => string;
  label?: string;
  className?: string;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue = (v) => v.toString(),
  label,
  className = '',
}) => {
  const [localValue, setLocalValue] = useState(value);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<'min' | 'max' | null>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const getPercent = (val: number) => ((val - min) / (max - min)) * 100;

  const handleMove = useCallback(
    (clientX: number) => {
      if (!trackRef.current || !isDragging.current) return;

      const rect = trackRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      const rawValue = min + (percent / 100) * (max - min);
      const steppedValue = Math.round(rawValue / step) * step;
      const clampedValue = Math.max(min, Math.min(max, steppedValue));

      setLocalValue((prev) => {
        if (isDragging.current === 'min') {
          const newMin = Math.min(clampedValue, prev[1] - step);
          return [newMin, prev[1]];
        } else {
          const newMax = Math.max(clampedValue, prev[0] + step);
          return [prev[0], newMax];
        }
      });
    },
    [min, max, step]
  );

  const handleMouseDown = (type: 'min' | 'max') => (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = type;
    
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleMouseUp = () => {
      isDragging.current = null;
      onChange(localValue);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (type: 'min' | 'max') => (e: React.TouchEvent) => {
    isDragging.current = type;
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX);
    };
    const handleTouchEnd = () => {
      isDragging.current = null;
      onChange(localValue);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-muted">
            {label}
          </span>
          <span className="text-sm text-white font-bold">
            {formatValue(localValue[0])} — {formatValue(localValue[1])}
          </span>
        </div>
      )}
      
      <div className="relative h-6 flex items-center" ref={trackRef}>
        {/* Track background */}
        <div className="absolute w-full h-1 bg-white/10 rounded-full" />
        
        {/* Active track */}
        <div
          className="absolute h-1 bg-brand-yellow rounded-full"
          style={{
            left: `${getPercent(localValue[0])}%`,
            width: `${getPercent(localValue[1]) - getPercent(localValue[0])}%`,
          }}
        />

        {/* Min handle */}
        <div
          className="absolute w-5 h-5 bg-brand-yellow rounded-full cursor-grab active:cursor-grabbing shadow-lg transform -translate-x-1/2 hover:scale-110 transition-transform"
          style={{ left: `${getPercent(localValue[0])}%` }}
          onMouseDown={handleMouseDown('min')}
          onTouchStart={handleTouchStart('min')}
          role="slider"
          aria-valuenow={localValue[0]}
          aria-valuemin={min}
          aria-valuemax={localValue[1]}
          aria-label="Minimum value"
          tabIndex={0}
        />

        {/* Max handle */}
        <div
          className="absolute w-5 h-5 bg-brand-yellow rounded-full cursor-grab active:cursor-grabbing shadow-lg transform -translate-x-1/2 hover:scale-110 transition-transform"
          style={{ left: `${getPercent(localValue[1])}%` }}
          onMouseDown={handleMouseDown('max')}
          onTouchStart={handleTouchStart('max')}
          role="slider"
          aria-valuenow={localValue[1]}
          aria-valuemin={localValue[0]}
          aria-valuemax={max}
          aria-label="Maximum value"
          tabIndex={0}
        />
      </div>

      {/* Min/Max labels */}
      <div className="flex justify-between text-xs text-brand-muted">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
};

// Simple single value slider
interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  label?: string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue = (v) => v.toString(),
  label,
  className = '',
}) => {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-muted">
            {label}
          </span>
          <span className="text-sm text-white font-bold">
            {formatValue(value)}
          </span>
        </div>
      )}
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-brand-yellow [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:shadow-lg"
          style={{
            background: `linear-gradient(to right, #E8FF00 ${percent}%, rgba(255,255,255,0.1) ${percent}%)`,
          }}
        />
      </div>

      <div className="flex justify-between text-xs text-brand-muted">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
};
