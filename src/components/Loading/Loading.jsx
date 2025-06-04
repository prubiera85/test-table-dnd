import React from 'react';
import './Loading.scss';

/**
 * Loading component with orange spinner
 * @param {Object} props - Component props
 * @param {string} props.message - Loading message to display
 * @param {string} props.size - Size of the spinner (sm, md, lg)
 * @param {boolean} props.fullScreen - Whether to show full screen loading
 */
const Loading = ({
  message = "Cargando contenido...",
  size = "md",
  fullScreen = false
}) => {
  const containerClass = fullScreen
    ? "loading-container-fullscreen"
    : "loading-container";

  return (
    <div className={containerClass}>
      <div className="loading-content">
        <div className={`loading-spinner loading-spinner-${size}`}>
          <div className="spinner-ring"></div>
        </div>
        {message && (
          <p className="loading-message">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Loading;
