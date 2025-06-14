
import React from 'react';
import { FileItem } from '../contexts/FileManagerContext';
import { useFileManager } from '../contexts/FileManagerContext';
import { MoreHorizontal, Download, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';

interface FileListProps {
  files: FileItem[];
}

const FileList: React.FC<FileListProps> = ({ files }) => {
  const { setCurrentFolder, setPreviewFile, setRenameItem, setDeleteItems, openModal } = useFileManager();

  const handleFileClick = (file: FileItem) => {
    if (file.type === 'folder') {
      setCurrentFolder(file.id);
    } else {
      setPreviewFile(file);
      openModal('preview');
    }
  };

  const handleRename = (file: FileItem) => {
    setRenameItem(file);
    openModal('rename');
  };

  const handleDelete = (file: FileItem) => {
    setDeleteItems([file]);
    openModal('delete');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
        <div className="col-span-6">Name</div>
        <div className="col-span-2 hidden sm:block">Size</div>
        <div className="col-span-3 hidden md:block">Modified</div>
        <div className="col-span-1"></div>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {files.map((file) => (
          <div
            key={file.id}
            className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
            onClick={() => handleFileClick(file)}
          >
            <div className="col-span-6 flex items-center gap-3 min-w-0">
              <div className="text-2xl flex-shrink-0">{file.icon}</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {file.type === 'folder' ? 'Folder' : 'File'}
                </p>
              </div>
            </div>
            
            <div className="col-span-2 hidden sm:flex items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {file.size || '-'}
              </span>
            </div>
            
            <div className="col-span-3 hidden md:flex items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {file.lastModified}
              </span>
            </div>
            
            <div className="col-span-1 flex items-center justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileClick(file);
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {file.type === 'folder' ? 'Open' : 'Download'}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRename(file);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600 dark:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(file);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;
