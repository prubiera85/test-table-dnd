import React, { useState, useEffect } from 'react';
import Modal from './Modal/Modal';
import Button from './Button/Button';

/**
 * Modal for deleting a folder with content handling options
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onSubmit - Function called when deletion is confirmed
 * @param {Object} props.folder - Folder object to delete
 * @param {boolean} props.isLoading - Whether the form is in loading state
 */
const DeleteFolderModal = ({
  isOpen,
  onClose,
  onSubmit,
  folder,
  isLoading = false
}) => {
  const [deleteOption, setDeleteOption] = useState('move');

  // Reset option when modal opens
  useEffect(() => {
    if (isOpen) {
      setDeleteOption('move');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (folder) {
      onSubmit(folder.id, deleteOption);
    }
  };

  const contentCount = folder?.contents?.length || 0;
  const hasContent = contentCount > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Eliminar carpeta"
      size="md"
    >
      {folder && (
        <>
          <div className="delete-modal-warning">
            <h4>⚠️ Acción irreversible</h4>
            <p>
              Vas a eliminar la carpeta "{folder.name}". Esta acción no se puede deshacer.
            </p>
          </div>

          <div className="delete-modal-folder-info">
            <div>
              <h4>📁 {folder.name}</h4>
              <p>{contentCount} elemento{contentCount !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {hasContent && (
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="modal-form-group">
                <label className="modal-form-label">
                  ¿Qué hacer con el contenido?
                </label>

                <div className="delete-modal-options">
                  <label
                    className="delete-option"
                    htmlFor="move-option"
                  >
                    <input
                      id="move-option"
                      type="radio"
                      name="deleteOption"
                      value="move"
                      checked={deleteOption === 'move'}
                      onChange={(e) => setDeleteOption(e.target.value)}
                      disabled={isLoading}
                    />
                    <div className="delete-option-content">
                      <h5>Mover contenido sin asignar</h5>
                      <p>
                        Se eliminará solo la carpeta, el contenido se moverá a la sección "Sin asignar"
                      </p>
                    </div>
                  </label>

                  <label
                    className="delete-option"
                    htmlFor="delete-option"
                  >
                    <input
                      id="delete-option"
                      type="radio"
                      name="deleteOption"
                      value="delete"
                      checked={deleteOption === 'delete'}
                      onChange={(e) => setDeleteOption(e.target.value)}
                      disabled={isLoading}
                    />
                    <div className="delete-option-content">
                      <h5>Eliminar todo el contenido</h5>
                      <p>
                        Se eliminará la carpeta y todo su contenido permanentemente
                      </p>
                    </div>
                  </label>
                </div>
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
                  variant="danger"
                  type="submit"
                  loading={isLoading}
                >
                  Eliminar carpeta
                </Button>
              </div>
            </form>
          )}

          {!hasContent && (
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="modal-intro">
                <p>
                  Esta carpeta está vacía y se puede eliminar sin afectar ningún contenido.
                </p>
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
                  variant="danger"
                  type="submit"
                  loading={isLoading}
                >
                  Eliminar carpeta vacía
                </Button>
              </div>
            </form>
          )}
        </>
      )}
    </Modal>
  );
};

export default DeleteFolderModal;
