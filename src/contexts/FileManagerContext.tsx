
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';

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
  searchFiles: (query: string) => Promise<FileItem[]>;
  navigateToFolder: (folderId: string) => void;
  setCurrentFilter: (filter: string) => void;
  currentFilter: string;
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
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [files] = useState<FileItem[]>(mockFiles);
  const [folders] = useState<Folder[]>(mockFolders);
  const [currentFolder, setCurrentFolder] = useState('root');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
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

  // Initialize state from URL
  useEffect(() => {
    if (params.folderId) {
      setCurrentFolder(params.folderId);
    }
    
    const typeParam = searchParams.get('type');
    if (typeParam) {
      setCurrentFilter(typeParam);
    }
    
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [params.folderId, searchParams]);

  const openModal = (modal: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modal]: true }));
  };

  const closeModal = (modal: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modal]: false }));
  };

  const navigateToFolder = (folderId: string) => {
    setCurrentFolder(folderId);
    if (folderId === 'root') {
      navigate('/');
    } else {
      navigate(`/folder/${folderId}`);
    }
  };

  const handleSetCurrentFilter = (filter: string) => {
    setCurrentFilter(filter);
    const newSearchParams = new URLSearchParams(searchParams);
    if (filter === 'all') {
      newSearchParams.delete('type');
    } else {
      newSearchParams.set('type', filter);
    }
    setSearchParams(newSearchParams);
  };

  const handleSetSearchQuery = (query: string) => {
    setSearchQuery(query);
    const newSearchParams = new URLSearchParams(searchParams);
    if (query) {
      newSearchParams.set('q', query);
    } else {
      newSearchParams.delete('q');
    }
    setSearchParams(newSearchParams);
  };

  // Simulate API search functionality
  const searchFiles = async (query: string): Promise<FileItem[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simulate API endpoint call
    console.log(`API Call: /api/search?q=${encodeURIComponent(query)}`);
    
    return files.filter(file => 
      file.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <FileManagerContext.Provider value={{
      files,
      folders,
      currentFolder,
      viewMode,
      selectedItems,
      searchQuery,
      currentFilter,
      modals,
      previewFile,
      renameItem,
      deleteItems,
      setCurrentFolder: navigateToFolder,
      setViewMode,
      setSelectedItems,
      setSearchQuery: handleSetSearchQuery,
      setCurrentFilter: handleSetCurrentFilter,
      openModal,
      closeModal,
      setPreviewFile,
      setRenameItem,
      setDeleteItems,
      searchFiles,
      navigateToFolder
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
