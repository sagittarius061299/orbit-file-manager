
import React from 'react';
import { useFileManager } from '../contexts/FileManagerContext';
import { Files, Image, FileText, Video, Music, MoreHorizontal, Share, Star, Trash2, BarChart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import FolderTreeSidebar from './FolderTreeSidebar';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, collapsed, onCollapsedChange }) => {
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

  const handleCategoryClick = (categoryId: string, filter?: string, path?: string) => {
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

  const CategoryItem = ({ item, isActive }: { item: any; isActive: boolean }) => {
    const content = (
      <div
        className={`flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl cursor-pointer transition-all duration-200 group relative ${
          isActive
            ? 'bg-accent/30 text-foreground shadow-sm'
            : 'hover:bg-accent/50 text-sidebar-foreground hover:scale-[1.01]'
        } ${collapsed ? 'justify-center' : ''}`}
      >
        {/* Active indicator dot */}
        {isActive && !collapsed && (
          <div className="absolute left-1 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
        )}
        
        <item.icon 
          className={`w-5 h-5 transition-transform duration-200 ${
            isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
          } ${collapsed ? '' : ''}`} 
        />
        {!collapsed && (
          <span className={`text-sm font-medium transition-all duration-200 ${
            isActive ? 'font-semibold' : ''
          }`}>{item.name}</span>
        )}
      </div>
    );

    if (collapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to={item.path + (item.filter && item.filter !== 'all' ? `?type=${item.filter}` : '')} onClick={() => handleCategoryClick(item.id, item.filter, item.path)}>
              {content}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{item.name}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <Link to={item.path + (item.filter && item.filter !== 'all' ? `?type=${item.filter}` : '')} onClick={() => handleCategoryClick(item.id, item.filter, item.path)}>
        {content}
      </Link>
    );
  };

  return (
    <TooltipProvider>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 glass border-r border-sidebar-border transform transition-all duration-300 ease-out ${
          collapsed ? 'w-16' : 'w-60'
        } ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 lg:flex lg:flex-shrink-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`p-4 border-b border-sidebar-border/50 ${collapsed ? 'px-3' : ''}`}>
            {!collapsed ? (
              <>
                <h2 className="text-lg font-bold text-sidebar-foreground tracking-tight">File Manager</h2>
                <p className="text-xs text-muted-foreground mt-1">Organize your files</p>
              </>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Files className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
            )}
            
            {/* Collapse toggle - only show on desktop */}
            <div className="hidden lg:block mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCollapsedChange(!collapsed)}
                className="w-full h-8 p-0 hover:bg-accent/50"
              >
                {collapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto sidebar-scrollbar lg:sidebar-no-scroll">
            <div className={`space-y-6 ${collapsed ? 'p-2' : 'p-4'}`}>
              {/* Main Categories */}
              <div>
                {!collapsed && (
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                    Categories
                  </h3>
                )}
                <div className="space-y-1">
                  {mainCategories.map((category) => {
                    const isInFolder = location.pathname.startsWith('/folder');
                    const hasTypeParam = location.search.includes(`type=${category.filter}`);
                    const isRootWithCorrectFilter = location.pathname === '/' && currentFilter === category.filter;
                    const isActive = !isInFolder && (isRootWithCorrectFilter || hasTypeParam);
                    
                    return (
                      <CategoryItem
                        key={category.id}
                        item={category}
                        isActive={isActive}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Action Items */}
              <div>
                {!collapsed && (
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                    Actions
                  </h3>
                )}
                <div className="space-y-1">
                  {actionItems.map((item) => {
                    const isActive = item.id === 'dashboard' 
                      ? location.pathname === '/dashboard'
                      : !location.pathname.startsWith('/folder') && location.pathname === '/' && currentFilter === item.filter;
                    
                    return (
                      <CategoryItem
                        key={item.id}
                        item={item}
                        isActive={isActive}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Folder Tree */}
              {!collapsed && (
                <div>
                  <FolderTreeSidebar />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onToggle}
        />
      )}
    </TooltipProvider>
  );
};

export default Sidebar;
