import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatsCard({
  title,
  value,
  trend = null, // e.g. { direction: 'up' | 'down' | 'neutral', value: '+12.5%', label: 'vs last month' }
  icon: Icon = null,
  accentColor = 'blue',
  subtext = null,
  onClick = null,
}) {
  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-xl bg-white border border-zinc-200/80 transition-colors duration-150 ${
        onClick ? 'cursor-pointer hover:border-zinc-400' : 'hover:border-zinc-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">{title}</p>
          <p className="text-2xl font-semibold text-zinc-900 tracking-tight">{value}</p>
        </div>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4 stroke-[1.75]" />
          </div>
        )}
      </div>

      {(trend || subtext) && (
        <div className="mt-3.5 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
          {trend && (
            <div className="flex items-center gap-1.5">
              {trend.direction === 'up' && (
                <span className="inline-flex items-center text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px] font-medium border border-emerald-200/60">
                  <TrendingUp className="w-3 h-3 mr-1 text-emerald-600" />
                  {trend.value}
                </span>
              )}
              {trend.direction === 'down' && (
                <span className="inline-flex items-center text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded text-[11px] font-medium border border-rose-200/60">
                  <TrendingDown className="w-3 h-3 mr-1 text-rose-600" />
                  {trend.value}
                </span>
              )}
              {trend.direction === 'neutral' && (
                <span className="inline-flex items-center text-zinc-700 bg-zinc-100 px-1.5 py-0.5 rounded text-[11px] font-medium border border-zinc-200">
                  <Minus className="w-3 h-3 mr-1" />
                  {trend.value}
                </span>
              )}
              {trend.label && <span className="text-zinc-400 text-[11px] font-normal">{trend.label}</span>}
            </div>
          )}
          {subtext && <span className="text-zinc-400 text-[11px] font-normal">{subtext}</span>}
        </div>
      )}
    </div>
  );
}
