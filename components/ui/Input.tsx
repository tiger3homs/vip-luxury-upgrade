import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-xs uppercase font-bold tracking-widest text-brand-muted block">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-brand-black border p-4 text-white 
              focus:border-brand-yellow focus:outline-none transition-colors
              placeholder:text-brand-muted/50
              ${icon ? 'pl-12' : ''}
              ${error ? 'border-red-500' : 'border-white/20'}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="text-red-400 text-xs">{error}</p>}
        {hint && !error && <p className="text-brand-muted text-xs">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-xs uppercase font-bold tracking-widest text-brand-muted block">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full bg-brand-black border p-4 text-white 
            focus:border-brand-yellow focus:outline-none transition-colors
            placeholder:text-brand-muted/50 resize-none
            ${error ? 'border-red-500' : 'border-white/20'}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Select component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-xs uppercase font-bold tracking-widest text-brand-muted block">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`
            w-full bg-brand-black border p-4 text-white 
            focus:border-brand-yellow focus:outline-none transition-colors
            appearance-none cursor-pointer
            ${error ? 'border-red-500' : 'border-white/20'}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
