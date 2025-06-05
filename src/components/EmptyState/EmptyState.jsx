import React from 'react';
import Button from '../Button';
import './EmptyState.scss';

/**
 * EmptyState component to display when library has no content
 * @param {Object} props - Component props
 * @param {Function} props.onCreateFolder - Handler for creating a new folder
 * @returns {JSX.Element}
 */
export const EmptyState = ({ onCreateFolder }) => {
  return (
    <div className="empty-state">
      <div className="empty-state__content">
        <div className="empty-state__icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V8C22 6.89543 21.1046 6 20 6H12L10 4Z"
              stroke="#CBD5E0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="empty-state__title">No tienes contenido organizado</h3>
        <p className="empty-state__description">
          Crea tu primera carpeta para empezar a organizar tus recursos educativos
        </p>
        <Button
          variant="primary"
          onClick={onCreateFolder}
          className="empty-state__button"
        >
          Nueva carpeta
        </Button>
      </div>
    </div>
  );
};
