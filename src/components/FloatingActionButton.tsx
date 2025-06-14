
import React from 'react';
import { useFileManager } from '../contexts/FileManagerContext';
import { Plus, Upload, FolderPlus } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';

const FloatingActionButton: React.FC = () => {
  const { openModal } = useFileManager();

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="lg"
            className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 border-0"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          side="top" 
          className="mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => openModal('upload')}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => openModal('createFolder')}
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            Create Folder
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FloatingActionButton;
