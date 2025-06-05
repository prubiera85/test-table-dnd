import { useState, useCallback, useMemo, useEffect } from 'react';
import { folderApi, contentApi } from '../api/mockApi';
import React from 'react';

/**
 * Transforms backend data structure to our internal format
 * @param {Array} backendData - Array of items from backend
 * @returns {Object} Transformed data with folders and unassignedContents
 */
const transformBackendData = (backendData) => {
  const folders = [];
  const unassignedContents = [];

  backendData.forEach(item => {
    if (item.type === 'folder') {
      // Transform folder
      const folder = {
        id: item.id,
        name: item.name,
        isExpanded: false,
        contents: (item.items || []).map(fileItem => transformFile(fileItem))
      };
      folders.push(folder);
    } else if (item.type === 'file') {
      // Transform unassigned file
      const file = transformFile(item);
      unassignedContents.push(file);
    }
  });

  return {
    folders,
    unassignedContents
  };
};

/**
 * Transforms a file item from backend format to internal format
 * @param {Object} fileItem - File item from backend
 * @returns {Object} Transformed file item
 */
const transformFile = (fileItem) => {
  // Map is_teacher_only to availability
  const availability = fileItem.is_teacher_only || fileItem.content?.is_teacher_only
    ? 'Profesor'
    : 'Estudiantes';

  // Use created_by.name for owner
  const owner = fileItem.created_by?.name || 'Desconocido';

  // Use content.name for title, fallback to a default
  const title = fileItem.content?.name || 'Sin título';

  // Use content.type for our type
  const type = fileItem.content?.type || 'document';

  // Format date (assuming created_at is ISO string)
  const date = fileItem.created_at
    ? new Date(fileItem.created_at).toLocaleDateString('es-ES')
    : '';

  return {
    id: fileItem.id,
    title,
    type,
    availability,
    owner,
    date,
    folderId: null // Will be set based on context
  };
};

/**
 * Custom hook to manage table data state and operations
 * @returns {Object} Hook return object with data and operations
 */
