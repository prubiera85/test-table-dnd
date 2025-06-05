import { useDraggable } from '@dnd-kit/core';
import { ContentIcon, DragIcon } from '../../Icons';
import { classNames } from '../../../utils/classNames';
import './ContentRow.scss';

/**
 * Component for rendering a content row in the table
 * @param {Object} props - Component props
 * @param {Object} props.content - Content data
 * @param {boolean} props.isInFolder - Whether the content is inside a folder
 * @param {boolean} props.canDrag - Whether the content can be dragged
 * @param {boolean} props.isDragging - External prop to indicate if this row is being dragged
 * @param {boolean} props.isPreview - Whether this is being rendered in a preview context
 */
const ContentRow = ({
  content,
  isInFolder = false,
  canDrag = true,
  isDragging: externalIsDragging = false,
  isPreview = false,
}) => {
  const draggableConfig = useDraggable({
    id: content.id,
    disabled: !canDrag || isPreview, // Disable dragging for preview
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: internalIsDragging,
  } = draggableConfig;

  // Use external isDragging prop or internal one
  const isDragging = externalIsDragging || internalIsDragging;

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging && !isPreview ? 0 : 1, // Hide original but not preview
    zIndex: internalIsDragging ? 1000 : 0,
    position: 'relative',
  };

  const getOwnerDisplay = (owner) => {
    const ownerMap = {
      'Editorial': { color: '#e91e63' }, // Pink más intenso como en la imagen
      'Admin. Escuela': { color: '#f44336' }, // Rojo como en la imagen
      'Yo': { color: '#2196f3' }, // Azul como en la imagen
    };

    return ownerMap[owner] || { color: '#6b7280' }; // gray
  };

  const ownerDisplay = getOwnerDisplay(content.owner);

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={classNames(
        'content-row',
        isInFolder && 'content-row--in-folder',
        isDragging && 'content-row--dragging'
      )}
    >
      <td className="content-row__cell">
        <div className="content-row__container">
          {canDrag && (
            <div
              className="content-row__drag-handle"
              {...attributes}
              {...listeners}
            >
              <DragIcon size={14} className="content-row__drag-icon" />
            </div>
          )}

          <div className={classNames(
            'content-row__icon-container',
            canDrag ? 'content-row__icon-container--with-drag' : 'content-row__icon-container--no-drag'
          )}>
            <ContentIcon type={content.type} size={16} className="content-row__icon" />
          </div>

          <span className="content-row__title">{content.title}</span>
        </div>
      </td>

      <td className="content-row__cell">
        <span className="content-row__availability">{content.availability}</span>
      </td>

      <td className="content-row__cell">
        <div className="content-row__owner">
          <div
            className="content-row__owner-circle"
            style={{ backgroundColor: ownerDisplay.color }}
            title={content.owner}
          ></div>
          <div className="content-row__owner-info">
            <div className="content-row__owner-name">{content.owner}</div>
            <div className="content-row__owner-date">{content.date}</div>
          </div>
        </div>
      </td>

      <td className="content-row__cell content-row__cell--actions">
        {/* Actions could be added here if needed */}
      </td>
    </tr>
  );
};

export default ContentRow;
