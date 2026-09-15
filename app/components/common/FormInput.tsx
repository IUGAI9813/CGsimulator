import React from 'react';
import { UseFormRegister, FieldErrors, Path } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';

export interface FormInputProps<T extends Record<string, any>> {
  name: Path<T>;
  label: string;
  type?: 'text' | 'number';
  placeholder?: string;
  step?: string | number;
  min?: number;
  max?: number;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  validation?: Record<string, any>;
  className?: string;
}

export function FormInput<T extends Record<string, any>>({
  name,
  label,
  type = 'text',
  placeholder,
  step,
  min,
  max,
  register,
  errors,
  validation,
  className = '',
}: FormInputProps<T>) {
  const error = errors[name];

  return (
    <div className={className}>
      <label className="text-[11px] font-mono text-[var(--muted-text)] block mb-1">
        {label}
      </label>
      <input
        {...register(name, {
          ...(type === 'number' ? { valueAsNumber: true } : {}),
          ...validation,
        })}
        type={type}
        step={step}
        min={min}
        max={max}
        placeholder={placeholder}
        className={`w-full px-3 py-1.5 rounded bg-[var(--input-bg)] border text-xs font-mono text-[var(--foreground)] focus:outline-none transition-colors ${
          error
            ? 'border-brand-rose focus:border-brand-rose'
            : 'border-[var(--input-border)] focus:border-brand-cyan'
        }`}
      />
      {error && (
        <p className="text-[10px] text-brand-rose font-mono mt-0.5 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{error.message as string}</span>
        </p>
      )}
    </div>
  );
}