export const useTableData = () => {
  const [data, setData] = useState({ folders: [], unassignedContents: [] });
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [isError, setIsError] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState(new Set());

  // Mock user ID for testing
  const mockUserId = "mock-user-123";

  /**
   * Loads data from API endpoint
   * @param {string} search - Optional search term
   */
  const loadData = useCallback(async (search = '') => {
    setIsLoading(true);
    setIsError(false);

    try {
      const backendData = await contentApi.getMyLibraryItems(search);
      const transformedData = transformBackendData(backendData);
      setData(transformedData);
    } catch (err) {
      console.error('Error loading data:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * Creates a new folder
   * @param {string} name - Name of the new folder
   */
  const createFolder = useCallback(async (name) => {
    if (!name.trim()) return;

    setIsLoading(true);
    setIsError(false);

    try {
      const newFolder = await folderApi.createFolder(mockUserId, { name: name.trim() });
      setData(prev => ({
        ...prev,
        folders: [...prev.folders, {
          id: newFolder.id,
          name: newFolder.name,
          isExpanded: false,
          contents: []
        }]
      }));
    } catch (err) {
      setIsError(true);
      console.error('Error creating folder:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Renames an existing folder
   * @param {string} folderId - ID of the folder to rename
   * @param {string} newName - New name for the folder
   */
  const renameFolder = useCallback(async (folderId, newName) => {
    if (!newName.trim()) return;

    setIsLoading(true);
    setIsError(false);

    try {
      await folderApi.renameFolder(mockUserId, folderId, { name: newName.trim() });
      setData(prev => ({
        ...prev,
        folders: prev.folders.map(folder =>
          folder.id === folderId
            ? { ...folder, name: newName.trim() }
            : folder
        )
      }));
    } catch (err) {
      setIsError(true);
      console.error('Error renaming folder:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Deletes a folder
   * @param {string} folderId - ID of the folder to delete
   * @param {boolean} deleteContents - Whether to delete contents or move them to unassigned
   */
  const deleteFolder = useCallback(async (folderId, deleteContents = false) => {
    setIsLoading(true);
    setIsError(false);

    try {
      await folderApi.deleteFolder(mockUserId, folderId, deleteContents);

      setData(prev => {
        const folderToDelete = prev.folders.find(f => f.id === folderId);
        if (!folderToDelete) return prev;

        const newData = {
          ...prev,
          folders: prev.folders.filter(f => f.id !== folderId)
        };

        // If not deleting contents, move them to unassigned
        if (!deleteContents && folderToDelete.contents && folderToDelete.contents.length > 0) {
          newData.unassignedContents = [
            ...prev.unassignedContents,
            ...folderToDelete.contents.map(content => ({
              ...content,
              folderId: null
            }))
          ];
        }

        return newData;
      });

      // Remove from expanded folders
      setExpandedFolders(prev => {
        const newSet = new Set(prev);
        newSet.delete(folderId);
        return newSet;
      });
    } catch (err) {
      setIsError(true);
      console.error('Error deleting folder:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Toggles folder expansion state
   * @param {string} folderId - ID of the folder to toggle
   */
  const toggleFolderExpansion = useCallback((folderId) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  }, []);

  /**
   * Moves content to a folder or to unassigned
   * @param {string} contentId - ID of the content to move
   * @param {string|null} targetFolderId - ID of destination folder, null for unassigned
   */
  const moveContent = useCallback(async (contentId, targetFolderId) => {
    setIsLoading(true);
    setIsError(false);

    try {
      await contentApi.assignContentToFolder(mockUserId, contentId, { folderId: targetFolderId });

      setData(prev => {
        // Find content in current location
        let content = null;
        let sourceLocation = null;

        // Check unassigned contents
        const unassignedIndex = prev.unassignedContents.findIndex(c => c.id === contentId);
        if (unassignedIndex !== -1) {
          content = prev.unassignedContents[unassignedIndex];
          sourceLocation = 'unassigned';
        } else {
          // Check folders
          for (const folder of prev.folders) {
            const contentIndex = folder.contents.findIndex(c => c.id === contentId);
            if (contentIndex !== -1) {
              content = folder.contents[contentIndex];
              sourceLocation = folder.id;
              break;
            }
          }
        }

        if (!content) return prev;

        const newData = { ...prev };
        const updatedContent = { ...content, folderId: targetFolderId };

        // Remove from source
        if (sourceLocation === 'unassigned') {
          newData.unassignedContents = prev.unassignedContents.filter(c => c.id !== contentId);
        } else {
          newData.folders = prev.folders.map(folder =>
            folder.id === sourceLocation
              ? { ...folder, contents: folder.contents.filter(c => c.id !== contentId) }
              : folder
          );
        }

        // Add to destination
        if (targetFolderId === null) {
          newData.unassignedContents = [...newData.unassignedContents, updatedContent];
        } else {
          newData.folders = newData.folders.map(folder =>
            folder.id === targetFolderId
              ? { ...folder, contents: [...folder.contents, updatedContent] }
              : folder
          );
        }

        return newData;
      });
    } catch (err) {
      setIsError(true);
      console.error('Error moving content:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get all contents in table format for react-table
   */
  const tableRows = useMemo(() => {
    const rows = [];

    // Add folder rows
    data.folders.forEach(folder => {
      rows.push({
        id: folder.id,
        type: 'folder',
        data: folder
      });

      // Add folder contents if expanded
      if (expandedFolders.has(folder.id)) {
        folder.contents.forEach(content => {
          rows.push({
            id: content.id,
            type: 'content',
            data: content,
            parentFolderId: folder.id
          });
        });
      }
    });

    // Add unassigned contents
    data.unassignedContents.forEach(content => {
      rows.push({
        id: content.id,
        type: 'content',
        data: content,
        parentFolderId: null
      });
    });

    return rows;
  }, [data, expandedFolders]);

  return {
    data,
    tableRows,
    isLoading,
    isError,
    expandedFolders,
    createFolder,
    renameFolder,
    deleteFolder,
    toggleFolderExpansion,
    moveContent,
    loadData,
  };
};

// Export transform function for external use
export { transformBackendData };
