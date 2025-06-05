import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';
import './FolderRow.scss';

/**
 * Component for rendering a folder row in the table
 * @param {Object} props - Component props
 * @param {Object} props.folder - Folder data
 * @param {boolean} props.isExpanded - Whether the folder is expanded
 * @param {Function} props.onToggle - Function to toggle folder expansion
 * @param {Function} props.onRename - Function to open rename modal
 * @param {Function} props.onDelete - Function to open delete modal
 */
const FolderRow = ({
  folder,
  isExpanded,
  onToggle,
  onRename,
  onDelete,
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: folder.id,
  });

  const handleRowClick = () => {
    onToggle();
  };

  const handleActionClick = (event, action) => {
    event.stopPropagation(); // Evitar que se active el toggle de la fila
    action();
  };

  return (
    <tr
      ref={setNodeRef}
      onClick={handleRowClick}
      className={clsx(
        'folder-row',
        'folder-row--clickable',
        isOver && 'folder-row--drag-over'
      )}
    >
      <td className="folder-row__cell">
        <div className="folder-row__container">
          <span
            className="folder-row__expand-text"
            onClick={(e) => handleActionClick(e, onToggle)}
          >
            {isExpanded ? '−' : '+'}
          </span>

          <span className="folder-row__title">{folder.name}</span>

          {folder.contents && folder.contents.length > 0 && (
            <span className="folder-row__count">
              ({folder.contents.length})
            </span>
          )}
        </div>
      </td>

      <td className="folder-row__cell">
        {/* Sin disponibilidad para carpetas */}
      </td>

      <td className="folder-row__cell">
        {/* Sin propietario para carpetas */}
      </td>

      <td className="folder-row__cell folder-row__cell--actions">
        <div className="folder-row__actions">
          <span
            className="folder-row__action-text"
            onClick={(e) => handleActionClick(e, onRename)}
          >
            edit
          </span>

          <span
            className="folder-row__action-text folder-row__action-text--danger"
            onClick={(e) => handleActionClick(e, onDelete)}
          >
            del
          </span>
        </div>
      </td>
    </tr>
  );
};

export default FolderRow;
