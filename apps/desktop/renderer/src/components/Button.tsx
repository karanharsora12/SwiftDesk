import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'icon' | 'custom';
  ripple?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'custom', ripple = true, children, ...props }, ref) => {
    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!ripple || props.disabled) return;

      const host = e.currentTarget;
      const rect = host.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const rippleEl = document.createElement("span");
      rippleEl.className = "ripple-effect";
      rippleEl.style.width = `${size}px`;
      rippleEl.style.height = `${size}px`;
      rippleEl.style.left = `${e.clientX - rect.left - size / 2}px`;
      rippleEl.style.top = `${e.clientY - rect.top - size / 2}px`;
      host.appendChild(rippleEl);
      rippleEl.addEventListener("animationend", () => rippleEl.remove());
    };

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

    const combinedClassName = [variantClass, className].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        className={combinedClassName}
        onPointerDown={handlePointerDown}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
