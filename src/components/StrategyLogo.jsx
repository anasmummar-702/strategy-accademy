import React from 'react';

/**
 * StrategyLogo - Official brand logo component
 * Features:
 * - Geometric angular stylized lightning 'S' emblem in electric sports blue (#2563eb / #1d4ed8)
 * - Tightly locked with bold condensed italic "TRATEGY" text with zero awkward gap
 * - Clean, responsive, and vector-rendered
 */
export function StrategyIcon({ className = "w-7 h-8", blueColor = "#2563eb", bevelColor = "#1e40af" }) {
  return (
    <svg 
      viewBox="14 10 70 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 drop-shadow-sm ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="strategyIconBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor={blueColor} />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="strategyIconBevelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={bevelColor} />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      {/* Outer stylized S polygon tightly cropped */}
      <path 
        d="M38 10 L82 10 L55 31 L84 49 L45 90 L53 55 L14 42 Z" 
        fill="url(#strategyIconBlueGrad)" 
      />
      {/* 3D bevel facet */}
      <path 
        d="M82 10 L55 31 L84 49 L45 90 L48 78 L72 48 L49 33 L74 13 Z" 
        fill="url(#strategyIconBevelGrad)" 
        opacity="0.5"
      />
    </svg>
  );
}

export default function StrategyLogo({ 
  variant = 'full', 
  size = 'md', 
  theme = 'auto', 
  className = '',
  onClick
}) {
  const sizeMap = {
    sm: { icon: 'h-5 w-auto', text: 'text-lg', gap: 'gap-0.5' },
    md: { icon: 'h-6 sm:h-7 w-auto', text: 'text-xl sm:text-2xl', gap: 'gap-0.5' },
    lg: { icon: 'h-7 sm:h-8 w-auto', text: 'text-2xl sm:text-3xl', gap: 'gap-0.5' },
    xl: { icon: 'h-9 sm:h-10 w-auto', text: 'text-3xl sm:text-4xl', gap: 'gap-1' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const textColorClass = 
    theme === 'dark' 
      ? 'text-white' 
      : theme === 'light' 
        ? 'text-slate-950' 
        : 'text-current';

  if (variant === 'icon') {
    return (
      <div 
        onClick={onClick} 
        className={`inline-flex items-center justify-center shrink-0 ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''} ${className}`}
      >
        <StrategyIcon className={currentSize.icon} />
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center ${currentSize.gap} shrink-0 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      <StrategyIcon 
        className={`${currentSize.icon} transition-transform duration-200 ${onClick ? 'group-hover:scale-105' : ''}`} 
      />
      <span 
        className={`font-['Oswald',sans-serif] ${currentSize.text} font-black italic uppercase tracking-wider leading-none transition-colors ${textColorClass} ${onClick ? 'group-hover:text-blue-500' : ''}`}
        style={{ letterSpacing: '0.02em', marginLeft: '-1px' }}
      >
        TRATEGY
      </span>
    </div>
  );
}
