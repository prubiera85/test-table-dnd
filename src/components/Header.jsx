import React from 'react';
import Button from './Button/Button';
import { PlusIcon } from './Icons';

/**
 * Header component with actions for the content table
 * @param {Object} props - Component props
 * @param {Function} props.onCreateFolder - Function to handle folder creation
 */
const Header = ({ onCreateFolder }) => {
  return (
    <div className="mb-6 flex justify-end">
      <Button
        onClick={onCreateFolder}
        className="flex items-center gap-2"
      >
        <PlusIcon size={16} />
        Nueva carpeta
      </Button>
    </div>
  );
};

export default Header;
