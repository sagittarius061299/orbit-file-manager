
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
    <nav className="flex items-center space-x-1 text-sm">
      <button
        onClick={() => navigateToFolder('root')}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 font-medium ${
          currentFolder === 'root'
            ? 'text-primary bg-primary/10 shadow-sm'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
        }`}
      >
        <Home className="w-4 h-4" />
        <span>My Drive</span>
      </button>

      {breadcrumbs.map((folder, index) => (
        <React.Fragment key={folder.id}>
          <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
          <button
            onClick={() => navigateToFolder(folder.id)}
            className={`px-3 py-2 rounded-xl transition-all duration-200 font-medium ${
              index === breadcrumbs.length - 1
                ? 'text-primary bg-primary/10 shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
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
