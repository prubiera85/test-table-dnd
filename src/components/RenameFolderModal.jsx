import React, { useState, useEffect } from 'react';
import Modal from './Modal/Modal';
import Button from './Button/Button';

/**
 * Modal for renaming an existing folder
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onSubmit - Function called when form is submitted
 * @param {Object} props.folder - Folder object to rename
 * @param {boolean} props.isLoading - Whether the form is in loading state
 */
const RenameFolderModal = ({
  isOpen,
  onClose,
  onSubmit,
  folder,
  isLoading = false
}) => {
  const [folderName, setFolderName] = useState('');

  // Update form when folder changes
  useEffect(() => {
    if (folder) {
      setFolderName(folder.name);
    }
  }, [folder]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFolderName('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (folderName.trim() && folder) {
      onSubmit(folder.id, folderName.trim());
    }
  };

  const contentCount = folder?.contents?.length || 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Renombrar carpeta"
      size="md"
    >
      {folder && (
        <>
          <div className="delete-modal-folder-info">
            <div>
              <h4>{folder.name}</h4>
              <p>{contentCount} elemento{contentCount !== 1 ? 's' : ''}</p>
            </div>
          </div>

          <div className="modal-intro">
            <p>
              Ingresa el nuevo nombre para esta carpeta. El contenido se mantendrá intacto.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="modal-form">
            <div className="modal-form-group">
              <label htmlFor="folder-name" className="modal-form-label">
                Nuevo nombre
              </label>
              <input
                id="folder-name"
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Ingresa el nuevo nombre"
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
                disabled={!folderName.trim() || folderName.trim() === folder.name}
              >
                Renombrar
              </Button>
            </div>
          </form>
        </>
      )}
    </Modal>
  );
};

export default RenameFolderModal;
