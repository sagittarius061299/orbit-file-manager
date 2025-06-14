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
                className={`flex items-center gap-3 px-3 py-2 mx-2 rounded-xl cursor-pointer transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-accent/30 text-foreground shadow-sm'
                    : 'hover:bg-accent/50 text-sidebar-foreground hover:scale-[1.01]'
                }`}
              >
                {/* Active indicator dot */}
                {isActive && (
                  <div className="absolute left-1 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
                )}
                
                {hasChildren && (
                  <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                  }`} />
                )}
                
                <Folder 
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                  }`} 
                />
                <span className={`text-sm font-medium truncate transition-all duration-200 ${
                  isActive ? 'font-semibold' : ''
                }`}>{folder.name}</span>
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
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3">
        Folders
      </h3>
      {renderFolderTree()}
    </div>
  );
};

export default FolderTreeSidebar;