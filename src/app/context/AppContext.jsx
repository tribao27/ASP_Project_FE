import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import groupService from '@/features/community/services/community.service.js';
import useDocuments from '@/features/dashboard/hooks/useDocuments.js';

const AppContext = createContext(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [deletedDocuments, setDeletedDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [accentColor, setAccentColor] = useState('#ff5c00');
  const [avatarUrl, setAvatarUrl] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuBow5mVfiNdaRBNOhUCDdCECelWMAJJIH-qphguPGLIXAfufQTeX5TZ1eZPJ2RfSdkXaqpdbdRwUwLhYiIolmk3c-psChGFWbL2n9oQPwS08-ynfA4bX-5j8Sgxl14-8lsQ9I6NnQy-uqdllZ9XeAPJTOidzr-LY7Xpd1_50olXILb8G_q9AznJwl2LlMupMfzTJViLVuvF-kYTH8HYBj56IAbsBVfAUq8LFA6TipGCkhC8NWRgYYa1dTJuQEBM2wBc6vdwKHvjv3o');

  const { documents, activeDoc, addDocument, removeDocument, renameDocument, selectActiveDoc } = useDocuments();
  const [groups, setGroups] = useState([]);
  const [currentGroupId, setCurrentGroupId] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await groupService.getAllGroups();
        setGroups(data);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      }
    };
    fetchGroups();
  }, []);

  const handleNavigate = (view) => {
    setSearchTerm('');
    setCurrentGroupId(null);

    const pathMap = {
      'landing': '/',
      'login': '/login',
      'register': '/register',
      'forgot-password': '/forgot-password',
      'dashboard': '/dashboard',
      'ai': '/ai',
      'community': '/community',
      'profile': '/profile',
      'trash': '/trash',
      'payment': '/payment',
      'admin-dashboard': '/admin'
    };

    const isPublicView = ['landing', 'login', 'register', 'forgot-password'].includes(view);
    if (!currentUser && !isAdmin && !isPublicView) {
      navigate('/login');
    } else {
      navigate(pathMap[view] || '/');
    }
  };

  const handleLoginSuccess = (email) => {
    setCurrentUser(email);
    setIsAdmin(false);
    navigate('/dashboard');
  };

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    navigate('/admin');
  };

  const handleLogout = () => {
    setCurrentUser('');
    navigate('/');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    navigate('/login');
  };

  const handleRemoveDocument = (docId) => {
    const docToRemove = documents.find((d) => d.id === docId);
    if (docToRemove) {
      removeDocument(docId);
      setDeletedDocuments((prev) => [...prev, docToRemove]);
    }
  };

  const handleRestoreDocument = (doc) => {
    setDeletedDocuments((prev) => prev.filter((d) => d.id !== doc.id));
    addDocument(doc);
  };

  const handlePermanentlyDeleteDocument = (docId) => {
    setDeletedDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  const handleAddCommunityGroup = (newGroup) => {
    setGroups((prev) => [newGroup, ...prev]);
  };

  const handleRequestJoinGroup = (groupId) => {
    setGroups(prev => prev.map(grp => {
      if (grp.id === groupId && !grp.pendingRequests?.includes(currentUser || 'vuongbaovipvip@gmail.com')) {
        return { ...grp, pendingRequests: [...(grp.pendingRequests || []), currentUser || 'vuongbaovipvip@gmail.com'] };
      }
      return grp;
    }));
  };

  const handleApproveJoinGroup = (groupId, userEmail) => {
    setGroups(prev => prev.map(grp => {
      if (grp.id === groupId) {
        return {
          ...grp,
          pendingRequests: grp.pendingRequests.filter(e => e !== userEmail),
          members: [...grp.members, { email: userEmail, role: 'member', joinedAt: new Date().toISOString().split('T')[0] }]
        };
      }
      return grp;
    }));
  };

  const handleRejectJoinGroup = (groupId, userEmail) => {
    setGroups(prev => prev.map(grp => {
      if (grp.id === groupId) {
        return {
          ...grp,
          pendingRequests: grp.pendingRequests.filter(e => e !== userEmail)
        };
      }
      return grp;
    }));
  };

  const handlePublishDocumentGroup = (groupId, document) => {
    setGroups(prev => prev.map(grp => {
      if (grp.id === groupId) {
        return { ...grp, documents: [...(grp.documents || []), document] };
      }
      return grp;
    }));
  };

  const handleDeleteGroupDocument = (groupId, docId) => {
    setGroups(prev => prev.map(grp => {
      if (grp.id === groupId) {
        return { ...grp, documents: grp.documents.filter(d => d.id !== docId) };
      }
      return grp;
    }));
  };

  const storagePercentage = Math.min(100, Math.max(15, documents.length * 12.5));

  const getCurrentViewFromPath = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'dashboard';
    if (path.startsWith('/ai')) return 'ai';
    if (path.startsWith('/community')) return 'community';
    if (path.startsWith('/profile')) return 'profile';
    if (path.startsWith('/trash')) return 'trash';
    if (path.startsWith('/payment')) return 'payment';
    if (path.startsWith('/admin')) return 'admin-dashboard';
    return 'landing';
  };

  const currentView = getCurrentViewFromPath();
  const isSidebarVisible = ['dashboard', 'ai', 'community', 'profile', 'trash', 'payment'].includes(currentView);

  const value = {
    currentUser, isAdmin, deletedDocuments, searchTerm, accentColor, avatarUrl,
    documents, activeDoc, groups, currentGroupId, storagePercentage, currentView, isSidebarVisible,
    setSearchTerm, setAccentColor, setAvatarUrl, setCurrentGroupId,
    addDocument, renameDocument, selectActiveDoc,
    handleNavigate, handleLoginSuccess, handleAdminLoginSuccess, handleLogout, handleAdminLogout,
    handleRemoveDocument, handleRestoreDocument, handlePermanentlyDeleteDocument,
    handleAddCommunityGroup, handleRequestJoinGroup, handleApproveJoinGroup, handleRejectJoinGroup,
    handlePublishDocumentGroup, handleDeleteGroupDocument
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
