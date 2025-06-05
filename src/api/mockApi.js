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
   * Simulates: POST front/library/:user_id/folders
   * @param {string} userId - ID of the user
   * @param {Object} body - Request body with folder name
   * @param {string} body.name - Name of the folder
   * @returns {Promise<Object>} Promise that resolves to created folder
   */
  async createFolder(userId, body) {
    await delay();
    console.log(`POST front/library/${userId}/folders`, body);

    const folder = {
      id: generateId(),
      type: "folder",
      name: body.name,
      created_by: {
        guid: userId,
        name: "Usuario Mock",
        role: "teacher"
      },
      created_at: new Date().toISOString(),
      items: []
    };
    return folder;
  },

  /**
   * Renames a folder
   * Simulates: PUT front/library/:user_id/folders/:id
   * @param {string} userId - ID of the user
   * @param {string} folderId - ID of the folder to rename
   * @param {Object} body - Request body with new folder name
   * @param {string} body.name - New name for the folder
   * @returns {Promise<{success: boolean}>}
   */
  async renameFolder(userId, folderId, body) {
    await delay();
    console.log(`PUT front/library/${userId}/folders/${folderId}`, body);
    return { success: true };
  },

  /**
   * Deletes a folder
   * @param {string} userId - ID of the user
   * @param {string} folderId - ID of the folder to delete
   * @param {boolean} deleteContents - Whether to delete contents or move them to unassigned
   * @returns {Promise<{success: boolean}>}
   */
  async deleteFolder(userId, folderId, deleteContents = false) {
    await delay();
    console.log(`DELETE front/library/${userId}/folders/${folderId}`, { deleteContents });
    return { success: true, deleteContents };
  }
};

/**
 * Mock API for content operations
 */
export const contentApi = {
  /**
   * Gets items from my library with optional search
   * Simulates: GET /front/my-library/items?search=:search
   * @param {string} search - Optional search term to filter items
   * @returns {Promise<Array>} Promise that resolves to array of items
   */
  async getMyLibraryItems(search = '') {
    await delay();

    let filteredData = [...mockData];

    // Apply search filter if search term is provided
    if (search && search.trim()) {
      const searchTerm = search.toLowerCase().trim();

      filteredData = mockData.filter(item => {
        if (item.type === 'folder') {
          // Search in folder name and its items
          const folderNameMatch = item.name.toLowerCase().includes(searchTerm);
          const itemsMatch = item.items.some(fileItem =>
            fileItem.content?.name?.toLowerCase().includes(searchTerm)
          );
          return folderNameMatch || itemsMatch;
        } else if (item.type === 'file') {
          // Search in file content name
          return item.content?.name?.toLowerCase().includes(searchTerm);
        }
        return false;
      });
    }

    return filteredData;
  },

  /**
   * Assigns or unassigns content to/from a folder
   * Simulates: PUT front/library/:user_id/items/:id
   * @param {string} userId - ID of the user
   * @param {string} contentId - ID of the content to move
   * @param {Object} body - Request body with folder assignment
   * @param {string|null} body.folderId - ID of destination folder, null for unassigned
   * @returns {Promise<{success: boolean}>}
   */
  async assignContentToFolder(userId, contentId, body) {
    await delay();
    console.log(`PUT front/library/${userId}/items/${contentId}`, body);
    return { success: true };
  },

  /**
   * Legacy method for backward compatibility
   * @deprecated Use assignContentToFolder instead
   */
  async moveContent(contentId, folderId) {
    // For backward compatibility, assume a default userId
    const userId = "mock-user-id";
    return this.assignContentToFolder(userId, contentId, { folderId });
  },

  /**
   * Batch move multiple contents to a folder
   * @param {string} userId - ID of the user
   * @param {string[]} contentIds - Array of content IDs to move
   * @param {string|null} folderId - ID of the destination folder
   * @returns {Promise<{success: boolean}>}
   */
  async batchAssignContents(userId, contentIds, folderId) {
    await delay();
    console.log(`Batch assigning contents for user ${userId}:`, { contentIds, folderId });
    return { success: true };
  }
};

/**
 * Initial mock data for the table - Backend format
 */
export const mockData = [
  {
    "id": "folder-1",
    "type": "folder",
    "name": "Docs importantes",
    "created_by": {
      "guid": "user-1",
      "name": "Editorial",
      "role": "editor"
    },
    "created_at": "2025-01-08T10:00:00Z",
    "items": []
  },
  {
    "id": "folder-2",
    "type": "folder",
    "name": "Materiales de ciencias",
    "created_by": {
      "guid": "user-2",
      "name": "Admin. Escuela",
      "role": "admin"
    },
    "created_at": "2025-01-08T11:00:00Z",
    "items": []
  },
  {
    "id": "content-1",
    "type": "file",
    "content": {
      "guid": "content-guid-1",
      "name": "Ficha educativa emociones",
      "type": "document",
      "is_teacher_only": true
    },
    "created_at": "2025-01-08T12:00:00Z",
    "created_by": {
      "guid": "user-1",
      "name": "Editorial",
      "role": "editor"
    }
  },
  {
    "id": "content-2",
    "type": "file",
    "content": {
      "guid": "content-guid-2",
      "name": "Cambios físicos y químicos de la materia",
      "type": "science",
      "is_teacher_only": true
    },
    "created_at": "2025-01-08T13:00:00Z",
    "created_by": {
      "guid": "user-1",
      "name": "Editorial",
      "role": "editor"
    }
  },
  {
    "id": "content-3",
    "type": "file",
    "content": {
      "guid": "content-guid-3",
      "name": "Diario de una planta",
      "type": "document",
      "is_teacher_only": false
    },
    "created_at": "2025-01-08T14:00:00Z",
    "created_by": {
      "guid": "user-1",
      "name": "Editorial",
      "role": "editor"
    }
  },
  {
    "id": "content-4",
    "type": "file",
    "content": {
      "guid": "content-guid-4",
      "name": "Mapamundi en blanco",
      "type": "map",
      "is_teacher_only": true
    },
    "created_at": "2025-01-08T15:00:00Z",
    "created_by": {
      "guid": "user-1",
      "name": "Editorial",
      "role": "editor"
    }
  },
  {
    "id": "content-5",
    "type": "file",
    "content": {
      "guid": "content-guid-5",
      "name": "Autorización escolar excursión",
      "type": "document",
      "is_teacher_only": false
    },
    "created_at": "2025-01-08T16:00:00Z",
    "created_by": {
      "guid": "user-2",
      "name": "Admin. Escuela",
      "role": "admin"
    }
  },
  {
    "id": "content-6",
    "type": "file",
    "content": {
      "guid": "content-guid-6",
      "name": "Video preparación excursión",
      "type": "video",
      "is_teacher_only": false
    },
    "created_at": "2025-02-10T10:00:00Z",
    "created_by": {
      "guid": "user-3",
      "name": "Yo",
      "role": "teacher"
    }
  }
];
