// Mock API for simulating backend operations
const MOCK_DELAY = 500; // Simulate network delay

/**
 * Simulates API delay
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>}
 */
const delay = (ms = MOCK_DELAY) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generates a unique ID
 * @returns {string}
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Mock API for folder operations
 */
export const folderApi = {
  /**
   * Creates a new folder
   * @param {string} name - Name of the folder
   * @returns {Promise<{id: string, name: string, isExpanded: boolean, contents: Array}>}
   */
  async createFolder(name) {
    await delay();
    const folder = {
      id: generateId(),
      name,
      isExpanded: false,
      contents: []
    };
    return folder;
  },

  /**
   * Renames a folder
   * @param {string} folderId - ID of the folder to rename
   * @param {string} newName - New name for the folder
   * @returns {Promise<{success: boolean}>}
   */
  async renameFolder(folderId, newName) {
    await delay();
    // In real implementation, would use folderId and newName to update folder
    console.log(`Renaming folder ${folderId} to ${newName}`);
    return { success: true };
  },

  /**
   * Deletes a folder
   * @param {string} folderId - ID of the folder to delete
   * @param {boolean} deleteContents - Whether to delete contents or move them to unassigned
   * @returns {Promise<{success: boolean}>}
   */
  async deleteFolder(folderId, deleteContents = false) {
    await delay();
    // In real implementation, would use folderId and deleteContents
    console.log(`Deleting folder ${folderId}, deleteContents: ${deleteContents}`);
    return { success: true, deleteContents };
  }
};

/**
 * Mock API for content operations
 */
export const contentApi = {
  /**
   * Moves content to a folder
   * @param {string} contentId - ID of the content to move
   * @param {string|null} folderId - ID of the destination folder, null for unassigned
   * @returns {Promise<{success: boolean}>}
   */
  async moveContent(contentId, folderId) {
    await delay();
    // In real implementation, would use contentId and folderId
    console.log(`Moving content ${contentId} to folder ${folderId}`);
    return { success: true };
  },

  /**
   * Batch move multiple contents to a folder
   * @param {string[]} contentIds - Array of content IDs to move
   * @param {string|null} folderId - ID of the destination folder
   * @returns {Promise<{success: boolean}>}
   */
  async batchMoveContents(contentIds, folderId) {
    await delay();
    // In real implementation, would use contentIds and folderId
    console.log(`Moving contents ${contentIds.join(', ')} to folder ${folderId}`);
    return { success: true };
  }
};

/**
 * Initial mock data for the table
 */
export const mockData = {
  folders: [
    {
      id: 'folder-1',
      name: 'Docs importantes',
      isExpanded: false,
      contents: []
    },
    {
      id: 'folder-2',
      name: 'Materiales de ciencias',
      isExpanded: false,
      contents: []
    }
  ],
  unassignedContents: [
    {
      id: 'content-1',
      title: 'Ficha educativa emociones',
      type: 'document',
      availability: 'Docente',
      owner: 'Editorial',
      date: '08/01/2025',
      folderId: null
    },
    {
      id: 'content-2',
      title: 'Cambios físicos y químicos de la materia',
      type: 'science',
      availability: 'Docente',
      owner: 'Editorial',
      date: '08/01/2025',
      folderId: null
    },
    {
      id: 'content-3',
      title: 'Diario de una planta',
      type: 'document',
      availability: 'Estudiantes',
      owner: 'Editorial',
      date: '08/01/2025',
      folderId: null
    },
    {
      id: 'content-4',
      title: 'Mapamundi en blanco',
      type: 'map',
      availability: 'Docente',
      owner: 'Editorial',
      date: '08/01/2025',
      folderId: null
    },
    {
      id: 'content-5',
      title: 'Autorización escolar excursión',
      type: 'document',
      availability: 'Estudiantes',
      owner: 'Admin. Escuela',
      date: '08/01/2025',
      folderId: null
    },
    {
      id: 'content-6',
      title: 'Video preparación excursión',
      type: 'video',
      availability: 'Estudiantes',
      owner: 'Yo',
      date: '10/02/2025',
      folderId: null
    }
  ]
};
