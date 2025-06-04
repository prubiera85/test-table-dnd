import React from 'react';
import './ErrorState.scss';

/**
 * Error state component for displaying errors
 * @param {Object} props - Component props
 * @param {string} props.message - Error message to display
 * @param {Function} props.onRetry - Optional retry function
 * @param {string} props.retryText - Text for retry button
 */
const ErrorState = ({
  message = "Error al cargar el contenido. Por favor, inténtalo de nuevo.",
  onRetry,
  retryText = "Reintentar"
}) => {
  return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-icon">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <p className="error-message">{message}</p>
        {onRetry && (
          <button className="error-retry-btn" onClick={onRetry}>
            {retryText}
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
