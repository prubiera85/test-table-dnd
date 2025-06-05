import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { ExpandIcon, EditIcon, DeleteIcon } from '../../Icons';
import { classNames } from '../../../utils/classNames';
import Button from '../../Button';
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
      className={classNames(
        'folder-row',
        'folder-row--clickable',
        isOver && 'folder-row--drag-over'
      )}
    >
      <td className="folder-row__cell">
        <div className="folder-row__container">
          <Button
            variant="icon"
            onClick={(e) => handleActionClick(e, onToggle)}
            ariaLabel={isExpanded ? 'Collapse folder' : 'Expand folder'}
            className="folder-row__expand-button"
          >
            <ExpandIcon isExpanded={isExpanded} size={16} />
          </Button>

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
          <Button
            variant="icon"
            onClick={(e) => handleActionClick(e, onRename)}
            ariaLabel="Rename folder"
            className="folder-row__action-button"
          >
            <EditIcon size={14} />
          </Button>

          <Button
            variant="icon"
            onClick={(e) => handleActionClick(e, onDelete)}
            className="folder-row__action-button folder-row__action-button--danger"
            ariaLabel="Delete folder"
          >
            <DeleteIcon size={14} />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default FolderRow;
