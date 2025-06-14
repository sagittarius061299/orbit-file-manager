
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
  // Pagination
  displayedFiles: FileItem[];
  isLoading: boolean;
  hasMore: boolean;
  loadMoreFiles: () => Promise<void>;
  resetPagination: () => void;
  // Methods
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

// Generate 100 mock files
const generateMockFiles = (): FileItem[] => {
  const fileTypes = [
    { extensions: ['pdf', 'doc', 'docx', 'txt'], icons: ['📄', '📝', '📋'], type: 'documents' },
    { extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'], icons: ['🖼️', '📸', '🎨'], type: 'pictures' },
    { extensions: ['mp4', 'avi', 'mov', 'mkv'], icons: ['🎬', '📹', '🎥'], type: 'videos' },
    { extensions: ['mp3', 'wav', 'flac'], icons: ['🎵', '🎶', '🔊'], type: 'music' },
    { extensions: ['zip', 'rar', 'exe', 'dmg'], icons: ['📦', '⚙️', '🔧'], type: 'other' }
  ];

  const names = [
    'Project Proposal', 'Design Assets', 'Meeting Notes', 'Vacation Photos', 'Budget Report',
    'Marketing Campaign', 'User Research', 'Product Mockup', 'Brand Guidelines', 'Financial Data',
    'Client Presentation', 'Team Photos', 'Architecture Docs', 'Launch Plan', 'User Feedback',
    'Analytics Report', 'Design System', 'Roadmap 2024', 'Customer Survey', 'Training Materials',
    'Performance Metrics', 'Website Backup', 'Social Media Kit', 'Legal Documents', 'Quarterly Review'
  ];

  const timeStamps = [
    '2 hours ago', '1 day ago', '3 days ago', '1 week ago', '2 weeks ago', '1 month ago',
    '2 months ago', '3 months ago', '6 months ago', '1 year ago'
  ];

  const files: FileItem[] = [];
  
  // Add some folders first
  for (let i = 0; i < 15; i++) {
    files.push({
      id: `folder-${i}`,
      name: names[i % names.length] + (i > names.length - 1 ? ` ${Math.floor(i / names.length) + 1}` : ''),
      type: 'folder',
      lastModified: timeStamps[i % timeStamps.length],
      icon: '📁',
      parent: 'root'
    });
  }

  // Add files
  for (let i = 0; i < 85; i++) {
    const fileType = fileTypes[i % fileTypes.length];
    const extension = fileType.extensions[i % fileType.extensions.length];
    const icon = fileType.icons[i % fileType.icons.length];
    const name = names[i % names.length];
    const size = `${(Math.random() * 50 + 0.1).toFixed(1)} MB`;
    
    files.push({
      id: `file-${i}`,
      name: `${name}${i > names.length - 1 ? ` ${Math.floor(i / names.length) + 1}` : ''}.${extension}`,
      type: 'file',
      size,
      lastModified: timeStamps[i % timeStamps.length],
      icon,
      parent: 'root'
    });
  }

  return files;
};

const mockFiles: FileItem[] = generateMockFiles();

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

  // Pagination state
  const [displayedFiles, setDisplayedFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const PAGE_SIZE = 20;

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

  // Helper function to get filtered files
  const getFilteredFiles = () => {
    return files.filter(file => {
      const matchesFolder = file.parent === currentFolder;
      const matchesSearch = searchQuery === '' || 
        file.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Apply type filter
      let matchesFilter = true;
      if (currentFilter !== 'all') {
        const getFileType = (file: FileItem) => {
          if (file.type === 'folder') return 'folder';
          
          const extension = file.name.split('.').pop()?.toLowerCase();
          if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) return 'pictures';
          if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'].includes(extension || '')) return 'videos';
          if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension || '')) return 'documents';
          if (['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(extension || '')) return 'music';
          return 'other';
        };
        
        const fileType = getFileType(file);
        matchesFilter = fileType === currentFilter || file.type === 'folder';
      }
      
      return matchesFolder && matchesSearch && matchesFilter;
    });
  };

  // Load more files function
  const loadMoreFiles = async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const filteredFiles = getFilteredFiles();
    const nextPage = currentPage + 1;
    const newFiles = filteredFiles.slice(0, (nextPage + 1) * PAGE_SIZE);
    
    setDisplayedFiles(newFiles);
    setCurrentPage(nextPage);
    setHasMore(newFiles.length < filteredFiles.length);
    setIsLoading(false);
  };

  // Reset pagination function
  const resetPagination = () => {
    const filteredFiles = getFilteredFiles();
    const initialFiles = filteredFiles.slice(0, PAGE_SIZE);
    
    setDisplayedFiles(initialFiles);
    setCurrentPage(0);
    setHasMore(initialFiles.length < filteredFiles.length);
    setIsLoading(false);
  };

  // Initialize pagination when filters change
  useEffect(() => {
    resetPagination();
  }, [currentFolder, currentFilter, searchQuery]);

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
      // Pagination
      displayedFiles,
      isLoading,
      hasMore,
      loadMoreFiles,
      resetPagination,
      // Methods
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
