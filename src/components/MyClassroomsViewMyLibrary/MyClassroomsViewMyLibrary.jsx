import React from 'react';
import ContentTable from '../ContentTable';
import { EmptyState } from '../EmptyState';
import Loading from '../Loading';
import ErrorState from '../ErrorState';
import RenameFolderModal from '../RenameFolderModal';
import DeleteFolderModal from '../DeleteFolderModal';
import CreateFolderModal from '../CreateFolderModal';
import { useMyClassroomsViewMyLibrary } from '../../hooks/useMyClassroomsViewMyLibrary';
import { useContentTable } from '../ContentTable/useContentTable';
import './MyClassroomsViewMyLibrary.scss';

/**
 * MyClassroomsViewMyLibrary component that handles the library content display and management
 * @param {Object} props - Component props
 * @param {boolean} props.isCreateFolderModalOpen - Whether create folder modal is open
 * @param {Function} props.onCloseCreateFolderModal - Handler to close create folder modal
 * @param {Function} props.onCreateFolder - Handler for creating folders (passed from parent)
 * @returns {JSX.Element}
 */
export const MyClassroomsViewMyLibrary = ({
  isCreateFolderModalOpen,
  onCloseCreateFolderModal,
  onCreateFolder
}) => {
  const {
    // Data state
    data,
    isLoading,
    isError,
    expandedFolders,

    // Modal state
    isRenameFolderModalOpen,
    isDeleteFolderModalOpen,
    selectedFolder,

    // Data operations
    loadData,
    createFolder,
    renameFolder,
    deleteFolder,
    toggleFolderExpansion,
    moveContent,

    // Modal operations
    openRenameFolderModal,
    closeRenameFolderModal,
    openDeleteFolderModal,
    closeDeleteFolderModal
  } = useMyClassroomsViewMyLibrary();

  const { tableRows, hasContent } = useContentTable(data, expandedFolders);

  // Handle create folder from parent
  const handleCreateFolder = async (name) => {
    await createFolder(name);
    onCreateFolder?.(); // Call parent handler if provided
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorState onRetry={() => loadData()} />;
  }

  if (!hasContent) {
    return <EmptyState onCreateFolder={onCreateFolder} />;
  }

  return (
    <div className="my-classrooms-view-my-library">
      <ContentTable
        data={data}
        tableRows={tableRows}
        expandedFolders={expandedFolders}
        onToggleFolderExpansion={toggleFolderExpansion}
        onMoveContent={moveContent}
        onRenameFolder={openRenameFolderModal}
        onDeleteFolder={openDeleteFolderModal}
      />

      {/* Create Folder Modal */}
      {isCreateFolderModalOpen && (
        <CreateFolderModal
          isOpen={isCreateFolderModalOpen}
          onClose={onCloseCreateFolderModal}
          onCreateFolder={handleCreateFolder}
        />
      )}

      {/* Rename Folder Modal */}
      {isRenameFolderModalOpen && selectedFolder && (
        <RenameFolderModal
          isOpen={isRenameFolderModalOpen}
          folder={selectedFolder}
          onClose={closeRenameFolderModal}
          onRenameFolder={renameFolder}
        />
      )}

      {/* Delete Folder Modal */}
      {isDeleteFolderModalOpen && selectedFolder && (
        <DeleteFolderModal
          isOpen={isDeleteFolderModalOpen}
          folder={selectedFolder}
          onClose={closeDeleteFolderModal}
          onDeleteFolder={deleteFolder}
        />
      )}
    </div>
  );
};
