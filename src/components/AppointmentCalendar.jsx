import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ChevronDown, Check } from 'lucide-react';

export default function AppointmentCalendar({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse initial selected date
  const parseDate = (val) => {
    if (!val) return new Date();
    const parts = val.split('-');
    if (parts.length === 3) {
      return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }
    return new Date();
  };

  const selectedDateObj = parseDate(value);
  const [viewDate, setViewDate] = useState(selectedDateObj);

  // Keep viewDate in sync when value changes externally
  useEffect(() => {
    setViewDate(parseDate(value));
  }, [value]);

  // Click outside listener to close calendar
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0 - 11

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(year, month + 1, 1));
  };

  // Calendar calculations (Monday as start of week)
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const handleSelectDay = (day) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const newDateStr = `${year}-${formattedMonth}-${formattedDay}`;
    onChange(newDateStr);
    setIsOpen(false);
  };

  const handleQuickShortcut = (offsetDays) => {
    const target = new Date();
    target.setDate(target.getDate() + offsetDays);
    const y = target.getFullYear();
    const m = String(target.getMonth() + 1).padStart(2, '0');
    const d = String(target.getDate()).padStart(2, '0');
    const newDateStr = `${y}-${m}-${d}`;
    onChange(newDateStr);
    setViewDate(target);
    setIsOpen(false);
  };

  // Formatter for display
  const formatDisplay = (val) => {
    if (!val) return 'Select Date';
    const parts = val.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
    return val;
  };

  const isDaySelected = (day) => {
    if (!value) return false;
    const parts = value.split('-');
    if (parts.length === 3) {
      return (
        parseInt(parts[0], 10) === year &&
        parseInt(parts[1], 10) - 1 === month &&
        parseInt(parts[2], 10) === day
      );
    }
    return false;
  };

  const isToday = (day) => {
    const now = new Date();
    return (
      now.getFullYear() === year &&
      now.getMonth() === month &&
      now.getDate() === day
    );
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      
      {/* Interactive Trigger Button (Replaces ugly native date input) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3.5 py-2.5 rounded-xl border transition-all flex items-center justify-between text-left cursor-pointer ${
          isOpen 
            ? 'border-[#20b2aa] ring-2 ring-[#20b2aa]/20 bg-teal-50/30' 
            : 'border-slate-300 hover:border-slate-400 bg-white'
        }`}
        aria-label="Choose Appointment Date"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200/80 text-[#00473e] flex items-center justify-center shrink-0">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <span className="block text-xs sm:text-sm font-bold text-slate-800">
              {formatDisplay(value)}
            </span>
          </div>
        </div>

        <ChevronDown 
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#20b2aa]' : ''
          }`} 
        />
      </button>

      {/* Custom Modern Dropdown Calendar Popover */}
      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 z-50 w-full sm:w-[310px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 text-slate-900 animate-fadeIn">
          
          {/* Calendar Month & Navigation Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
              {monthNames[month]} {year}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Date Shortcuts */}
          <div className="flex gap-1.5 py-2.5 border-b border-slate-100 overflow-x-auto">
            <button
              type="button"
              onClick={() => handleQuickShortcut(0)}
              className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-600 transition-colors shrink-0"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => handleQuickShortcut(1)}
              className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-600 transition-colors shrink-0"
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => handleQuickShortcut(7)}
              className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-600 transition-colors shrink-0"
            >
              +1 Week
            </button>
          </div>

          {/* Weekday Names */}
          <div className="grid grid-cols-7 gap-1 text-center py-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            <div>MO</div>
            <div>TU</div>
            <div>WE</div>
            <div>TH</div>
            <div>FR</div>
            <div>SA</div>
            <div>SU</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {/* Trailing Days of Previous Month */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div 
                key={`prev-${i}`} 
                className="w-8 h-8 mx-auto flex items-center justify-center text-slate-300 text-[11px] select-none"
              >
                {daysInPrevMonth - firstDayOfWeek + i + 1}
              </div>
            ))}

            {/* Current Month Days */}
            {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
              const dayNum = i + 1;
              const selected = isDaySelected(dayNum);
              const today = isToday(dayNum);

              return (
                <button
                  key={`cur-${dayNum}`}
                  type="button"
                  onClick={() => handleSelectDay(dayNum)}
                  className={`w-8 h-8 mx-auto rounded-xl flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                    selected
                      ? 'bg-[#00473e] text-white shadow-md shadow-[#00473e]/30 font-black'
                      : today
                      ? 'border border-[#20b2aa] text-[#00473e] font-black bg-teal-50/40 hover:bg-teal-50'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Footer with Clear & Done */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">
              Abu Dhabi Local Time
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="font-bold text-[#00473e] hover:underline cursor-pointer"
            >
              Done
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
