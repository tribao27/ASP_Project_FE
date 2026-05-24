/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import antdTheme from './theme/antdTheme.js';
import groupService from './api/groupService.js';
import useDocuments from './hooks/useDocuments.js';

import IntroScreen from './pages/IntroScreen.jsx';
import LoginScreen from './pages/LoginScreen.jsx';
import DashboardScreen from './pages/DashboardScreen.jsx';
import AIScreen from './pages/AIScreen.jsx';
import CommunityScreen from './pages/CommunityScreen.jsx';
import GroupDetailScreen from './pages/GroupDetailScreen.jsx';
import ProfileScreen from './pages/ProfileScreen.jsx';
import PaymentScreen from './pages/PaymentScreen.jsx';
import AdminScreen from './pages/AdminScreen.jsx';
import AdminLoginScreen from './pages/AdminLoginScreen.jsx';
import TrashScreen from './pages/TrashScreen.jsx';
import MainLayout from './layouts/MainLayout.jsx';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [deletedDocuments, setDeletedDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [accentColor, setAccentColor] = useState('#ff5c00');
  const [avatarUrl, setAvatarUrl] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuBow5mVfiNdaRBNOhUCDdCECelWMAJJIH-qphguPGLIXAfufQTeX5TZ1eZPJ2RfSdkXaqpdbdRwUwLhYiIolmk3c-psChGFWbL2n9oQPwS08-ynfA4bX-5j8Sgxl14-8lsQ9I6NnQy-uqdllZ9XeAPJTOidzr-LY7Xpd1_50olXILb8G_q9AznJwl2LlMupMfzTJViLVuvF-kYTH8HYBj56IAbsBVfAUq8LFA6TipGCkhC8NWRgYYa1dTJuQEBM2wBc6vdwKHvjv3o');

  const { documents, activeDoc, addDocument, removeDocument, selectActiveDoc } = useDocuments();
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

  // Authentication protected navigation wrapper
  const handleNavigate = (view) => {
    setSearchTerm(''); // Reset search on page change
    setCurrentGroupId(null); // Reset group view
    
    const pathMap = {
      'landing': '/',
      'login': '/login',
      'register': '/register',
      'dashboard': '/dashboard',
      'ai': '/ai',
      'community': '/community',
      'profile': '/profile',
      'trash': '/trash',
      'payment': '/payment',
      'admin-login': '/admin/login',
      'admin-dashboard': '/admin'
    };

    const isPublicView = ['landing', 'login', 'register', 'admin-login'].includes(view);
    
    if (!currentUser && !isAdmin && !isPublicView) {
      navigate('/login');
    } else {
      navigate(pathMap[view] || '/');
    }
  };

  // Auth callbacks
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
    navigate('/admin/login');
  };

  // Document custom deletion and restoration flows
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

  // Community group actions
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
  
  // Determine currentView string for MainLayout active state based on pathname
  const getCurrentViewFromPath = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'dashboard';
    if (path.startsWith('/ai')) return 'ai';
    if (path.startsWith('/community')) return 'community';
    if (path.startsWith('/profile')) return 'profile';
    if (path.startsWith('/trash')) return 'trash';
    if (path.startsWith('/payment')) return 'payment';
    if (path === '/admin/login') return 'admin-login';
    if (path.startsWith('/admin')) return 'admin-dashboard';
    return 'landing';
  };

  const currentView = getCurrentViewFromPath();
  const isSidebarVisible = ['dashboard', 'ai', 'community', 'profile', 'trash', 'payment'].includes(currentView);

  const pageContent = (
    <Routes>
      <Route path="/" element={<IntroScreen onNavigate={handleNavigate} />} />
      <Route path="/login" element={<LoginScreen onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} currentView="login" />} />
      <Route path="/register" element={<LoginScreen onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} currentView="register" />} />
      <Route path="/dashboard" element={
        <DashboardScreen
          documents={documents}
          searchTerm={searchTerm}
          onAddDocument={addDocument}
          onRemoveDocument={handleRemoveDocument}
          onSelectActiveDocument={selectActiveDoc}
          currentUser={currentUser || 'Alex Nguyen'}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      } />
      <Route path="/ai" element={
        <AIScreen
          documents={documents}
          activeDoc={activeDoc}
          searchTerm={searchTerm}
          onSelectActiveDoc={selectActiveDoc}
          onNavigate={handleNavigate}
          accentColor={accentColor}
        />
      } />
      <Route path="/community" element={
        currentGroupId ? (
          <GroupDetailScreen
            group={groups.find(g => g.id === currentGroupId)}
            currentUser={currentUser || 'vuongbaovipvip@gmail.com'}
            storagePercentage={storagePercentage}
            onBack={() => setCurrentGroupId(null)}
            onPublishDocument={handlePublishDocumentGroup}
            onDeleteDocument={handleDeleteGroupDocument}
            onApproveJoin={handleApproveJoinGroup}
            onRejectJoin={handleRejectJoinGroup}
          />
        ) : (
          <CommunityScreen
            groups={groups}
            searchTerm={searchTerm}
            currentUser={currentUser || 'vuongbaovipvip@gmail.com'}
            onRequestJoin={handleRequestJoinGroup}
            onViewDetail={setCurrentGroupId}
            onAddGroup={handleAddCommunityGroup}
            onNavigate={handleNavigate}
          />
        )
      } />
      <Route path="/profile" element={
        <ProfileScreen
          currentUser={currentUser || 'vuongbaovipvip@gmail.com'}
          documentsCount={documents.length}
          storagePercentage={storagePercentage}
          avatarUrl={avatarUrl}
          onAvatarChange={setAvatarUrl}
          accentColor={accentColor}
          onAccentColorChange={(color) => {
            setAccentColor(color);
            document.documentElement.style.setProperty('--color-primary', color);
          }}
        />
      } />
      <Route path="/payment" element={
        <PaymentScreen
          accentColor={accentColor}
          onNavigate={handleNavigate}
        />
      } />
      <Route path="/trash" element={
        <TrashScreen
          deletedDocs={deletedDocuments}
          onRestoreDoc={handleRestoreDocument}
          onPermanentlyDeleteDoc={handlePermanentlyDeleteDocument}
        />
      } />
      <Route path="/admin/login" element={
        isAdmin ? <Navigate to="/admin" replace /> : <AdminLoginScreen onLoginSuccess={handleAdminLoginSuccess} />
      } />
      <Route path="/admin" element={
        isAdmin ? <AdminScreen onLogout={handleAdminLogout} /> : <Navigate to="/admin/login" replace />
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );

  return (
    <StyleProvider layer>
      <ConfigProvider theme={{
        ...antdTheme,
        token: {
          ...antdTheme.token,
          colorPrimary: accentColor,
          colorPrimaryHover: accentColor + 'ee',
          colorPrimaryActive: accentColor,
        }
      }}>
        <AntApp>
          <div id="root-portal-view" className="w-full min-h-screen bg-white text-[#1d1d1f] font-sans">
            {isSidebarVisible ? (
              <MainLayout
                currentView={currentView}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
                currentUser={currentUser}
                storagePercentage={storagePercentage}
                documentsCount={documents.length}
                deletedDocsCount={deletedDocuments.length}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                avatarUrl={avatarUrl}
                accentColor={accentColor}
                isAdmin={isAdmin}
              >
                {pageContent}
              </MainLayout>
            ) : (
              pageContent
            )}
          </div>
        </AntApp>
      </ConfigProvider>
    </StyleProvider>
  );
}
