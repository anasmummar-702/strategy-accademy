import React, { useState, useEffect, useRef } from 'react';
import { Minus, Plus, Check } from 'lucide-react';

/**
 * Premium Stock Control Stepper & Input Widget
 * Features:
 * - High-contrast tactile segmented box with dedicated border and dividers
 * - Smooth buffered typing without snap-to-zero when clearing
 * - High-precision Minus/Plus buttons with smooth click feedback
 * - Quick batch restock buttons (+5, +10)
 * - Live stock status indicator (In Stock, Low Stock, Out of Stock)
 * - Micro checkmark animation on successful update
 */
export default function StockControl({
  value = 0,
  onChange,
  min = 0,
  max = 99999,
  lowThreshold = 5,
  showQuickPills = false,
  showBadge = false,
  badgePosition = 'bottom', // 'top' | 'bottom' | 'right'
  compact = false,
  className = '',
}) {
  const currentNum = Math.max(min, parseInt(value, 10) || 0);
  const [localVal, setLocalVal] = useState(String(currentNum));
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const isFocusedRef = useRef(false);
  const feedbackTimerRef = useRef(null);

  // Sync with incoming parent value when not focused
  useEffect(() => {
    if (!isFocusedRef.current) {
      setLocalVal(String(currentNum));
    }
  }, [currentNum]);

  const triggerFeedback = () => {
    setShowSavedFeedback(true);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => {
      setShowSavedFeedback(false);
    }, 1500);
  };

  const commitValue = (num) => {
    const clamped = Math.min(max, Math.max(min, num));
    setLocalVal(String(clamped));
    if (clamped !== currentNum && onChange) {
      onChange(clamped);
      triggerFeedback();
    }
  };

  const handleInputChange = (e) => {
    const raw = e.target.value;
    // Allow digits or empty string
    if (raw === '' || /^\d+$/.test(raw)) {
      setLocalVal(raw);
    }
  };

  const handleBlur = () => {
    isFocusedRef.current = false;
    const parsed = parseInt(localVal, 10);
    commitValue(isNaN(parsed) ? min : parsed);
  };

  const handleFocus = (e) => {
    isFocusedRef.current = true;
    e.target.select();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleStep(1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleStep(-1);
    }
  };

  const handleStep = (delta) => {
    const cur = parseInt(localVal, 10) || currentNum || 0;
    commitValue(cur + delta);
  };

  const isOutOfStock = currentNum === 0;
  const isLowStock = currentNum > 0 && currentNum <= lowThreshold;

  const renderBadge = () => {
    if (!showBadge) return null;
    if (isOutOfStock) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-300 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
          Out of Stock
        </span>
      );
    }
    if (isLowStock) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Low: {currentNum} units
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
        In Stock ({currentNum})
      </span>
    );
  };

  return (
    <div
      className={`inline-flex flex-col items-center gap-1.5 select-none ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {badgePosition === 'top' && renderBadge()}

      <div className="inline-flex items-center gap-1.5">
        {/* Core Tactile Stepper Box */}
        <div
          className={`inline-flex items-stretch rounded-lg border overflow-hidden transition-all shadow-2xs ${
            isOutOfStock
              ? 'border-rose-400 ring-1 ring-rose-400 bg-rose-50/40'
              : isLowStock
              ? 'border-amber-400 ring-1 ring-amber-400 bg-amber-50/40'
              : 'border-zinc-300 hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950 bg-white'
          }`}
        >
          {/* Decrement Button */}
          <button
            type="button"
            onClick={() => handleStep(-1)}
            disabled={currentNum <= min}
            title="Decrease stock (-1)"
            className={`${
              compact ? 'w-6 h-6' : 'w-7 h-7'
            } flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 text-zinc-700 font-bold border-r border-zinc-200/90 transition disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer`}
          >
            <Minus className={compact ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
          </button>

          {/* Number Input Box */}
          <div className="relative flex items-center">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={localVal}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              title="Click or press arrow keys to adjust stock"
              style={{ color: '#09090b', backgroundColor: '#ffffff' }}
              className={`${
                compact ? 'w-11 h-6 text-xs' : 'w-14 h-7 text-xs'
              } text-center font-bold text-zinc-900 border-0 focus:outline-none focus:bg-amber-50/30 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            />

            {/* Micro Checkmark Success Flash */}
            {showSavedFeedback && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-75 z-10">
                <Check className="w-2.5 h-2.5 stroke-[2.5]" />
              </span>
            )}
          </div>

          {/* Increment Button */}
          <button
            type="button"
            onClick={() => handleStep(1)}
            disabled={currentNum >= max}
            title="Increase stock (+1)"
            className={`${
              compact ? 'w-6 h-6' : 'w-7 h-7'
            } flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 text-zinc-700 font-bold border-l border-zinc-200/90 transition disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer`}
          >
            <Plus className={compact ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
          </button>
        </div>

        {/* Quick Add Pills */}
        {showQuickPills && (
          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleStep(5)}
              title="Quick Add +5 units"
              className="px-2 py-1 rounded-md text-[11px] font-bold bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-300 shadow-2xs transition cursor-pointer active:scale-95"
            >
              +5
            </button>
            <button
              type="button"
              onClick={() => handleStep(10)}
              title="Quick Add +10 units"
              className="px-2 py-1 rounded-md text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs transition cursor-pointer active:scale-95"
            >
              +10
            </button>
          </div>
        )}

        {/* Right Badge if selected */}
        {badgePosition === 'right' && renderBadge()}
      </div>

      {badgePosition === 'bottom' && renderBadge()}
    </div>
  );
}
