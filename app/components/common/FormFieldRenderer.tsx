import React from 'react';
import { UseFormRegister, FieldErrors, Path } from 'react-hook-form';
import { FormInput } from './FormInput';
import { FormSelect, SelectOption } from './FormSelect';

export type FieldType = 'text' | 'number' | 'select';

export interface FieldConfig<T extends Record<string, any>> {
  name: Path<T>;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: SelectOption[];
  step?: string | number;
  min?: number;
  max?: number;
  validation?: Record<string, any>;
  className?: string;
}

interface FormFieldRendererProps<T extends Record<string, any>> {
  field: FieldConfig<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

/**
 * Switch/case field renderer that dynamically outputs the appropriate input/select component based on field type
 */
export function FormFieldRenderer<T extends Record<string, any>>({
  field,
  register,
  errors,
}: FormFieldRendererProps<T>) {
  switch (field.type) {
    case 'select':
      return (
        <FormSelect<T>
          name={field.name}
          label={field.label}
          options={field.options || []}
          register={register}
          errors={errors}
          validation={field.validation}
          className={field.className}
        />
      );

    case 'number':
    case 'text':
    default:
      return (
        <FormInput<T>
          name={field.name}
          label={field.label}
          type={field.type === 'number' ? 'number' : 'text'}
          placeholder={field.placeholder}
          step={field.step}
          min={field.min}
          max={field.max}
          register={register}
          errors={errors}
          validation={field.validation}
          className={field.className}
        />
      );
  }
}
