
import React from 'react';
import { useFileManager } from '../contexts/FileManagerContext';
import { ChevronRight, Home } from 'lucide-react';

const BreadcrumbNavigation: React.FC = () => {
  const { folders, currentFolder, navigateToFolder } = useFileManager();

  const getBreadcrumbs = () => {
    const breadcrumbs = [];
    let current = currentFolder;

    while (current && current !== 'root') {
      const folder = folders.find(f => f.id === current);
      if (folder) {
        breadcrumbs.unshift(folder);
        current = folder.parent;
      } else {
        break;
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="flex items-center space-x-2 text-sm">
      <button
        onClick={() => navigateToFolder('root')}
        className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
          currentFolder === 'root'
            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        <Home className="w-4 h-4" />
        <span>My Drive</span>
      </button>

      {breadcrumbs.map((folder, index) => (
        <React.Fragment key={folder.id}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button
            onClick={() => navigateToFolder(folder.id)}
            className={`px-2 py-1 rounded-md transition-colors ${
              index === breadcrumbs.length - 1
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {folder.name}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default BreadcrumbNavigation;
