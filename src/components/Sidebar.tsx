
import React from 'react';
import { useFileManager } from '../contexts/FileManagerContext';
import { Files, Image, FileText, Video, Music, MoreHorizontal, Share, Star, Trash2, BarChart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { currentFolder, setCurrentFolder, currentFilter, setCurrentFilter } = useFileManager();
  const location = useLocation();

  const mainCategories = [
    { id: 'all', name: 'All Files', icon: Files, isDefault: true, path: '/', filter: 'all' },
    { id: 'pictures', name: 'Pictures', icon: Image, path: '/', filter: 'pictures' },
    { id: 'documents', name: 'Documents', icon: FileText, path: '/', filter: 'documents' },
    { id: 'videos', name: 'Videos', icon: Video, path: '/', filter: 'videos' },
    { id: 'music', name: 'Music', icon: Music, path: '/', filter: 'music' },
    { id: 'other', name: 'Other', icon: MoreHorizontal, path: '/', filter: 'other' },
  ];

  const actionItems = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart, path: '/dashboard' },
    { id: 'share', name: 'Share', icon: Share, path: '/', filter: 'share' },
    { id: 'starred', name: 'Starred', icon: Star, path: '/', filter: 'starred' },
    { id: 'recycle', name: 'Recycle Bin', icon: Trash2, path: '/', filter: 'recycle' },
  ];

  const handleCategoryClick = (categoryId: string, filter?: string) => {
    if (categoryId === 'dashboard') {
      return; // Navigation handled by Link
    }
    
    if (filter) {
      setCurrentFilter(filter);
    }
    
    // If not on root folder, navigate to root when changing filters
    if (currentFolder !== 'root') {
      setCurrentFolder('root');
    }
  };

  const CategoryItem = ({ item, isActive }: { item: any; isActive: boolean }) => (
    <Link to={item.path} onClick={() => handleCategoryClick(item.id, item.filter)}>
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 group relative ${
          isActive
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
            : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
        }`}
      >
        {/* Active indicator dot */}
        {isActive && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
        )}
        
        <item.icon 
          className={`w-5 h-5 ${
            isActive ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400'
          }`} 
        />
        <span className="text-sm font-medium">{item.name}</span>
      </div>
    </Link>
  );

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 lg:block`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">File Manager</h2>
          </div>
          
          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-3 space-y-6">
              {/* Main Categories */}
              <div>
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-4">
                  Categories
                </h3>
                <div className="space-y-1">
                  {mainCategories.map((category) => (
                    <CategoryItem
                      key={category.id}
                      item={category}
                      isActive={location.pathname.startsWith('/folder') ? false : location.pathname === '/' && currentFilter === category.filter}
                    />
                  ))}
                </div>
              </div>

              {/* Action Items */}
              <div>
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-4">
                  Actions
                </h3>
                <div className="space-y-1">
                  {actionItems.map((item) => (
                    <CategoryItem
                      key={item.id}
                      item={item}
                      isActive={item.id === 'dashboard' ? location.pathname === '/dashboard' : location.pathname === '/' && currentFilter === item.filter}
                    />
                  ))}
                </div>
              </div>
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
