
import React from 'react';
import { FileItem } from '../contexts/FileManagerContext';
import { useFileManager } from '../contexts/FileManagerContext';
import { MoreHorizontal, Download, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';

interface FileCardProps {
  file: FileItem;
}

const FileCard: React.FC<FileCardProps> = ({ file }) => {
  const { setCurrentFolder, setPreviewFile, setRenameItem, setDeleteItems, openModal } = useFileManager();

  const handleFileClick = () => {
    if (file.type === 'folder') {
      setCurrentFolder(file.id);
    } else {
      setPreviewFile(file);
      openModal('preview');
    }
  };

  const handleRename = () => {
    setRenameItem(file);
    openModal('rename');
  };

  const handleDelete = () => {
    setDeleteItems([file]);
    openModal('delete');
  };

  return (
    <div className="group relative bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-200 cursor-pointer overflow-hidden hover:scale-[1.02]">
      {/* Actions - positioned absolute in top right */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 bg-background/80 backdrop-blur-sm hover:bg-background shadow-sm">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-subtle">
            <DropdownMenuItem className="cursor-pointer" onClick={handleFileClick}>
              <Download className="w-4 h-4 mr-2" />
              {file.type === 'folder' ? 'Open' : 'Download'}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleRename}>
              <Edit className="w-4 h-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="p-3" onClick={handleFileClick}>
        {/* File icon and preview */}
        <div className="aspect-square bg-gradient-to-br from-muted/50 to-muted rounded-lg flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform duration-200 shadow-sm">
          <div className="text-5xl drop-shadow-sm">{file.icon}</div>
        </div>
        
        {/* File info */}
        <div className="space-y-1.5">
          <h3 className="font-medium text-sm text-foreground truncate leading-tight">
            {file.name}
          </h3>
          <div className="space-y-0.5 text-xs text-muted-foreground">
            <div className="truncate">{file.size || 'Folder'}</div>
            <div className="truncate">{file.lastModified}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
