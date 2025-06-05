import React from 'react';
import Header from '../Header';
import { MyClassroomsViewMyLibrary } from '../MyClassroomsViewMyLibrary';
import { useMyClassRoomsView } from './useMyClassRoomsView';
import './MyClassRoomsView.scss';

/**
 * Main MyClassRoomsView component that handles the overall view structure
 * @returns {JSX.Element}
 */
export const MyClassRoomsView = () => {
  const {
    isCreateFolderModalOpen,
    openCreateFolderModal,
    closeCreateFolderModal
  } = useMyClassRoomsView();

  return (
    <div className="my-classrooms-view">
      <Header onCreateFolder={openCreateFolderModal} />

      <div className="my-classrooms-view__content">
        <MyClassroomsViewMyLibrary
          isCreateFolderModalOpen={isCreateFolderModalOpen}
          onCloseCreateFolderModal={closeCreateFolderModal}
          onCreateFolder={closeCreateFolderModal}
        />
      </div>
    </div>
  );
};
