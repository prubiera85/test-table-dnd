import { useMemo } from 'react';

/**
 * Hook for ContentTable component to handle table-specific logic
 * @param {Object} data - Table data with folders and unassignedContents
 * @param {Set} expandedFolders - Set of expanded folder IDs
 * @returns {Object} Table rows and utilities
 */
export const useContentTable = (data, expandedFolders) => {
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

    // Add separator if both folders and unassigned content exist
    if (data.folders.length > 0 && data.unassignedContents.length > 0) {
      rows.push({
        id: 'separator',
        type: 'separator',
        data: null
      });
    }

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

  /**
   * Check if table has any content to display
   */
  const hasContent = useMemo(() => {
    return data.folders.length > 0 || data.unassignedContents.length > 0;
  }, [data.folders.length, data.unassignedContents.length]);

  return {
    tableRows,
    hasContent
  };
};
