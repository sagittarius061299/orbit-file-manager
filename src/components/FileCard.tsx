
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
    <div className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden">
      <div className="p-4" onClick={handleFileClick}>
        {/* File icon and preview */}
        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
          <div className="text-4xl">{file.icon}</div>
        </div>
        
        {/* File info */}
        <div className="space-y-1">
          <h3 className="font-medium text-sm text-gray-900 dark:text-white truncate">
            {file.name}
          </h3>
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{file.size || 'Folder'}</span>
            <span>{file.lastModified}</span>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="px-4 pb-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <DropdownMenuItem className="cursor-pointer" onClick={handleFileClick}>
              <Download className="w-4 h-4 mr-2" />
              {file.type === 'folder' ? 'Open' : 'Download'}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleRename}>
              <Edit className="w-4 h-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer text-red-600 dark:text-red-400"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default FileCard;
