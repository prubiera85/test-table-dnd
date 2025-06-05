import React from "react";
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useDroppable,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

import FolderRow from "./components/FolderRow";
import ContentRow from "./components/ContentRow";
import './ContentTable.scss';

/**
 * Main table component for displaying hierarchical content
 * @param {Object} props - Component props
 * @param {Object} props.data - Table data with folders and unassignedContents
 * @param {Array} props.tableRows - Processed table rows
 * @param {Set} props.expandedFolders - Set of expanded folder IDs
 * @param {Function} props.onToggleFolderExpansion - Handler for toggling folder expansion
 * @param {Function} props.onMoveContent - Handler for moving content
 * @param {Function} props.onRenameFolder - Handler for renaming folders
 * @param {Function} props.onDeleteFolder - Handler for deleting folders
 * @returns {JSX.Element}
 */
const ContentTable = ({
  data,
  expandedFolders,
  onToggleFolderExpansion,
  onMoveContent,
  onRenameFolder,
  onDeleteFolder
}) => {
  // Drag overlay state
  const [activeItem, setActiveItem] = React.useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {})
  );

  const handleDragStart = (event) => {
    const { active } = event;

    // Find the content being dragged
    const draggedContent =
      data.unassignedContents.find((content) => content.id === active.id) ||
      data.folders
        .flatMap((folder) => folder.contents)
        .find((content) => content.id === active.id);

    setActiveItem(draggedContent);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    // Reset drag state
    setActiveItem(null);

    if (!over || active.id === over.id) {
      return;
    }

    // Find the content being dragged
    const activeContent =
      data.unassignedContents.find((content) => content.id === active.id) ||
      data.folders
        .flatMap((folder) => folder.contents)
        .find((content) => content.id === active.id);

    if (!activeContent) {
      return;
    }

    // Only allow drops on specific droppable areas
    // Check if dropping on a folder
    const targetFolder = data.folders.find((folder) => folder.id === over.id);

    if (targetFolder) {
      // Move content to folder
      onMoveContent(activeContent.id, targetFolder.id);
    } else if (over.id === 'unassigned-zone') {
      // Move content to unassigned (outside any folder) - only from the specific drop zone
      onMoveContent(activeContent.id, null);
    }
    // Ignore all other drops - do nothing if not dropping on a folder or the specific unassigned zone
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      <div className="content-table-container">
        <div className="content-table-wrapper">
          <table className="content-table">
            <thead>
              <tr>
                <th className="content-table__header content-table__header--first">Título del recurso</th>
                <th className="content-table__header content-table__header--middle">Disponibilidad</th>
                <th className="content-table__header content-table__header--middle">Propietario</th>
                <th className="content-table__header content-table__header--last"></th>
              </tr>
            </thead>
            <tbody>
              {/* Render folders */}
              {data.folders.map((folder, index) => (
                <React.Fragment key={folder.id}>
                  {/* Add separator between folders (except before the first one) */}
                  {index > 0 && (
                    <tr className="folder-separator">
                      <td colSpan={4}></td>
                    </tr>
                  )}

                  <FolderRow
                    folder={folder}
                    isExpanded={expandedFolders.has(folder.id)}
                    onToggle={() => onToggleFolderExpansion(folder.id)}
                    onRename={() => onRenameFolder(folder)}
                    onDelete={() => onDeleteFolder(folder)}
                  />
                  {/* Render folder contents if expanded */}
                  {expandedFolders.has(folder.id) &&
                    folder.contents.map((content) => (
                      <ContentRow
                        key={content.id}
                        content={content}
                        isInFolder={true}
                        canDrag={true}
                        isDragging={activeItem?.id === content.id}
                      />
                    ))}
                </React.Fragment>
              ))}

              {/* Unassigned section */}
              <UnassignedSection
                foldersCount={data.folders.length}
                contents={data.unassignedContents}
                activeItem={activeItem}
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>{activeItem ? <DragPreview item={activeItem} /> : null}</DragOverlay>
    </DndContext>
  );
};

/**
 * Droppable section for unassigned content - returns rows, not tbody
 */
const UnassignedSection = ({ foldersCount, contents, activeItem }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'unassigned-zone',
  });

  // Only make it droppable if there are folders
  const isDroppable = foldersCount > 0;

  return (
    <>
      {contents.length > 0 && (
        <>
          {/* Only show separator if there are folders above */}
          {foldersCount > 0 && (
            <tr className="section-divider">
              <td colSpan={4}>
                <div className="section-divider-line"></div>
              </td>
            </tr>
          )}

          {/* Render unassigned content normally - NOT droppable */}
          {contents.map((content) => (
            <ContentRow
              key={content.id}
              content={content}
              isInFolder={false}
              canDrag={foldersCount > 0}
              isDragging={activeItem?.id === content.id}
            />
          ))}
        </>
      )}

      {/* Show info message when no unassigned content and no folders exist */}
      {contents.length === 0 && foldersCount === 0 && (
        <tr className="no-content-info">
          <td colSpan={4}>
            <div className="no-content-info__content">
              <span>Crea una carpeta para organizar tu contenido</span>
            </div>
          </td>
        </tr>
      )}

      {/* Drop zone row - ONLY this row is droppable, always show when there are folders */}
      {foldersCount > 0 && (
        <tr
          ref={isDroppable ? setNodeRef : null}
          className={`drop-padding-row ${isOver ? 'drop-padding-row--drag-over' : ''}`}
        >
          <td colSpan={4}>
            <div className={`drop-zone-area ${isOver ? 'drop-zone-area--drag-over' : ''}`}>
              <div className="drop-zone-area__hint">Arrastra aquí elementos de carpetas para desasignarlos</div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

/**
 * Component to preview the dragged item - usa el ContentRow real
 */
const DragPreview = ({ item }) => {
  return (
    <div className="drag-preview">
      <table className="drag-preview__table">
        <tbody>
          <ContentRow
            content={item}
            isInFolder={false}
            canDrag={false}
            isDragging={false}
            isPreview={true}
          />
        </tbody>
      </table>
    </div>
  );
};

export default ContentTable;
