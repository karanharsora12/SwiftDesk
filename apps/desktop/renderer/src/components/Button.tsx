import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'icon' | 'custom';
  ripple?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'custom', ripple = true, children, ...props }, ref) => {
    void ripple;
    let variantClass = '';
    switch (variant) {
      case 'primary':
        variantClass = 'primary-button';
        break;
      case 'secondary':
        variantClass = 'secondary-button';
        break;
      case 'danger':
        variantClass = 'danger-button';
        break;
      case 'success':
        variantClass = 'success-button';
        break;
      case 'icon':
        variantClass = 'icon-button';
        break;
      case 'custom':
      default:
        variantClass = '';
        break;
    }

    return (
      <button
        ref={ref}
        className={[variantClass, className].filter(Boolean).join(' ')}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';