
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  lastModified: string;
  icon: string;
  parent?: string;
}

export interface Folder {
  id: string;
  name: string;
  parent?: string;
  children: string[];
}

interface FileManagerContextType {
  files: FileItem[];
  folders: Folder[];
  currentFolder: string;
  viewMode: 'grid' | 'list';
  selectedItems: string[];
  searchQuery: string;
  modals: {
    createFolder: boolean;
    upload: boolean;
    preview: boolean;
    rename: boolean;
    delete: boolean;
  };
  previewFile: FileItem | null;
  renameItem: FileItem | null;
  deleteItems: FileItem[];
  setCurrentFolder: (folderId: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setSelectedItems: (items: string[]) => void;
  setSearchQuery: (query: string) => void;
  openModal: (modal: keyof FileManagerContextType['modals']) => void;
  closeModal: (modal: keyof FileManagerContextType['modals']) => void;
  setPreviewFile: (file: FileItem | null) => void;
  setRenameItem: (item: FileItem | null) => void;
  setDeleteItems: (items: FileItem[]) => void;
}

const FileManagerContext = createContext<FileManagerContextType | undefined>(undefined);

// Mock data
const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'Project Proposal.pdf',
    type: 'file',
    size: '2.4 MB',
    lastModified: '2 hours ago',
    icon: '📄',
    parent: 'root'
  },
  {
    id: '2',
    name: 'Design Assets',
    type: 'folder',
    lastModified: '1 day ago',
    icon: '📁',
    parent: 'root'
  },
  {
    id: '3',
    name: 'presentation.pptx',
    type: 'file',
    size: '15.2 MB',
    lastModified: '3 days ago',
    icon: '📊',
    parent: 'root'
  },
  {
    id: '4',
    name: 'vacation-photo.jpg',
    type: 'file',
    size: '3.8 MB',
    lastModified: '1 week ago',
    icon: '🖼️',
    parent: 'root'
  },
  {
    id: '5',
    name: 'Documents',
    type: 'folder',
    lastModified: '2 weeks ago',
    icon: '📂',
    parent: 'root'
  },
  {
    id: '6',
    name: 'logo-design.ai',
    type: 'file',
    size: '892 KB',
    lastModified: '1 day ago',
    icon: '🎨',
    parent: '2'
  }
];

const mockFolders: Folder[] = [
  {
    id: 'root',
    name: 'My Drive',
    children: ['1', '2', '3', '4', '5']
  },
  {
    id: '2',
    name: 'Design Assets',
    parent: 'root',
    children: ['6']
  },
  {
    id: '5',
    name: 'Documents',
    parent: 'root',
    children: []
  }
];

export const FileManagerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [files] = useState<FileItem[]>(mockFiles);
  const [folders] = useState<Folder[]>(mockFolders);
  const [currentFolder, setCurrentFolder] = useState('root');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [renameItem, setRenameItem] = useState<FileItem | null>(null);
  const [deleteItems, setDeleteItems] = useState<FileItem[]>([]);
  const [modals, setModals] = useState({
    createFolder: false,
    upload: false,
    preview: false,
    rename: false,
    delete: false
  });

  const openModal = (modal: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modal]: true }));
  };

  const closeModal = (modal: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modal]: false }));
  };

  return (
    <FileManagerContext.Provider value={{
      files,
      folders,
      currentFolder,
      viewMode,
      selectedItems,
      searchQuery,
      modals,
      previewFile,
      renameItem,
      deleteItems,
      setCurrentFolder,
      setViewMode,
      setSelectedItems,
      setSearchQuery,
      openModal,
      closeModal,
      setPreviewFile,
      setRenameItem,
      setDeleteItems
    }}>
      {children}
    </FileManagerContext.Provider>
  );
};

export const useFileManager = () => {
  const context = useContext(FileManagerContext);
  if (context === undefined) {
    throw new Error('useFileManager must be used within a FileManagerProvider');
  }
  return context;
};
