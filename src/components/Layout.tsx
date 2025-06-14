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
      <div className="min-h-screen bg-background flex w-full relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
        </div>

        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <TopNavigation onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
          <div className="flex-1 overflow-auto custom-scrollbar">
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