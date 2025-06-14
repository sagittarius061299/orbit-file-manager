
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  lastModified: string;
  icon: string;
  parent?: string;
  path: string; // Full path like "documents/projects/2024"
}

export interface Folder {
  id: string;
  name: string;
  parent?: string;
  children: string[];
  path: string; // Full path like "documents/projects"
}

interface FileManagerContextType {
  files: FileItem[];
  folders: Folder[];
  currentFolder: string;
  currentPath: string[];
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
  navigateToPath: (pathArray: string[]) => void;
  setCurrentFilter: (filter: string) => void;
  currentFilter: string;
  getBreadcrumbs: () => { id: string; name: string; path: string[] }[];
}

const FileManagerContext = createContext<FileManagerContextType | undefined>(undefined);

// Create nested folder structure
const createNestedFolders = (): Folder[] => {
  return [
    {
      id: 'root',
      name: 'My Drive',
      path: '',
      children: ['documents', 'pictures', 'videos', 'music', 'downloads']
    },
    // Documents folder structure
    {
      id: 'documents',
      name: 'Documents',
      parent: 'root',
      path: 'documents',
      children: ['projects', 'personal', 'work']
    },
    {
      id: 'projects',
      name: 'Projects',
      parent: 'documents',
      path: 'documents/projects',
      children: ['2024', 'archived']
    },
    {
      id: '2024',
      name: '2024',
      parent: 'projects',
      path: 'documents/projects/2024',
      children: ['reports', 'presentations', 'research']
    },
    {
      id: 'reports',
      name: 'Reports',
      parent: '2024',
      path: 'documents/projects/2024/reports',
      children: ['q1', 'q2', 'q3', 'q4']
    },
    {
      id: 'q1',
      name: 'Q1',
      parent: 'reports',
      path: 'documents/projects/2024/reports/q1',
      children: []
    },
    {
      id: 'q2',
      name: 'Q2',
      parent: 'reports',
      path: 'documents/projects/2024/reports/q2',
      children: []
    },
    {
      id: 'presentations',
      name: 'Presentations',
      parent: '2024',
      path: 'documents/projects/2024/presentations',
      children: []
    },
    {
      id: 'research',
      name: 'Research',
      parent: '2024',
      path: 'documents/projects/2024/research',
      children: []
    },
    {
      id: 'archived',
      name: 'Archived',
      parent: 'projects',
      path: 'documents/projects/archived',
      children: ['2023', '2022']
    },
    {
      id: '2023',
      name: '2023',
      parent: 'archived',
      path: 'documents/projects/archived/2023',
      children: []
    },
    {
      id: 'personal',
      name: 'Personal',
      parent: 'documents',
      path: 'documents/personal',
      children: ['taxes', 'insurance', 'medical']
    },
    {
      id: 'work',
      name: 'Work',
      parent: 'documents',
      path: 'documents/work',
      children: ['contracts', 'invoices', 'meetings']
    },
    // Pictures folder structure
    {
      id: 'pictures',
      name: 'Pictures',
      parent: 'root',
      path: 'pictures',
      children: ['vacation', 'family', 'events']
    },
    {
      id: 'vacation',
      name: 'Vacation',
      parent: 'pictures',
      path: 'pictures/vacation',
      children: ['2024-summer', '2023-winter']
    },
    // Other root folders
    {
      id: 'videos',
      name: 'Videos',
      parent: 'root',
      path: 'videos',
      children: ['tutorials', 'recordings']
    },
    {
      id: 'music',
      name: 'Music',
      parent: 'root',
      path: 'music',
      children: ['playlists', 'albums']
    },
    {
      id: 'downloads',
      name: 'Downloads',
      parent: 'root',
      path: 'downloads',
      children: []
    }
  ];
};

