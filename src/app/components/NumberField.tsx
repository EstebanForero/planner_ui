"use client";
import React from 'react';
import { labelClass } from '@/lib/ui';

type Props = {
  label?: string;
  value: number | string;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  className?: string;
};

const NumberField = ({ label, value, onChange, min, max, step = 1, placeholder, className }: Props) => {
  const numericValue = typeof value === 'string' ? Number(value || 0) : value;

  const clamp = (n: number) => {
    let result = n;
    if (min !== undefined) result = Math.max(min, result);
    if (max !== undefined) result = Math.min(max, result);
    return result;
  };

  return (
    <div className="flex flex-col gap-1">
      {label && <label className={labelClass}>{label}</label>}
      <div className={`flex items-stretch rounded-lg bg-zinc-950 border border-zinc-700 overflow-hidden
        focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-transparent transition ${className ?? ''}`}>
        <button type="button" tabIndex={-1}
          className="px-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition disabled:opacity-30 disabled:hover:bg-transparent"
          disabled={min !== undefined && numericValue <= min}
          onClick={() => onChange(clamp(numericValue - step))}
        >−</button>
        <input
          type="number"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="w-full min-w-0 bg-transparent text-white text-center px-1 py-2 placeholder:text-zinc-500
            focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button type="button" tabIndex={-1}
          className="px-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition disabled:opacity-30 disabled:hover:bg-transparent"
          disabled={max !== undefined && numericValue >= max}
          onClick={() => onChange(clamp(numericValue + step))}
        >+</button>
      </div>
    </div>
  );
};

export default NumberField;
