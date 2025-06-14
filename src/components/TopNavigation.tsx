
import React from 'react';
import { useFileManager } from '../contexts/FileManagerContext';
import { Menu, Search, Upload, Grid, List, User, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useTheme } from 'next-themes';

interface TopNavigationProps {
  onSidebarToggle: () => void;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ onSidebarToggle }) => {
  const { searchQuery, setSearchQuery, viewMode, setViewMode, openModal } = useFileManager();
  const { theme, setTheme } = useTheme();

  return (
    <div className="h-16 glass-subtle border-b border-border/50 flex items-center gap-4 px-6 backdrop-blur-md z-10">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSidebarToggle}
          className="lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <Button
          onClick={() => openModal('upload')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-lg mx-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search files and folders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 bg-background/50 backdrop-blur-sm border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl h-11 transition-all duration-200 shadow-sm hover:shadow-md"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="h-9 w-9 p-0"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* View toggle */}
        <div className="flex bg-muted/50 backdrop-blur-sm rounded-xl p-1.5 border border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('grid')}
            className={`p-2.5 rounded-lg transition-all duration-200 ${
              viewMode === 'grid'
                ? 'bg-background shadow-md text-foreground scale-105'
                : 'hover:bg-background/50 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('list')}
            className={`p-2.5 rounded-lg transition-all duration-200 ${
              viewMode === 'list'
                ? 'bg-background shadow-md text-foreground scale-105'
                : 'hover:bg-background/50 text-muted-foreground hover:text-foreground'
            }`}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback className="bg-blue-500 text-white">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 glass-subtle border border-border/50 shadow-xl" align="end">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">John Doe</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">john.doe@example.com</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400">
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopNavigation;
