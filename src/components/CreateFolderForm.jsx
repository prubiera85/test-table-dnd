import React, { useState } from 'react';
import { PlusIcon } from './Icons';
import Button from './Button/Button';

/**
 * Component for creating new folders
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Function to create a new folder
 * @param {Function} props.onCancel - Function to cancel folder creation
 */
const CreateFolderForm = ({ onSubmit, onCancel }) => {
  const [folderName, setFolderName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    setIsLoading(true);
    try {
      await onSubmit(folderName.trim());
      setFolderName('');
    } catch (error) {
      console.error('Error creating folder:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFolderName('');
    onCancel();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="create-folder-form">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Nombre de la carpeta"
          className="form-input text-sm"
          autoFocus
          disabled={isLoading}
          minLength={1}
          maxLength={50}
        />

        <div className="folder-form-actions">
          <Button
            variant="success"
            type="submit"
            loading={isLoading}
            disabled={!folderName.trim()}
          >
            Crear
          </Button>
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateFolderForm;
