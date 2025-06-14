
import React from 'react';
import { useFileManager, FileItem } from '../contexts/FileManagerContext';
import FileGrid from './FileGrid';
import FileList from './FileList';
import BreadcrumbNavigation from './BreadcrumbNavigation';

interface MainContentProps {
  sidebarOpen: boolean;
}

const MainContent: React.FC<MainContentProps> = ({ sidebarOpen }) => {
  const { viewMode, files, currentFolder, searchQuery, currentFilter } = useFileManager();

  // Helper function to determine file type
  const getFileType = (file: FileItem) => {
    if (file.type === 'folder') return 'folder';
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) return 'pictures';
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'].includes(extension || '')) return 'videos';
    if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension || '')) return 'documents';
    if (['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(extension || '')) return 'music';
    return 'other';
  };

  // Filter files based on current folder, search query, and file type filter
  const filteredFiles = files.filter(file => {
    const matchesFolder = file.parent === currentFolder;
    const matchesSearch = searchQuery === '' || 
      file.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply type filter
    let matchesFilter = true;
    if (currentFilter !== 'all') {
      const fileType = getFileType(file);
      matchesFilter = fileType === currentFilter || file.type === 'folder';
    }
    
    return matchesFolder && matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-8 pb-6">
        <BreadcrumbNavigation />
      </div>
      
      <div className="flex-1 overflow-auto px-8 pb-8">
        {/* Modern drag and drop area */}
        <div className="h-full min-h-96 rounded-2xl border-2 border-dashed border-border/30 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:shadow-lg group">
          <div className="p-8 h-full">
            {filteredFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <div className="relative mb-8">
                  <div className="text-8xl opacity-20 group-hover:opacity-30 transition-opacity duration-300">📁</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-full blur-2xl group-hover:from-primary/20 transition-all duration-300"></div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {searchQuery ? 'No files match your search' : 'This folder is empty'}
                </h3>
                <p className="text-sm text-center max-w-md leading-relaxed">
                  {searchQuery 
                    ? 'Try adjusting your search terms or browse other folders.'
                    : 'Drop files here or use the upload button to add your first files.'
                  }
                </p>
              </div>
            ) : (
              <div className="h-full">
                {viewMode === 'grid' ? (
                  <FileGrid files={filteredFiles} />
                ) : (
                  <FileList files={filteredFiles} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
