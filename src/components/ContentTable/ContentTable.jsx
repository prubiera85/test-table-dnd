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

import { useTableData } from "../../hooks/useTableData";
import Header from "../Header";
import FolderRow from "../FolderRow";
import ContentRow from "../ContentRow";
import CreateFolderModal from "../CreateFolderModal";
import RenameFolderModal from "../RenameFolderModal";
import DeleteFolderModal from "../DeleteFolderModal";
import Loading from "../Loading";
import ErrorState from "../ErrorState";
import './ContentTable.scss';

/**
 * Main table component for displaying hierarchical content
 */
const ContentTable = () => {
  const {
    data,
    isLoading,
    isError,
    createFolder,
    renameFolder,
    deleteFolder,
    moveContent,
    expandedFolders,
    toggleFolderExpansion,
  } = useTableData();

  // Modal states
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showRenameModal, setShowRenameModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [selectedFolder, setSelectedFolder] = React.useState(null);
  const [isCreating, setIsCreating] = React.useState(false);
  const [isRenaming, setIsRenaming] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

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

  // Early returns after all hooks
  if (isLoading) {
    return <Loading message="Cargando contenido..." size="md" />;
  }

  if (isError) {
    return <ErrorState message="Error al cargar el contenido. Por favor, inténtalo de nuevo." />;
  }

  const handleCreateFolder = async (folderName) => {
    setIsCreating(true);
    try {
      await createFolder(folderName);
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating folder:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRenameFolder = async (folderId, newName) => {
    setIsRenaming(true);
    try {
      await renameFolder(folderId, newName);
      setShowRenameModal(false);
      setSelectedFolder(null);
    } catch (error) {
      console.error("Error renaming folder:", error);
    } finally {
      setIsRenaming(false);
    }
  };

  const handleDeleteFolder = async (folderId, deleteOption) => {
    setIsDeleting(true);
    try {
      const deleteContents = deleteOption === "delete";
      await deleteFolder(folderId, deleteContents);
      setShowDeleteModal(false);
      setSelectedFolder(null);
    } catch (error) {
      console.error("Error deleting folder:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const openRenameModal = (folder) => {
    setSelectedFolder(folder);
    setShowRenameModal(true);
  };

  const openDeleteModal = (folder) => {
    setSelectedFolder(folder);
    setShowDeleteModal(true);
  };

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
      moveContent(activeContent.id, targetFolder.id);
    } else if (over.id === 'unassigned-zone') {
      // Move content to unassigned (outside any folder) - only from the specific drop zone
      moveContent(activeContent.id, null);
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
      <Header onCreateFolder={() => setShowCreateModal(true)} />

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
                  <FolderRow
                    folder={folder}
                    isExpanded={expandedFolders.has(folder.id)}
                    onToggleExpand={() => toggleFolderExpansion(folder.id)}
                    onRename={() => openRenameModal(folder)}
                    onDelete={() => openDeleteModal(folder)}
                  />

                  {expandedFolders.has(folder.id) && (
                    <>
                      {folder.contents && folder.contents.length > 0 ? (
                        folder.contents.map((content) => (
                          <ContentRow
                            key={content.id}
                            content={content}
                            isInFolder={true}
                            canDrag={true}
                            isDragging={activeItem?.id === content.id}
                          />
                        ))
                      ) : (
                        <tr className="empty-folder-row">
                          <td colSpan={4}>
                            <div className="empty-folder-row__content">
                              <span>La carpeta está vacía</span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )}

                  {/* Separador entre carpetas (excepto después de la última) */}
                  {index < data.folders.length - 1 && (
                    <tr className="folder-separator">
                      <td colSpan={4}></td>
                    </tr>
                  )}
                </React.Fragment>
              ))}

              {/* Unassigned section - now just rows, not separate tbody */}
              <UnassignedSection
                foldersCount={data.folders.length}
                contents={data.unassignedContents}
                activeItem={activeItem}
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* Drag Overlay - renderiza fuera del contexto de la tabla */}
      <DragOverlay>
        {activeItem ? <DragPreview item={activeItem} /> : null}
      </DragOverlay>

      {/* Modals */}
      <CreateFolderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateFolder}
        isLoading={isCreating}
      />

      <RenameFolderModal
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        onSubmit={handleRenameFolder}
        folder={selectedFolder}
        isLoading={isRenaming}
      />

      <DeleteFolderModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onSubmit={handleDeleteFolder}
        folder={selectedFolder}
        isLoading={isDeleting}
      />
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
