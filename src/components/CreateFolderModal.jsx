import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';

/**
 * Modal for creating a new folder
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onCreateFolder - Function called when form is submitted
 * @param {boolean} props.isLoading - Whether the form is in loading state
 */
const CreateFolderModal = ({
  isOpen,
  onClose,
  onCreateFolder,
  isLoading = false
}) => {
  const [folderName, setFolderName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (folderName.trim()) {
      onCreateFolder(folderName.trim());
      setFolderName(''); // Reset form
    }
  };

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setFolderName('');
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear nueva carpeta"
      size="md"
    >
      <div className="modal-intro">
        <p>
          Ingresa el nombre para la nueva carpeta. Podrás organizar tu contenido arrastrándolo hacia la carpeta una vez creada.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="modal-form">
        <div className="modal-form-group">
          <label htmlFor="folder-name" className="modal-form-label">
            Nombre de la carpeta
          </label>
          <input
            id="folder-name"
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Ej: Materiales de matemáticas"
            className="form-input"
            disabled={isLoading}
            autoFocus
            required
          />
        </div>

        <div className="modal-form-actions">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            disabled={!folderName.trim()}
          >
            Crear
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateFolderModal;
