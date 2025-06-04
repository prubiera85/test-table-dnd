import React from 'react';
import { classNames } from '../../utils/classNames';
import './Button.scss';

/**
 * Button component with multiple variants
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {'primary'|'secondary'|'danger'|'success'|'warning'|'icon'|'close'} props.variant - Button style variant
 * @param {'button'|'submit'|'reset'} props.type - Button type
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {boolean} props.loading - Whether button is in loading state
 * @param {'sm'|'md'|'lg'} props.size - Button size
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.ariaLabel - Accessibility label
 * @param {Object} props.rest - Additional props
 */
const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  loading = false,
  size = 'md',
  onClick,
  className = '',
  ariaLabel,
  ...rest
}) => {
  const baseClasses = 'btn';

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    success: 'btn-success',
    warning: 'btn-warning',
    icon: 'btn-icon',
    close: 'btn-close'
  };

  const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg'
  };

  const buttonClasses = classNames(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    {
      'btn-loading': loading,
      'btn-disabled': disabled
    },
    className
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
      {...rest}
    >
      {loading ? (
        <div className="btn-spinner">
          <div className="spinner"></div>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
