import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-forest-500 text-sand-100 hover:bg-forest-400 active:bg-forest-600 border-forest-600',
  secondary:
    'bg-charcoal-800 text-sand-100 hover:bg-charcoal-700 active:bg-charcoal-600 border-charcoal-700',
  ghost:
    'bg-transparent text-sand-300 hover:bg-charcoal-800 active:bg-charcoal-700 border-transparent',
  danger:
    'bg-danger-500 text-white hover:bg-danger-400 active:bg-danger-500 border-danger-500',
  accent:
    'bg-sand-400 text-charcoal-950 hover:bg-sand-500 active:bg-sand-400 border-sand-500 font-bold',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm rounded-lg gap-1.5',
  md: 'h-11 px-5 text-sm rounded-xl gap-2',
  lg: 'h-[52px] px-6 text-base rounded-xl gap-2.5',
  xl: 'h-[60px] px-8 text-lg rounded-2xl gap-3',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-semibold
        border transition-all duration-150 ease-out
        disabled:opacity-40 disabled:cursor-not-allowed
        active:scale-[0.97]
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
