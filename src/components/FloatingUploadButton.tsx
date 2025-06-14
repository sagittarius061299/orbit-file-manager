import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useFileManager } from '../contexts/FileManagerContext';

const FloatingUploadButton: React.FC = () => {
  const { openModal } = useFileManager();

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 right-6 z-50">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => openModal('upload')}
              size="lg"
              className="h-14 w-14 rounded-2xl gradient-primary hover:scale-110 text-white shadow-xl hover:shadow-2xl transition-all duration-300 border-0 hover-glow animate-glow-pulse"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="mr-3 glass-card border border-border/40 shadow-lg rounded-lg">
            <p className="font-medium">Upload File</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default FloatingUploadButton;