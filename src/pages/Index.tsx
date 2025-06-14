
import React, { useState } from 'react';
import { FileManagerProvider } from '../contexts/FileManagerContext';
import Sidebar from '../components/Sidebar';
import TopNavigation from '../components/TopNavigation';
import MainContent from '../components/MainContent';
import FloatingActionButton from '../components/FloatingActionButton';
import CreateFolderModal from '../components/modals/CreateFolderModal';
import UploadModal from '../components/modals/UploadModal';
import FilePreviewModal from '../components/modals/FilePreviewModal';
import RenameModal from '../components/modals/RenameModal';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <FileManagerProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex w-full">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNavigation onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
          <MainContent sidebarOpen={sidebarOpen} />
        </div>

        <FloatingActionButton />
        
        {/* Modals */}
        <CreateFolderModal />
        <UploadModal />
        <FilePreviewModal />
        <RenameModal />
        <DeleteConfirmModal />
      </div>
    </FileManagerProvider>
  );
};

export default Index;
