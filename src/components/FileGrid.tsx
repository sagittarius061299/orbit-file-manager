
import React from 'react';
import { FileItem } from '../contexts/FileManagerContext';
import FileCard from './FileCard';

interface FileGridProps {
  files: FileItem[];
}

const FileGrid: React.FC<FileGridProps> = ({ files }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {files.map((file) => (
        <FileCard key={file.id} file={file} />
      ))}
    </div>
  );
};

export default FileGrid;
