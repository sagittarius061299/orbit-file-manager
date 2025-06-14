
import React from 'react';
import { useFileManager } from '../../contexts/FileManagerContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Download, Edit, Trash2, X } from 'lucide-react';

const FilePreviewModal: React.FC = () => {
  const { modals, closeModal, previewFile, setRenameItem, setDeleteItems, openModal } = useFileManager();

  const handleRename = () => {
    if (previewFile) {
      setRenameItem(previewFile);
      closeModal('preview');
      openModal('rename');
    }
  };

  const handleDelete = () => {
    if (previewFile) {
      setDeleteItems([previewFile]);
      closeModal('preview');
      openModal('delete');
    }
  };

  const handleClose = () => {
    closeModal('preview');
  };

  if (!previewFile) return null;

  return (
    <Dialog open={modals.preview} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{previewFile.icon}</span>
              {previewFile.name}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* File Preview Area */}
          <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="text-center">
              <div className="text-6xl mb-4">{previewFile.icon}</div>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                File Preview
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Preview not available for this file type
              </p>
            </div>
          </div>

          {/* File Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">File Name</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{previewFile.name}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">File Size</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{previewFile.size || 'Unknown'}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Last Modified</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{previewFile.lastModified}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">File Type</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{previewFile.type}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" onClick={handleRename}>
              <Edit className="w-4 h-4 mr-2" />
              Rename
            </Button>
            <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilePreviewModal;
