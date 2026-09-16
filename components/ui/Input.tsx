import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export default function Input({
  label,
  error,
  hint,
  id,
  className = '',
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-sand-300"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          h-12 px-4 rounded-xl
          bg-charcoal-800 text-sand-100
          border border-charcoal-700
          placeholder:text-charcoal-500
          focus:outline-none focus:ring-2 focus:ring-sand-400/30 focus:border-sand-400
          transition-all duration-150
          disabled:opacity-40 disabled:cursor-not-allowed
          ${error ? 'border-danger-400 focus:ring-danger-400/30 focus:border-danger-400' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-xs text-danger-400 mt-0.5">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-charcoal-500 mt-0.5">{hint}</p>
      )}
    </div>
  );
}
