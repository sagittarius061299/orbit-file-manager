import React, { useState } from 'react';
import { FileManagerProvider } from '../contexts/FileManagerContext';
import Sidebar from './Sidebar';
import TopNavigation from './TopNavigation';
import FloatingActionButton from './FloatingActionButton';
import CreateFolderModal from './modals/CreateFolderModal';
import UploadModal from './modals/UploadModal';
import FilePreviewModal from './modals/FilePreviewModal';
import RenameModal from './modals/RenameModal';
import DeleteConfirmModal from './modals/DeleteConfirmModal';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <FileManagerProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex w-full">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNavigation onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
          <div className="flex-1 overflow-auto">
            {children}
          </div>
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

export default Layout;