// Generate files for different folders
const generateNestedFiles = (): FileItem[] => {
  const files: FileItem[] = [];
  
  // Root level files and folders (folders are created as FileItems for display)
  const mockFolders = createNestedFolders();
  const rootFolders = ['documents', 'pictures', 'videos', 'music', 'downloads'];
  rootFolders.forEach((folderId, index) => {
    const folder = mockFolders.find(f => f.id === folderId);
    if (folder) {
      files.push({
        id: folderId,
        name: folder.name,
        type: 'folder',
        lastModified: ['1 day ago', '2 days ago', '1 week ago', '3 days ago', '5 days ago'][index],
        icon: '📁',
        parent: 'root',
        path: ''
      });
    }
  });

  files.push(
    {
      id: 'file-1',
      name: 'Getting Started.pdf',
      type: 'file',
      size: '2.5 MB',
      lastModified: '2 hours ago',
      icon: '📄',
      parent: 'root',
      path: ''
    },
    {
      id: 'file-2',
      name: 'README.txt',
      type: 'file',
      size: '1.2 KB',
      lastModified: '1 day ago',
      icon: '📝',
      parent: 'root',
      path: ''
    }
  );

  // Documents folder subfolders
  const docFolders = ['projects', 'personal', 'work'];
  docFolders.forEach((folderId, index) => {
    const folder = mockFolders.find(f => f.id === folderId);
    if (folder) {
      files.push({
        id: folderId,
        name: folder.name,
        type: 'folder',
        lastModified: ['2 weeks ago', '1 month ago', '3 weeks ago'][index],
        icon: '📁',
        parent: 'documents',
        path: 'documents'
      });
    }
  });

  // Projects folder subfolders
  const projFolders = ['2024', 'archived'];
  projFolders.forEach((folderId, index) => {
    const folder = mockFolders.find(f => f.id === folderId);
    if (folder) {
      files.push({
        id: folderId,
        name: folder.name,
        type: 'folder',
        lastModified: ['1 week ago', '6 months ago'][index],
        icon: '📁',
        parent: 'projects',
        path: 'documents/projects'
      });
    }
  });

  // 2024 folder subfolders
  const year2024Folders = ['reports', 'presentations', 'research'];
  year2024Folders.forEach((folderId, index) => {
    const folder = mockFolders.find(f => f.id === folderId);
    if (folder) {
      files.push({
        id: folderId,
        name: folder.name,
        type: 'folder',
        lastModified: ['3 days ago', '1 week ago', '2 weeks ago'][index],
        icon: '📁',
        parent: '2024',
        path: 'documents/projects/2024'
      });
    }
  });

  // Reports folder subfolders
  const reportsFolders = ['q1', 'q2', 'q3', 'q4'];
  reportsFolders.forEach((folderId, index) => {
    const folder = mockFolders.find(f => f.id === folderId);
    if (folder) {
      files.push({
        id: folderId,
        name: folder.name,
        type: 'folder',
        lastModified: ['1 day ago', '1 week ago', '2 weeks ago', '3 weeks ago'][index],
        icon: '📁',
        parent: 'reports',
        path: 'documents/projects/2024/reports'
      });
    }
  });

  // Pictures folder subfolders
  const picFolders = ['vacation', 'family', 'events'];
  picFolders.forEach((folderId, index) => {
    const folder = mockFolders.find(f => f.id === folderId);
    if (folder) {
      files.push({
        id: folderId,
        name: folder.name,
        type: 'folder',
        lastModified: ['2 months ago', '3 months ago', '1 month ago'][index],
        icon: '📁',
        parent: 'pictures',
        path: 'pictures'
      });
    }
  });

  // Documents/Projects/2024/Reports/Q1 files
  files.push(
    {
      id: 'file-3',
      name: 'Q1 Financial Report.pdf',
      type: 'file',
      size: '5.8 MB',
      lastModified: '3 days ago',
      icon: '📊',
      parent: 'q1',
      path: 'documents/projects/2024/reports/q1'
    },
    {
      id: 'file-4',
      name: 'Sales Analysis.xlsx',
      type: 'file',
      size: '3.2 MB',
      lastModified: '5 days ago',
      icon: '📈',
      parent: 'q1',
      path: 'documents/projects/2024/reports/q1'
    },
    {
      id: 'file-5',
      name: 'Market Research.docx',
      type: 'file',
      size: '2.1 MB',
      lastModified: '1 week ago',
      icon: '📄',
      parent: 'q1',
      path: 'documents/projects/2024/reports/q1'
    }
  );

  // Documents/Projects/2024/Presentations files
  files.push(
    {
      id: 'file-6',
      name: 'Company Overview.pptx',
      type: 'file',
      size: '15.3 MB',
      lastModified: '2 weeks ago',
      icon: '📽️',
      parent: 'presentations',
      path: 'documents/projects/2024/presentations'
    },
    {
      id: 'file-7',
      name: 'Product Demo.pptx',
      type: 'file',
      size: '22.1 MB',
      lastModified: '3 weeks ago',
      icon: '📽️',
      parent: 'presentations',
      path: 'documents/projects/2024/presentations'
    }
  );

  // Pictures/Vacation files
  files.push(
    {
      id: 'file-8',
      name: 'Beach Sunset.jpg',
      type: 'file',
      size: '4.7 MB',
      lastModified: '1 month ago',
      icon: '🖼️',
      parent: 'vacation',
      path: 'pictures/vacation'
    },
    {
      id: 'file-9',
      name: 'Mountain View.jpg',
      type: 'file',
      size: '6.2 MB',
      lastModified: '1 month ago',
      icon: '🖼️',
      parent: 'vacation',
      path: 'pictures/vacation'
    }
  );

  return files;
};

