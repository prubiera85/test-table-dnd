import { useState, useCallback } from 'react';

/**
 * Hook for MyClassRoomsView component to manage main view state
 * @returns {Object} State and handlers for the main view
 */
export const useMyClassRoomsView = () => {
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);

  /**
   * Opens the create folder modal
   */
  const openCreateFolderModal = useCallback(() => {
    setIsCreateFolderModalOpen(true);
  }, []);

  /**
   * Closes the create folder modal
   */
  const closeCreateFolderModal = useCallback(() => {
    setIsCreateFolderModalOpen(false);
  }, []);

  return {
    isCreateFolderModalOpen,
    openCreateFolderModal,
    closeCreateFolderModal
  };
};
