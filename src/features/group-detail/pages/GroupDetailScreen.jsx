import { useState } from 'react';
import { Button, Modal, Upload, message, Tooltip } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';

export default function GroupDetailScreen({
  group,
  currentUser,
  storagePercentage,
  onBack,
  onPublishDocument,
  onDeleteDocument,
  onApproveJoin,
  onRejectJoin
}) {
  const [activeTab, setActiveTab] = useState('documents');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  if (!group) return null;

  const isOwner = currentUser === group.owner;
  const isMember = group.members.some(m => m.email === currentUser);
  const isPending = group.pendingRequests?.includes(currentUser);

  const handleUpload = () => {
    if (!uploadFile) {
      message.error('Vui lòng chọn tài liệu để tải lên!');
      return;
    }

    const newDoc = {
      id: 'gdoc_' + Date.now(),
      name: uploadFile.name,
      type: uploadFile.name.split('.').pop().toUpperCase() || 'FILE',
      size: uploadFile.size / (1024 * 1024), // MB
      uploader: currentUser,
      date: new Date().toISOString().split('T')[0],
      storageUsed: uploadFile.size / (1024 * 1024)
    };

    onPublishDocument(group.id, newDoc);
    setUploadFile(null);
    setShowUploadModal(false);
    message.success('Đã tải lên và publish tài liệu thành công!');
  };

  const uploadProps = {
    beforeUpload: (file) => {
      setUploadFile(file);
      return false; // Prevent auto upload
    },
    onRemove: () => setUploadFile(null),
    maxCount: 1,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  // Generate a random avatar and online status for mockup purposes
  const getMockUserData = (email) => {
    const seed = email.charCodeAt(0) + email.length;
    return {
      avatar: `https://i.pravatar.cc/150?u=${email}`,
      isOnline: seed % 3 !== 0 // 66% chance of being online
    };
  };

  return (
    <div className="flex-1 w-full h-full overflow-y-auto px-4 md:px-8 pb-12 pt-4 text-left select-none relative bg-transparent">
      
      {/* Back Button */}
      <motion.button 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack} 
        className="mb-6 text-black/50 hover:text-[var(--color-primary)] font-bold text-[13px] flex items-center gap-2 transition-all hover:-translate-x-1"
      >
        <div className="w-8 h-8 rounded-full bg-white border border-black/5 flex items-center justify-center shadow-sm">
          <i className="bi bi-arrow-left" />
        </div>
        Quay lại cộng đồng
      </motion.button>

      {/* Premium Group Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 rounded-[32px] bg-gradient-to-br from-[var(--color-primary)] to-[#000000] p-[2px] shadow-2xl shadow-[var(--color-primary)]/10 relative overflow-hidden"
      >
        <div className="absolute top-[-50%] right-[-10%] w-[80%] h-[200%] bg-white/10 rounded-full blur-[80px] pointer-events-none transform rotate-45" />
        
        <div className="bg-white rounded-[30px] p-6 md:p-8 flex flex-col xl:flex-row justify-between items-start gap-8 relative z-10 h-full overflow-hidden">
          {/* subtle background mesh */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-4 max-w-3xl relative z-10 flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] border border-[var(--color-primary)]/20 shadow-inner">
                <i className="bi bi-diagram-3-fill text-[24px]" />
              </div>
              <div>
                {isOwner && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-200 to-amber-500 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-md shadow-amber-500/20 mb-1">
                    <i className="bi bi-star-fill text-[10px]" /> Group Leader
                  </span>
                )}
                <h2 className="text-[28px] md:text-[34px] font-black tracking-tight text-[#1d1d1f] leading-none">
                  {group.name}
                </h2>
              </div>
            </div>

            <p className="text-[14px] text-black/60 font-medium leading-relaxed max-w-2xl">
              {group.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              {/* Premium Group ID Badge */}
              <Tooltip title="Nhấp để copy">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(group.id);
                    message.success('Đã copy Group ID!');
                  }}
                  className="flex items-center gap-2.5 bg-[#f5f5f7] hover:bg-[#ebebef] border border-black/[0.04] rounded-[14px] px-3.5 py-2 transition-all group/idbtn shadow-sm"
                >
                  <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-black/40 shadow-sm">
                    <i className="bi bi-hash text-[12px]" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[9px] font-extrabold text-black/40 uppercase tracking-widest leading-none">Group ID</span>
                    <span className="text-[13px] font-mono font-bold text-[#1d1d1f] leading-tight">{group.id}</span>
                  </div>
                  <i className="bi bi-copy ml-1 text-[12px] text-black/20 group-hover/idbtn:text-[var(--color-primary)] transition-colors" />
                </button>
              </Tooltip>

              {/* Premium Password Reveal Component */}
              {isOwner && group.password && (
                <div className="flex items-center gap-2.5 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-[14px] px-3.5 py-2 group/pwd shadow-sm transition-all hover:shadow-md hover:shadow-[var(--color-primary)]/10">
                  <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-[var(--color-primary)] shadow-sm">
                    <i className="bi bi-lock-fill text-[12px]" />
                  </div>
                  <div className="flex flex-col items-start min-w-[70px]">
                    <span className="text-[9px] font-extrabold text-[var(--color-primary)]/70 uppercase tracking-widest leading-none">Password</span>
                    <span className="text-[13px] font-mono font-bold text-[#1d1d1f] leading-tight">
                      {showPassword ? group.password : '••••••••'}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-1 w-7 h-7 rounded-lg flex items-center justify-center bg-white/50 hover:bg-white text-[var(--color-primary)]/60 hover:text-[var(--color-primary)] transition-colors shadow-sm border border-transparent hover:border-[var(--color-primary)]/20"
                    title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'} text-[13px]`} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Group Stats Card (Right side of header) */}
          <div className="w-full xl:w-72 bg-[#f9f9fb] border border-black/[0.04] rounded-[24px] p-5 flex flex-col gap-4 shadow-sm shrink-0">
            <h4 className="text-[11px] font-extrabold text-black/40 uppercase tracking-widest">Thống kê nhanh</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-[16px] p-3 border border-black/5 shadow-sm">
                <i className="bi bi-people-fill text-[var(--color-primary)] text-[16px] mb-1 block" />
                <span className="text-[18px] font-black text-[#1d1d1f] block leading-none">{group.members?.length || 0}</span>
                <span className="text-[10px] font-bold text-black/40">Thành viên</span>
              </div>
              <div className="bg-white rounded-[16px] p-3 border border-black/5 shadow-sm">
                <i className="bi bi-folder2-open text-blue-500 text-[16px] mb-1 block" />
                <span className="text-[18px] font-black text-[#1d1d1f] block leading-none">{group.documents?.length || 0}</span>
                <span className="text-[10px] font-bold text-black/40">Tài liệu</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      {(!isMember && !isOwner) ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-black/[0.04] rounded-[32px] p-12 text-center shadow-sm max-w-2xl mx-auto mt-12">
          <div className="w-24 h-24 bg-[var(--color-primary)]/5 rounded-[24px] flex items-center justify-center mx-auto mb-6 text-[var(--color-primary)] border border-[var(--color-primary)]/10 shadow-inner">
            <i className="bi bi-shield-lock-fill text-[40px]" />
          </div>
          <h3 className="text-[22px] font-black text-[#1d1d1f] mb-2 tracking-tight">Khu vực riêng tư</h3>
          <p className="text-[14px] text-black/50 font-medium max-w-md mx-auto mb-8">Nội dung của nhóm này chỉ dành cho các thành viên chính thức. Vui lòng gửi yêu cầu để tham gia.</p>
          <Button type="primary" disabled={isPending} className="font-extrabold rounded-xl h-12 px-8 shadow-lg shadow-[var(--color-primary)]/20 border-none text-[14px]">
            {isPending ? 'Đang chờ Leader duyệt...' : 'Gửi yêu cầu tham gia'}
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Navigation & Info (xl:col-span-3) */}
          <div className="xl:col-span-3 flex flex-col gap-4">
            <div className="bg-white border border-black/[0.04] rounded-[24px] p-2 shadow-sm flex flex-row xl:flex-col gap-2 overflow-x-auto hide-scrollbar">
              <button 
                onClick={() => setActiveTab('documents')}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-[16px] font-bold text-[13.5px] transition-all whitespace-nowrap ${activeTab === 'documents' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] shadow-sm' : 'text-black/60 hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'}`}
              >
                <i className="bi bi-folder2-open text-[16px]" /> Tài nguyên nhóm
              </button>
              <button 
                onClick={() => setActiveTab('members')}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-[16px] font-bold text-[13.5px] transition-all whitespace-nowrap ${activeTab === 'members' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] shadow-sm' : 'text-black/60 hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'}`}
              >
                <i className="bi bi-people text-[16px]" /> Quản lý thành viên
                {isOwner && group.pendingRequests?.length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                    {group.pendingRequests.length}
                  </span>
                )}
              </button>
            </div>
            
            {/* Quick Activity Widget */}
            <div className="bg-white border border-black/[0.04] rounded-[24px] p-5 shadow-sm hidden xl:block">
              <h4 className="text-[12px] font-extrabold text-black/50 uppercase tracking-widest mb-4">Hoạt động gần đây</h4>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                    <i className="bi bi-cloud-arrow-up-fill text-[12px]" />
                  </div>
                  <div>
                    <p className="text-[12.5px] font-bold text-[#1d1d1f] leading-tight">Tài liệu mới</p>
                    <p className="text-[11px] font-medium text-black/40 mt-0.5">Machine_Learning_Ch1.pdf</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                    <i className="bi bi-person-plus-fill text-[12px]" />
                  </div>
                  <div>
                    <p className="text-[12.5px] font-bold text-[#1d1d1f] leading-tight">Thành viên mới</p>
                    <p className="text-[11px] font-medium text-black/40 mt-0.5">Sarah vừa tham gia nhóm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Tab Content (xl:col-span-9) */}
          <div className="xl:col-span-9">
            <AnimatePresence mode="wait">
              {activeTab === 'documents' && (
                <motion.div 
                  key="docs"
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white border border-black/[0.04] rounded-[32px] p-6 shadow-sm min-h-[500px]"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                      <h4 className="font-black text-[20px] text-[#1d1d1f] tracking-tight">Kho tài liệu nội bộ</h4>
                      <p className="text-[13px] font-medium text-black/40 mt-0.5">Tài nguyên được chia sẻ dành riêng cho nhóm</p>
                    </div>
                    <Button
                      type="primary"
                      icon={<i className="bi bi-cloud-arrow-up text-[16px]" />}
                      onClick={() => setShowUploadModal(true)}
                      className="font-extrabold rounded-xl px-6 h-11 shadow-lg shadow-[var(--color-primary)]/20 border-none transition-transform hover:scale-105"
                    >
                      Publish Tài liệu
                    </Button>
                  </div>

                  {(!group.documents || group.documents.length === 0) ? (
                    <div className="flex flex-col items-center justify-center h-64 text-black/40 font-semibold text-[14px]">
                      <div className="w-20 h-20 bg-[#f5f5f7] rounded-full flex items-center justify-center mb-4">
                        <i className="bi bi-inbox text-[32px]" />
                      </div>
                      Chưa có tài liệu nào được chia sẻ trong nhóm.
                    </div>
                  ) : (
                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {group.documents.map(doc => (
                        <motion.div key={doc.id} variants={itemVariants} className="border border-black/[0.04] rounded-[20px] p-5 hover:border-[var(--color-primary)]/30 transition-all bg-[#f9f9fb] hover:bg-white flex flex-col justify-between group shadow-sm hover:shadow-md hover:shadow-black/5">
                          <div className="flex items-start gap-4 w-full mb-4">
                            <div className="w-12 h-12 rounded-[14px] bg-white border border-black/5 flex items-center justify-center text-[var(--color-primary)] font-black text-[11px] shadow-sm flex-shrink-0">
                              {doc.type}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="font-extrabold text-[15px] text-[#1d1d1f] truncate mb-1 group-hover:text-[var(--color-primary)] transition-colors">{doc.name}</h5>
                              <div className="flex items-center gap-1.5 text-[11px] text-black/40 font-bold">
                                <i className="bi bi-clock-history" /> {doc.date}
                                <span className="mx-1">•</span>
                                <i className="bi bi-hdd-fill" /> {doc.size?.toFixed(1)} MB
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-black/[0.03]">
                             <div className="flex items-center gap-2">
                               <img src={getMockUserData(doc.uploader).avatar} alt="Uploader" className="w-6 h-6 rounded-full border border-black/10" />
                               <span className="text-[12px] font-bold text-black/60 truncate max-w-[100px]">{doc.uploader === currentUser ? 'Bạn' : doc.uploader.split('@')[0]}</span>
                             </div>
                             
                             <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="text-black/40 hover:text-[var(--color-primary)] transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--color-primary)]/10" title="Tải xuống">
                                <i className="bi bi-download" />
                              </button>
                              {(isOwner || doc.uploader === currentUser) && (
                                <button
                                  onClick={() => onDeleteDocument(group.id, doc.id)}
                                  className="text-black/40 hover:text-red-500 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50"
                                  title="Xóa tài liệu"
                                >
                                  <i className="bi bi-trash3-fill" />
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {activeTab === 'members' && (
                <motion.div 
                  key="members"
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white border border-black/[0.04] rounded-[32px] p-6 shadow-sm min-h-[500px]"
                >
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h4 className="font-black text-[20px] text-[#1d1d1f] tracking-tight">Thành viên ({group.members?.length || 0})</h4>
                      <p className="text-[13px] font-medium text-black/40 mt-0.5">Danh sách các thành viên trong nhóm học tập</p>
                    </div>
                    {isOwner && (
                      <Button
                        type="dashed"
                        icon={<i className="bi bi-link-45deg text-[18px]" />}
                        onClick={() => message.success('Đã copy link mời tham gia nhóm!')}
                        className="font-bold rounded-xl h-10 px-5 border-black/10 hover:border-black/30 hover:text-black"
                      >
                        Copy Invite Link
                      </Button>
                    )}
                  </div>

                  {/* Modern Members List (Discord/Linear style) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {group.members?.map(member => {
                      const mockData = getMockUserData(member.email);
                      return (
                        <div key={member.email} className="flex items-center p-3.5 rounded-[20px] border border-black/[0.03] bg-white hover:border-[var(--color-primary)]/20 hover:bg-[#f9f9fb] transition-all shadow-sm group cursor-pointer">
                          <div className="relative mr-4 shrink-0">
                            <img src={mockData.avatar} alt="Avatar" className="w-11 h-11 rounded-full object-cover border border-black/5 group-hover:scale-105 transition-transform" />
                            {/* Online Indicator */}
                            <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${mockData.isOnline ? 'bg-[#34c759]' : 'bg-black/20'}`} />
                          </div>
                          
                          <div className="flex-1 min-w-0 pr-2">
                            <div className="flex items-center gap-2">
                              <div className="font-extrabold text-[14px] text-[#1d1d1f] truncate group-hover:text-[var(--color-primary)] transition-colors">
                                {member.email.split('@')[0]}
                              </div>
                              {member.email === currentUser && <span className="bg-black/5 text-black/50 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">You</span>}
                            </div>
                            <div className="text-[11.5px] text-black/40 font-medium truncate mt-0.5">{member.email}</div>
                          </div>
                          
                          <div>
                            {member.role === 'leader' ? (
                              <div className="bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 font-extrabold text-[10px] uppercase tracking-widest rounded-full px-3 py-1 shadow-sm flex items-center gap-1">
                                <i className="bi bi-star-fill text-[9px]" /> Leader
                              </div>
                            ) : (
                              <div className="bg-black/[0.04] text-black/50 font-bold text-[10px] uppercase tracking-widest rounded-full px-3 py-1 group-hover:bg-[var(--color-primary)]/10 group-hover:text-[var(--color-primary)] transition-colors">
                                Member
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pending Requests (Only for Leader) */}
                  {isOwner && group.pendingRequests && group.pendingRequests.length > 0 && (
                    <div className="pt-6 border-t border-black/[0.04]">
                      <h4 className="font-black text-[16px] mb-4 flex items-center gap-2 text-[#1d1d1f]">
                        Yêu cầu chờ duyệt <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{group.pendingRequests.length}</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {group.pendingRequests.map(reqEmail => {
                          const mockData = getMockUserData(reqEmail);
                          return (
                            <div key={reqEmail} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-4 rounded-[20px] border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/[0.03]">
                              <div className="flex items-center gap-3">
                                <img src={mockData.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-black/5 opacity-80" />
                                <div className="font-bold text-[13.5px] text-[#1d1d1f] truncate max-w-[150px]">{reqEmail.split('@')[0]}</div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  type="text"
                                  onClick={() => onRejectJoin(group.id, reqEmail)}
                                  className="font-bold rounded-xl px-4 text-black/50 hover:bg-black/5 hover:text-black"
                                >
                                  Từ chối
                                </Button>
                                <Button
                                  type="primary"
                                  onClick={() => onApproveJoin(group.id, reqEmail)}
                                  className="font-extrabold rounded-xl px-4 bg-[#34c759] hover:bg-[#2eb350] shadow-md shadow-[#34c759]/20 border-none text-[12.5px]"
                                >
                                  Duyệt
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Upload/Publish Modal */}
      <Modal
        open={showUploadModal}
        onCancel={() => setShowUploadModal(false)}
        footer={null}
        width={460}
        centered
        destroyOnHidden
        closeIcon={<i className="bi bi-x-circle-fill text-[20px] text-white/50 hover:text-white transition-colors" />}
        className="modern-glass-modal overflow-hidden p-0"
      >
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}>
          <div className="bg-gradient-to-br from-[var(--color-primary)] to-[#000000] px-8 py-8 flex flex-col items-center relative overflow-hidden rounded-t-[28px] shadow-inner text-center">
            <div className="absolute top-[-50%] right-[-10%] w-[150%] h-[200%] bg-white/10 rounded-full blur-[80px] pointer-events-none transform rotate-45" />
            
            <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white backdrop-blur-md shadow-xl relative z-10 mb-4">
              <i className="bi bi-cloud-arrow-up-fill text-[32px]" />
            </div>
            <h3 className="text-[24px] font-black text-white tracking-tight leading-tight relative z-10">Publish Tài liệu</h3>
            <p className="text-[12px] font-medium text-white/80 mt-1 relative z-10">Đóng góp tài liệu cho nhóm học tập</p>
          </div>

          <div className="p-8 bg-white rounded-b-[28px]">
            <Upload.Dragger {...uploadProps} className="!rounded-[24px] !border-2 !border-dashed !border-[var(--color-primary)]/30 hover:!border-[var(--color-primary)] !bg-[#f9f9fb] hover:!bg-[var(--color-primary)]/5 mb-8 transition-all duration-300 py-10 group overflow-hidden relative shadow-none hover:shadow-inner">
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-white shadow-md rounded-full flex items-center justify-center mb-4 group-hover:-translate-y-1 transition-transform duration-300 border border-black/5">
                  <i className="bi bi-file-earmark-arrow-up text-[var(--color-primary)] text-[28px]" />
                </div>
                <h4 className="text-[15px] font-extrabold text-[#1d1d1f] mb-1">Click hoặc kéo thả file vào đây</h4>
                <p className="text-[12px] text-black/40 font-medium">Hỗ trợ PDF, DOCX, XLSX (Max 10MB)</p>
              </div>
            </Upload.Dragger>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 rounded-xl font-bold text-[13px] h-12 bg-black/5 border-none hover:bg-black/10 text-black/70"
              >
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                onClick={handleUpload}
                className="flex-1 rounded-xl font-extrabold text-[13px] h-12 shadow-lg shadow-[var(--color-primary)]/20 border-none"
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </motion.div>
      </Modal>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .modern-glass-modal .ant-modal-content {
          padding: 0 !important;
          border-radius: 28px !important;
          border: 1px solid rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        .modern-glass-modal .ant-modal-close {
          top: 16px;
          right: 16px;
        }
      `}</style>
    </div>
  );
}
