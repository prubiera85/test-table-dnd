import clsx from 'clsx';
import './Button.scss';

/**
 * Reusable Button component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - Button variant ('primary', 'secondary', 'danger', 'icon')
 * @param {string} props.size - Button size ('sm', 'md', 'lg')
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {boolean} props.loading - Whether the button is in loading state
 * @param {string} props.type - Button type ('button', 'submit', 'reset')
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 * @param {string} props.ariaLabel - Aria label for accessibility
 * @param {Object} props.rest - Additional props
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
  onClick,
  ariaLabel,
  ...rest
}) => {
  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const buttonClasses = clsx(
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    {
      'btn-disabled': disabled,
      'btn-loading': loading,
    },
    className
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      {...rest}
    >
      {loading && (
        <div className="btn-spinner">
          <div className="spinner"></div>
        </div>
      )}
      {!loading && children}
    </button>
  );
};

export default Button;
