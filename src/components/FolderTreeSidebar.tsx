import React from 'react';
import { useFileManager } from '../contexts/FileManagerContext';
import { ChevronRight, ChevronDown, Folder } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const FolderTreeSidebar: React.FC = () => {
  const { folders, currentFolder, navigateToFolder } = useFileManager();
  const location = useLocation();

  const renderFolderTree = (parentId: string = 'root', level: number = 0) => {
    const childFolders = folders.filter(folder => folder.parent === parentId && folder.id !== 'root');
    
    if (childFolders.length === 0) return null;

    return (
      <div className={`${level > 0 ? 'ml-4' : ''}`}>
        {childFolders.map((folder) => {
          const isActive = currentFolder === folder.id;
          const hasChildren = folders.some(f => f.parent === folder.id);
          
          return (
            <div key={folder.id} className="space-y-1">
              <div
                onClick={() => navigateToFolder(folder.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
                )}
                
                {hasChildren && (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
                
                <Folder 
                  className={`w-4 h-4 ${
                    isActive ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400'
                  }`} 
                />
                <span className="text-sm font-medium truncate">{folder.name}</span>
              </div>
              
              {/* Render child folders */}
              {renderFolderTree(folder.id, level + 1)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-4">
        Folders
      </h3>
      {renderFolderTree()}
    </div>
  );
};

export default FolderTreeSidebar;