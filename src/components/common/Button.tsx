import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', fullWidth = false, isLoading = false, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    // Base classes
    const baseClasses = "inline-flex items-center justify-center font-bold tracking-tight transition-all duration-200 active:scale-[0.98] active:translate-y-[1px] disabled:opacity-50 disabled:pointer-events-none outline-none";
    
    // Size classes
    const sizes = {
      sm: "py-2 px-4 rounded-xl text-[13px]",
      md: "py-3.5 px-6 rounded-2xl text-[15px]",
      lg: "py-4.5 px-8 rounded-[20px] text-[17px]"
    };
    
    // Width
    const widthClass = fullWidth ? "w-full" : "";

    // Variant classes
    const variants = {
      primary: "bg-primary text-white hover:bg-primary-dark",
      secondary: "bg-primary-light text-primary-dark hover:bg-primary/10",
      danger: "bg-danger text-white hover:bg-red-600",
      success: "bg-success text-white hover:bg-success-dark",
      warning: "bg-warning text-white hover:bg-warning-dark",
      outline: "bg-transparent text-text border border-stroke hover:border-stroke-medium hover:bg-bg",
      ghost: "bg-transparent text-text hover:bg-bg"
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseClasses, sizes[size], variants[variant], widthClass, className)}
        {...props}
      >
        {isLoading && <Loader2 size={18} className="animate-spin mr-2" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
