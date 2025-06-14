import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from './ui/button';
import { useFileManager } from '../contexts/FileManagerContext';

const FloatingUploadButton: React.FC = () => {
  const { openModal } = useFileManager();

  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden">
      <Button
        onClick={() => openModal('upload')}
        size="lg"
        className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      >
        <Upload className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default FloatingUploadButton;