import React from 'react';
import { ArrowRight } from 'lucide-react';

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function Welcome({ name, children }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-zinc-900">
        {greeting()}
        {name ? `, ${name.split(' ')[0]}` : ''} 👋
      </h2>
      <p className="text-base text-zinc-500 mt-1">{children}</p>
    </div>
  );
}

// Big clickable number card: "3 — New trial requests — Open →"
export function SummaryCard({ id, icon: Icon, value, label, hint, action, onClick, tone = 'zinc' }) {
  const tones = {
    zinc: 'bg-zinc-100 text-zinc-700',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };
  return (
    <button
      id={id}
      onClick={onClick}
      className="text-left bg-white border border-zinc-200 rounded-2xl p-5 hover:border-zinc-400 hover:shadow-sm transition group cursor-pointer flex flex-col"
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${tones[tone]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-3xl font-bold text-zinc-900 mt-4">{value}</p>
      <p className="text-base font-medium text-zinc-800 mt-0.5">{label}</p>
      {hint && <p className="text-sm text-zinc-500 mt-1">{hint}</p>}
      <span className="mt-4 pt-3 border-t border-zinc-100 text-sm font-medium text-zinc-900 flex items-center gap-1.5">
        {action}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </span>
    </button>
  );
}

export function QuickAction({ icon: Icon, label, onClick, primary = false }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${
        primary
          ? 'bg-zinc-900 text-white hover:bg-black'
          : 'bg-white border border-zinc-200 text-zinc-800 hover:border-zinc-400'
      }`}
    >
      <Icon className="w-[18px] h-[18px]" />
      <span>{label}</span>
    </button>
  );
}

export function Panel({ title, linkLabel, onLink, children }) {
  return (
    <section className="bg-white border border-zinc-200 rounded-2xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
        <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
        {linkLabel && (
          <button
            onClick={onLink}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            {linkLabel}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

export function EmptyRow({ icon: Icon, title, text }) {
  return (
    <div className="px-5 py-10 text-center">
      <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-500 flex items-center justify-center mx-auto">
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-base font-medium text-zinc-800 mt-3">{title}</p>
      {text && <p className="text-sm text-zinc-500 mt-1 max-w-sm mx-auto">{text}</p>}
    </div>
  );
}
