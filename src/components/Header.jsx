import React from 'react';
import Button from './Button';
import { PlusIcon } from './Icons';
import './Header.scss';

/**
 * Header component with actions for the content table
 * @param {Object} props - Component props
 * @param {Function} props.onCreateFolder - Function to handle folder creation
 */
const Header = ({ onCreateFolder }) => {
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__actions">
          <Button
            onClick={onCreateFolder}
            className="header__create-button"
          >
            <PlusIcon size={16} />
            Nueva carpeta
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
