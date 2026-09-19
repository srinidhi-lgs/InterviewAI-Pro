import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  isLoading?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'default',
  isLoading = false, 
  className = '', 
  disabled, 
  ...props 
}: ButtonProps) {
  
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    primary: "bg-zinc-950 text-white hover:bg-zinc-800 focus:ring-zinc-950 dark:bg-white dark:text-black dark:hover:bg-zinc-200",
    secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus:ring-zinc-500 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700",
    outline: "border border-zinc-200 bg-transparent hover:bg-zinc-100 focus:ring-zinc-500 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:text-zinc-100"
  };

  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-8 text-base"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}
