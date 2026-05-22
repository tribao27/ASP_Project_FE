import { useState } from 'react';
import { Button, Tag, Modal, Upload, message, Tabs, Avatar } from 'antd';
import { motion } from 'framer-motion';

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

  if (!group) return null;

  const isOwner = currentUser === group.owner;
  const isMember = group.members.some(m => m.email === currentUser);
  const isPending = group.pendingRequests?.includes(currentUser);

  const handleUpload = () => {
    if (!uploadFile) {
      message.error('Vui lòng chọn tài liệu để tải lên!');
      return;
    }
    if (storagePercentage >= 100) { // Simulate out of storage when >= 100%
      message.error('Bạn đã hết dung lượng lưu trữ! Không thể tải lên tài liệu mới.');
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
      if (storagePercentage >= 100) {
        message.error('Không thể upload. Bạn đã hết dung lượng lưu trữ!');
        return Upload.LIST_IGNORE;
      }
      setUploadFile(file);
      return false; // Prevent auto upload
    },
    onRemove: () => setUploadFile(null),
    maxCount: 1,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex-1 w-full h-full overflow-y-auto px-4 md:px-8 pb-10 pt-4 text-left select-none relative">
      <div>
        <button onClick={onBack} className="mb-4 text-black/50 hover:text-[#ff5c00] font-bold text-[13px] flex items-center gap-2 transition-colors">
          <i className="bi bi-arrow-left" /> Quay lại cộng đồng
        </button>

        {/* Group Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 md:p-8 rounded-3xl bg-white border border-black/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm relative overflow-hidden"
        >
          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-3">
              <Tag color="purple" className="font-bold text-[10px] uppercase rounded-full border-none px-3 py-1">
                {group.subject || group.category}
              </Tag>
              {isOwner && (
                <Tag color="orange" className="font-bold text-[10px] uppercase rounded-full border-none px-3 py-1 bg-[#ff5c00]/10 text-[#ff5c00]">
                  <i className="bi bi-star-fill mr-1" /> Group Leader
                </Tag>
              )}
            </div>
            <h2 className="text-[24px] md:text-[28px] font-extrabold tracking-tight text-black">{group.name}</h2>
            <p className="text-[13px] text-black/60 font-semibold max-w-2xl leading-relaxed">{group.description}</p>
            
            <div className="flex items-center gap-6 pt-2">
              <span className="text-[13px] font-bold text-black/50"><i className="bi bi-people-fill mr-1.5 text-[#ff5c00]" /> {group.members?.length || 0} thành viên</span>
              <span className="text-[13px] font-bold text-black/50"><i className="bi bi-folder2-open mr-1.5 text-[#ff5c00]" /> {group.documents?.length || 0} tài liệu</span>
            </div>
          </div>
        </motion.div>

        {/* Main Content Area */}
        {(!isMember && !isOwner) ? (
          <div className="bg-white border border-black/5 rounded-3xl p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-black/[0.02] rounded-full flex items-center justify-center mx-auto mb-4 text-[#ff5c00]">
              <i className="bi bi-lock-fill text-3xl" />
            </div>
            <h3 className="text-[18px] font-bold mb-2">Nhóm học tập riêng tư</h3>
            <p className="text-[13px] text-black/50 font-semibold max-w-md mx-auto mb-6">Bạn cần phải là thành viên để xem tài liệu và danh sách thành viên của nhóm này.</p>
            <Button type="primary" disabled={isPending} className="font-bold rounded-xl h-10 px-6">
              {isPending ? 'Đang chờ duyệt...' : 'Gửi yêu cầu tham gia'}
            </Button>
          </div>
        ) : (
          <div className="bg-white border border-black/5 rounded-3xl shadow-sm overflow-hidden">
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab} 
              className="px-6 pt-4 font-bold"
              items={[
                {
                  key: 'documents',
                  label: <span className="px-2"><i className="bi bi-folder2-open mr-2" />Tài liệu chia sẻ</span>,
                  children: (
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-[16px]">Tài liệu nội bộ nhóm</h4>
                        <Button 
                          type="primary" 
                          icon={<i className="bi bi-cloud-arrow-up" />}
                          onClick={() => setShowUploadModal(true)}
                          className="font-bold rounded-xl"
                        >
                          Tải lên & Publish
                        </Button>
                      </div>

                      {(!group.documents || group.documents.length === 0) ? (
                        <div className="text-center py-12 text-black/40 font-semibold text-[13px]">
                          <i className="bi bi-inbox text-4xl mb-3 block" />
                          Chưa có tài liệu nào được chia sẻ trong nhóm.
                        </div>
                      ) : (
                        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {group.documents.map(doc => (
                            <motion.div key={doc.id} variants={itemVariants} className="border border-black/5 rounded-2xl p-4 hover:border-[#ff5c00]/30 transition-all bg-black/[0.01] flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start mb-3">
                                  <div className="w-10 h-10 rounded-xl bg-white border border-black/5 flex items-center justify-center text-[#ff5c00] font-bold text-[11px] shadow-sm">
                                    {doc.type}
                                  </div>
                                  {(isOwner || doc.uploader === currentUser) && (
                                    <button 
                                      onClick={() => onDeleteDocument(group.id, doc.id)}
                                      className="text-black/30 hover:text-red-500 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50"
                                      title="Xóa tài liệu"
                                    >
                                      <i className="bi bi-trash3-fill" />
                                    </button>
                                  )}
                                </div>
                                <h5 className="font-bold text-[14px] line-clamp-1 mb-1">{doc.name}</h5>
                                <p className="text-[11px] text-black/50 font-semibold mb-3">Tải lên bởi: {doc.uploader === currentUser ? 'Bạn' : doc.uploader}</p>
                              </div>
                              <div className="flex justify-between items-center pt-3 border-t border-black/5">
                                <span className="text-[11px] font-bold text-black/40">{doc.date}</span>
                                <span className="text-[11px] font-bold text-black/40">{doc.size?.toFixed(1)} MB</span>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  )
                },
                {
                  key: 'members',
                  label: <span className="px-2"><i className="bi bi-people mr-2" />Thành viên</span>,
                  children: (
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-[16px]">Danh sách thành viên ({group.members?.length || 0})</h4>
                        {isOwner && (
                          <Button 
                            type="dashed" 
                            icon={<i className="bi bi-link-45deg" />}
                            onClick={() => message.success('Đã copy link mời tham gia nhóm vào clipboard!')}
                            className="font-bold rounded-xl"
                          >
                            Copy Link Invite
                          </Button>
                        )}
                      </div>

                      {/* Members List */}
                      <div className="space-y-3 mb-8">
                        {group.members?.map(member => (
                          <div key={member.email} className="flex justify-between items-center p-3 rounded-xl border border-black/5 bg-black/[0.01]">
                            <div className="flex items-center gap-3">
                              <Avatar className="bg-gradient-to-tr from-[#ff8a00] to-[#ff5c00] font-bold">
                                {member.email.charAt(0).toUpperCase()}
                              </Avatar>
                              <div>
                                <div className="font-bold text-[13px]">{member.email} {member.email === currentUser && '(Bạn)'}</div>
                                <div className="text-[11px] text-black/50 font-semibold">Tham gia: {member.joinedAt}</div>
                              </div>
                            </div>
                            <div>
                              {member.role === 'leader' ? (
                                <Tag color="orange" className="border-none bg-[#ff5c00]/10 text-[#ff5c00] font-bold rounded-full px-3">Leader</Tag>
                              ) : (
                                <Tag className="border-none bg-black/5 text-black/60 font-bold rounded-full px-3">Member</Tag>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pending Requests (Only for Leader) */}
                      {isOwner && group.pendingRequests && group.pendingRequests.length > 0 && (
                        <div>
                          <h4 className="font-bold text-[16px] mb-4 flex items-center gap-2">
                            Yêu cầu tham gia <Tag color="red" className="rounded-full">{group.pendingRequests.length}</Tag>
                          </h4>
                          <div className="space-y-3">
                            {group.pendingRequests.map(reqEmail => (
                              <div key={reqEmail} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-4 rounded-xl border border-[#ff5c00]/20 bg-[#ff5c00]/5">
                                <div className="flex items-center gap-3">
                                  <Avatar className="bg-black/10 text-black/60 font-bold">
                                    {reqEmail.charAt(0).toUpperCase()}
                                  </Avatar>
                                  <div className="font-bold text-[13px]">{reqEmail}</div>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    size="small" 
                                    danger
                                    onClick={() => onRejectJoin(group.id, reqEmail)}
                                    className="font-bold rounded-lg px-4"
                                  >
                                    Từ chối
                                  </Button>
                                  <Button 
                                    size="small" 
                                    type="primary"
                                    onClick={() => onApproveJoin(group.id, reqEmail)}
                                    className="font-bold rounded-lg px-4 bg-[#34c759] hover:bg-[#2eb350] border-none"
                                  >
                                    Duyệt
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                }
              ]}
            />
          </div>
        )}
      </div>

      {/* Upload/Publish Modal */}
      <Modal
        title={null}
        open={showUploadModal}
        onCancel={() => setShowUploadModal(false)}
        footer={null}
        width={460}
        centered
        destroyOnHidden
        className="!p-0 overflow-hidden"
      >
        <div className="bg-gradient-to-br from-[#ff8a00] to-[#ff5c00] px-8 py-7 flex items-center gap-5 relative overflow-hidden rounded-t-2xl shadow-inner">
          {/* Decorative Background Elements */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none mix-blend-overlay" />
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white backdrop-blur-md shadow-xl relative z-10"
          >
            <i className="bi bi-cloud-arrow-up-fill text-[30px]" />
          </motion.div>
          <div className="text-left text-white z-10">
            <h3 className="text-[22px] font-extrabold tracking-tight drop-shadow-md leading-tight">Publish Tài liệu</h3>
            <p className="text-[11px] font-bold text-white/90 uppercase tracking-widest mt-1">Chia sẻ với nhóm học tập</p>
          </div>
        </div>
        
        <div className="p-8 bg-[#fcfcfd] rounded-b-2xl relative">
          <Upload.Dragger {...uploadProps} className="!rounded-3xl !border-2 !border-dashed !border-[#ff5c00]/20 hover:!border-[#ff5c00] !bg-gradient-to-b !from-[#ff5c00]/[0.03] !to-transparent hover:!from-[#ff5c00]/10 mb-8 transition-all duration-500 py-10 group overflow-hidden relative shadow-sm">
            <div className="relative z-10 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-white shadow-xl shadow-[#ff5c00]/10 rounded-full flex items-center justify-center mb-5 group-hover:-translate-y-2 transition-transform duration-500 border border-black/5">
                <i className="bi bi-file-earmark-arrow-up text-[#ff5c00] text-[36px] group-hover:scale-110 group-hover:text-[#ff8a00] transition-all duration-500" />
              </div>
              <h4 className="text-[17px] font-extrabold text-black mb-1.5">Click hoặc kéo thả file vào đây</h4>
              <p className="text-[12.5px] text-black/50 font-bold mb-4 px-4 leading-relaxed text-center">
                Lưu ý: Kích thước file sẽ được tính vào <span className="text-[#ff5c00] underline decoration-[#ff5c00]/30 underline-offset-4">dung lượng lưu trữ cá nhân</span> của bạn.
              </p>
            </div>
          </Upload.Dragger>
          
          <div className="flex gap-3 justify-end pt-2">
            <Button 
              onClick={() => setShowUploadModal(false)} 
              className="rounded-xl font-bold text-[13px] h-11 px-6 border-black/10 hover:border-black/20 hover:bg-black/5"
            >
              Hủy bỏ
            </Button>
            <Button 
              type="primary" 
              onClick={handleUpload} 
              className="rounded-xl font-extrabold text-[13px] h-11 px-8 shadow-lg shadow-[#ff5c00]/30 orange-glow"
            >
              <i className="bi bi-cloud-arrow-up-fill mr-1" /> Xác nhận Publish
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