const mockFolders: Folder[] = createNestedFolders();
const mockFiles: FileItem[] = generateNestedFiles();

export const FileManagerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [files] = useState<FileItem[]>(mockFiles);
  const [folders] = useState<Folder[]>(mockFolders);
  const [currentFolder, setCurrentFolder] = useState('root');
  const [currentPath, setCurrentPath] = useState<string[]>([]);
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
    const pathname = location.pathname;
    if (pathname.startsWith('/folder/')) {
      const pathSegments = pathname.replace('/folder/', '').split('/').filter(Boolean);
      setCurrentPath(pathSegments);
      
      // Find the folder that matches this path
      const targetPath = pathSegments.join('/');
      const targetFolder = folders.find(f => f.path === targetPath);
      if (targetFolder) {
        setCurrentFolder(targetFolder.id);
      } else if (pathSegments.length === 0) {
        setCurrentFolder('root');
        setCurrentPath([]);
      }
    } else {
      setCurrentFolder('root');
      setCurrentPath([]);
    }
  }, [location.pathname, folders]);

  const openModal = (modal: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modal]: true }));
  };

  const closeModal = (modal: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modal]: false }));
  };

  const navigateToFolder = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (folder) {
      setCurrentFolder(folderId);
      if (folderId === 'root') {
        setCurrentPath([]);
        navigate('/');
      } else {
        const pathSegments = folder.path.split('/').filter(Boolean);
        setCurrentPath(pathSegments);
        navigate(`/folder/${folder.path}`);
      }
    }
  };

  const navigateToPath = (pathArray: string[]) => {
    const targetPath = pathArray.join('/');
    const targetFolder = folders.find(f => f.path === targetPath);
    
    if (targetFolder) {
      setCurrentFolder(targetFolder.id);
      setCurrentPath(pathArray);
      navigate(pathArray.length === 0 ? '/' : `/folder/${targetPath}`);
    } else {
      // Fallback to root
      setCurrentFolder('root');
      setCurrentPath([]);
      navigate('/');
    }
  };

  const getBreadcrumbs = () => {
    const breadcrumbs: { id: string; name: string; path: string[] }[] = [];
    
    for (let i = 0; i <= currentPath.length; i++) {
      const pathSegments = currentPath.slice(0, i);
      const pathString = pathSegments.join('/');
      
      if (i === 0) {
        // Root
        breadcrumbs.push({
          id: 'root',
          name: 'My Drive',
          path: []
        });
      } else {
        const folder = folders.find(f => f.path === pathString);
        if (folder) {
          breadcrumbs.push({
            id: folder.id,
            name: folder.name,
            path: pathSegments
          });
        }
      }
    }
    
    return breadcrumbs;
  };

  const handleSetCurrentFilter = (filter: string) => {
    setCurrentFilter(filter);
  };

  const handleSetSearchQuery = (query: string) => {
    setSearchQuery(query);
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
    
    return files.filter(file => 
      file.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <FileManagerContext.Provider value={{
      files,
      folders,
      currentFolder,
      currentPath,
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
      navigateToFolder,
      navigateToPath,
      getBreadcrumbs
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
