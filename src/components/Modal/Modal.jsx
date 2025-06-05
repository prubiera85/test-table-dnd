import React, { useEffect } from 'react';
import clsx from 'clsx';
import Button from '../Button';
import { XIcon } from '../Icons';
import './Modal.scss';

/**
 * Generic modal component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.size - Modal size ('sm', 'md', 'lg')
 * @param {boolean} props.closeOnOverlayClick - Whether to close on overlay click (default: true)
 * @param {boolean} props.closeOnEscape - Whether to close on escape key (default: true)
 * @param {boolean} props.showCloseButton - Whether to show close button (default: true)
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
}) => {
  // Handle escape key press
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <div
          className={clsx('modal-content', `modal-${size}`)}
          onClick={(e) => e.stopPropagation()}
        >
          {(title || showCloseButton) && (
            <div className="modal-header">
              {title && <h3 className="modal-title">{title}</h3>}
              {showCloseButton && (
                <Button
                  variant="icon"
                  onClick={onClose}
                  className="modal-close-button"
                  ariaLabel="Close modal"
                >
                  <XIcon size={20} />
                </Button>
              )}
            </div>
          )}

          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
