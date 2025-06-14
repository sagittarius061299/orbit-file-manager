
import React from 'react';
import { useFileManager } from '../contexts/FileManagerContext';
import { ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { folders, currentFolder, setCurrentFolder } = useFileManager();
  const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(new Set(['root']));

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolderTree = (parentId: string, level: number = 0) => {
    const childFolders = folders.filter(folder => folder.parent === parentId);
    
    return childFolders.map(folder => {
      const isExpanded = expandedFolders.has(folder.id);
      const isSelected = currentFolder === folder.id;
      const hasChildren = folders.some(f => f.parent === folder.id);

      return (
        <div key={folder.id} className="select-none">
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 group ${
              isSelected
                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
            }`}
            style={{ paddingLeft: `${12 + level * 16}px` }}
            onClick={() => setCurrentFolder(folder.id)}
          >
            <div className="flex items-center gap-1 flex-1">
              {hasChildren && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFolder(folder.id);
                  }}
                  className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </button>
              )}
              {!hasChildren && <div className="w-4" />}
              
              {isSelected || isExpanded ? (
                <FolderOpen className="w-4 h-4 text-blue-500" />
              ) : (
                <Folder className="w-4 h-4" />
              )}
              
              <span className="text-sm font-medium truncate">{folder.name}</span>
            </div>
          </div>
          
          {isExpanded && hasChildren && (
            <div className="ml-2">
              {renderFolderTree(folder.id, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 lg:block`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">File Manager</h2>
          </div>
          
          <div className="flex-1 p-3 overflow-y-auto">
            <div className="space-y-1">
              {/* Root folder */}
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentFolder === 'root'
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setCurrentFolder('root')}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFolder('root');
                  }}
                  className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {expandedFolders.has('root') ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </button>
                <FolderOpen className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">My Drive</span>
              </div>
              
              {expandedFolders.has('root') && (
                <div className="ml-2">
                  {renderFolderTree('root')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default Sidebar;
