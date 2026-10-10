import React from 'react';

export function TextInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  required = false,
  disabled = false,
  hint,
  icon: Icon = null,
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-zinc-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          style={{ color: '#09090b', backgroundColor: '#ffffff' }}
          className={`w-full ${Icon ? 'pl-9' : 'px-3'} py-2 bg-white border ${
            error ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-zinc-300 hover:border-zinc-400 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950'
          } rounded-lg text-xs font-normal text-zinc-900 placeholder:text-zinc-400 focus:outline-none transition-colors disabled:opacity-50 admin-input-control`}
        />
      </div>
      {hint && !error && <p className="text-[11px] text-zinc-500">{hint}</p>}
      {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
    </div>
  );
}

export function SelectInput({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  required = false,
  disabled = false,
  hint,
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-zinc-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value ?? ''}
        onChange={onChange}
        disabled={disabled}
        style={{ color: '#09090b', backgroundColor: '#ffffff' }}
        className={`w-full px-3 py-2 bg-white border ${
          error ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-zinc-300 hover:border-zinc-400 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950'
        } rounded-lg text-xs font-normal text-zinc-900 focus:outline-none transition-colors disabled:opacity-50 appearance-none cursor-pointer admin-input-control`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white text-zinc-900">
            {opt.label}
          </option>
        ))}
      </select>
      {hint && !error && <p className="text-[11px] text-zinc-500">{hint}</p>}
      {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
    </div>
  );
}

export function TextareaInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  error,
  required = false,
  disabled = false,
  hint,
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-zinc-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <textarea
        name={name}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        style={{ color: '#09090b', backgroundColor: '#ffffff' }}
        className={`w-full px-3 py-2 bg-white border ${
          error ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-zinc-300 hover:border-zinc-400 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950'
        } rounded-lg text-xs font-normal text-zinc-900 placeholder:text-zinc-400 focus:outline-none transition-colors disabled:opacity-50 resize-y admin-input-control`}
      />
      {hint && !error && <p className="text-[11px] text-zinc-500">{hint}</p>}
      {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
    </div>
  );
}

export function ToggleSwitch({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200/80 rounded-lg">
      <div>
        <span className="text-xs font-semibold text-zinc-900 block">{label}</span>
        {description && <span className="text-[11px] text-zinc-500 block">{description}</span>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? 'bg-zinc-950' : 'bg-zinc-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

export function CurrencyInput({
  label,
  name,
  valueFils,
  onChangeFils,
  error,
  required = false,
  currency = 'AED',
}) {
  const valueAed = valueFils ? (valueFils / 100).toFixed(2) : '';

  const handleChange = (e) => {
    const val = e.target.value;
    if (val === '') {
      onChangeFils(0);
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num)) {
      onChangeFils(Math.round(num * 100));
    }
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-zinc-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-400 pointer-events-none">
          {currency}
        </span>
        <input
          type="number"
          step="0.01"
          min="0"
          name={name}
          value={valueAed}
          onChange={handleChange}
          placeholder="0.00"
          style={{ color: '#09090b', backgroundColor: '#ffffff' }}
          className={`w-full pl-12 pr-3 py-2 bg-white border ${
            error ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-zinc-300 hover:border-zinc-400 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950'
          } rounded-lg text-xs font-normal text-zinc-900 placeholder:text-zinc-400 focus:outline-none transition-colors admin-input-control`}
        />
      </div>
      {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
    </div>
  );
}
