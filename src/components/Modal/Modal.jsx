import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../utils/classNames';
import { XIcon } from '../Icons';
import Button from '../Button/Button';
import './Modal.scss';

/**
 * Reusable Modal component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.size - Modal size ('sm', 'md', 'lg')
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className={classNames('modal-content', `modal-${size}`)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <Button
            variant="close"
            onClick={onClose}
            ariaLabel="Close modal"
          >
            <XIcon size={20} />
          </Button>
        </div>

        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );

  // Render modal at the end of body using portal
  return createPortal(modalContent, document.body);
};

export default Modal;
