
import React from 'react';
import { useFileManager } from '../contexts/FileManagerContext';
import { Plus, Upload, FolderPlus } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';

const FloatingActionButton: React.FC = () => {
  const { openModal } = useFileManager();

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="lg"
            className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 border-0 group hover:scale-110"
          >
            <Plus className="w-6 h-6 transition-transform duration-200 group-hover:rotate-90" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          side="top" 
          className="mb-4 glass-subtle border border-border/50 shadow-2xl"
        >
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-accent/50 transition-colors duration-200"
            onClick={() => openModal('upload')}
          >
            <Upload className="w-4 h-4 mr-3" />
            Upload Files
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-accent/50 transition-colors duration-200"
            onClick={() => openModal('createFolder')}
          >
            <FolderPlus className="w-4 h-4 mr-3" />
            Create Folder
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FloatingActionButton;
