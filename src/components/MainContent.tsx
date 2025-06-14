
import React from 'react';
import { useFileManager } from '../contexts/FileManagerContext';
import FileGrid from './FileGrid';
import FileList from './FileList';
import BreadcrumbNavigation from './BreadcrumbNavigation';

interface MainContentProps {
  sidebarOpen: boolean;
}

const MainContent: React.FC<MainContentProps> = ({ sidebarOpen }) => {
  const { viewMode, files, currentFolder, searchQuery } = useFileManager();

  // Filter files based on current folder and search query
  const filteredFiles = files.filter(file => {
    const matchesFolder = file.parent === currentFolder;
    const matchesSearch = searchQuery === '' || 
      file.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-6 pb-4">
        <BreadcrumbNavigation />
      </div>
      
      <div className="flex-1 overflow-auto px-6 pb-6">
        {/* Drag and drop area */}
        <div className="h-full min-h-96 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 transition-colors hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/20">
          <div className="p-6 h-full">
            {filteredFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">📁</div>
                <h3 className="text-lg font-medium mb-2">
                  {searchQuery ? 'No files match your search' : 'This folder is empty'}
                </h3>
                <p className="text-sm text-center max-w-md">
                  {searchQuery 
                    ? 'Try adjusting your search terms or browse other folders.'
                    : 'Drop files here or use the upload button to add your first files.'
                  }
                </p>
              </div>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <FileGrid files={filteredFiles} />
                ) : (
                  <FileList files={filteredFiles} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
