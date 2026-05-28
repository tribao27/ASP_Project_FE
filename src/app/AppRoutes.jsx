import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext.jsx';

import IntroScreen from '@/features/landing/pages/IntroScreen.jsx';
import LoginScreen from '@/features/auth/pages/LoginScreen.jsx';
import DashboardScreen from '@/features/dashboard/pages/DashboardScreen.jsx';
import AIScreen from '@/features/ai/pages/AIScreen.jsx';
import CommunityScreen from '@/features/community/pages/CommunityScreen.jsx';
import GroupDetailScreen from '@/features/group-detail/pages/GroupDetailScreen.jsx';
import ProfileScreen from '@/features/profile/pages/ProfileScreen.jsx';
import PaymentScreen from '@/features/payment/pages/PaymentScreen.jsx';
import AdminScreen from '@/features/admin/pages/AdminScreen.jsx';
import AdminLoginScreen from '@/features/admin/pages/AdminLoginScreen.jsx';
import TrashScreen from '@/features/trash/pages/TrashScreen.jsx';
import MainLayout from '@/shared/layouts/MainLayout.jsx';

export default function AppRoutes() {
  const {
    currentUser, isAdmin, deletedDocuments, searchTerm, accentColor, avatarUrl,
    documents, activeDoc, groups, currentGroupId, storagePercentage, currentView, isSidebarVisible,
    setSearchTerm, setAccentColor, setAvatarUrl, setCurrentGroupId,
    addDocument, renameDocument, selectActiveDoc,
    handleNavigate, handleLoginSuccess, handleAdminLoginSuccess, handleLogout, handleAdminLogout,
    handleRemoveDocument, handleRestoreDocument, handlePermanentlyDeleteDocument,
    handleAddCommunityGroup, handleRequestJoinGroup, handleApproveJoinGroup, handleRejectJoinGroup,
    handlePublishDocumentGroup, handleDeleteGroupDocument
  } = useAppContext();

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
          onRenameDocument={renameDocument}
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

  if (isSidebarVisible) {
    return (
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
    );
  }

  return pageContent;
}
