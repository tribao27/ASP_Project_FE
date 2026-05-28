import { useState } from 'react';
import { Button, Modal, Form, message, Pagination, Input } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommunityScreen({
  groups,
  searchTerm = '',
  currentUser,
  onRequestJoin,
  onViewDetail,
  onAddGroup
}) {
  const [localSearch, setLocalSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [generatedGroupId, setGeneratedGroupId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const [form] = Form.useForm();
  const [joinForm] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showJoinPassword, setShowJoinPassword] = useState(false);

  const handleOpenCreateModal = () => {
    setGeneratedGroupId(Math.random().toString(36).substring(2, 8).toUpperCase());
    setShowCreateModal(true);
  };

  const handleCreateGroup = (values) => {
    const newGroup = {
      id: generatedGroupId || 'grp_' + Date.now(),
      name: values.name,
      description: values.description,
      password: values.password,
      owner: currentUser,
      members: [
        { email: currentUser, role: 'leader', joinedAt: new Date().toISOString().split('T')[0] }
      ],
      pendingRequests: [],
      documents: []
    };

    onAddGroup(newGroup);
    form.resetFields();
    setShowCreateModal(false);
    message.success(`Đã khởi tạo thành công nhóm học tập "${values.name}"! Bạn là Group Leader.`);
  };

  const handleJoinSubmit = (values) => {
    const targetGroup = groups.find(g => g.id === values.groupId);
    if (!targetGroup) {
      message.error('Không tìm thấy Nhóm có ID này. Vui lòng kiểm tra lại.');
      return;
    }
    
    if (targetGroup.password && targetGroup.password !== values.password) {
      message.error('Mã lớp hoặc Mật khẩu không chính xác.');
      return;
    }

    onRequestJoin(targetGroup.id);
    joinForm.resetFields();
    setShowJoinModal(false);
    message.success(`Đã gửi yêu cầu tham gia "${targetGroup.name}". Vui lòng chờ Leader duyệt.`);
  };

  const finalSearchQuery = localSearch || searchTerm || '';
  const filteredGroups = groups.filter((grp) => {
    return (
      grp.name.toLowerCase().includes(finalSearchQuery.toLowerCase())
    );
  });

  const paginatedGroups = filteredGroups.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex-1 w-full h-full overflow-y-auto px-4 md:px-8 pb-12 pt-4 text-left select-none relative bg-transparent">
      
      {/* Banner hero header component */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-8 p-8 rounded-3xl bg-gradient-to-r from-[var(--color-primary)] to-[#000000] text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl shadow-[var(--color-primary)]/10 relative overflow-hidden"
      >
        <div className="absolute top-[-50%] right-[-10%] w-[80%] h-[200%] bg-white/5 rounded-full blur-[80px] pointer-events-none transform rotate-45" />
        <div className="text-left space-y-2 relative z-10 max-w-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/80 bg-white/10 px-3 py-1 rounded-full inline-block backdrop-blur-md border border-white/10">Cộng đồng AI Study</span>
          <h3 className="text-[24px] md:text-[28px] font-black tracking-tight leading-tight">Không gian chia sẻ tri thức</h3>
          <p className="text-[13px] text-white/80 font-medium leading-relaxed max-w-xl">
            Khám phá hàng chục nhóm thảo luận chuyên môn. Tham gia vào các nhóm học tập, chia sẻ tài liệu và cùng nhau vượt qua các kỳ thi một cách xuất sắc.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 relative z-10 w-full md:w-auto">
          <button
            onClick={() => setShowJoinModal(true)}
            className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-[13px] rounded-2xl px-6 py-3.5 cursor-pointer shadow-lg transition-all duration-300 hover:bg-white/20 active:scale-[0.98]"
          >
            Tham gia bằng ID
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="w-full sm:w-auto bg-white text-[var(--color-primary)] font-extrabold text-[13px] rounded-2xl px-6 py-3.5 cursor-pointer shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Tạo nhóm thảo luận
          </button>
        </div>
      </motion.div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

        {/* Group Grid (xl:col-span-8 or 9) */}
        <div className="xl:col-span-8 space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-[15px] font-black text-[#1d1d1f] tracking-tight">Danh sách nhóm thảo luận</h4>
            <span className="text-[12px] font-semibold text-black/40">{filteredGroups.length} nhóm tìm thấy</span>
          </div>

          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="show" 
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <AnimatePresence>
              {paginatedGroups.map((grp) => (
                <motion.div
                  key={grp.id}
                  variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="bg-white border border-black/[0.04] rounded-[24px] p-6 shadow-sm hover:shadow-xl hover:shadow-black/[0.03] flex flex-col justify-between cursor-pointer relative transition-all duration-300 overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] flex items-center justify-center text-[var(--color-primary)] flex-shrink-0 group-hover:bg-[var(--color-primary)]/5 transition-colors">
                        <i className="bi bi-diagram-3-fill text-[20px]" />
                      </div>
                      <div className="flex items-center gap-1.5 bg-[#34c759]/10 text-[#34c759] px-2.5 py-1 rounded-full border border-[#34c759]/20">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34c759] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34c759]"></span>
                        </span>
                        <span className="text-[9px] font-extrabold uppercase tracking-widest">Active</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div>
                      <h4 className="text-[17px] font-extrabold text-[#1d1d1f] tracking-tight line-clamp-1 mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                        {grp.name}
                      </h4>
                      <p className="text-[13px] text-black/50 font-medium leading-relaxed line-clamp-2 min-h-[40px]">
                        {grp.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-1.5 text-[12px] font-bold text-black/60 bg-[#f5f5f7] px-3 py-1.5 rounded-xl">
                        <i className="bi bi-people-fill text-black/40" /> 
                        <span>{grp.members?.length || 0} <span className="hidden sm:inline font-medium text-black/40">thành viên</span></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] font-bold text-black/60 bg-[#f5f5f7] px-3 py-1.5 rounded-xl">
                        <i className="bi bi-folder2-open text-black/40" /> 
                        <span>{grp.documents?.length || 0} <span className="hidden sm:inline font-medium text-black/40">tài liệu</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-black/[0.04] flex justify-end items-center">
                    {(() => {
                      const isOwner = grp.owner === currentUser;
                      const isMember = grp.members?.some(m => m.email === currentUser);
                      const isPending = grp.pendingRequests?.includes(currentUser);

                      if (isOwner || isMember) {
                        return (
                          <Button
                            type="text"
                            onClick={() => onViewDetail(grp.id)}
                            className="font-bold text-[12.5px] rounded-xl h-9 px-5 bg-[var(--color-primary)]/5 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 border-none transition-colors"
                          >
                            Chi tiết nhóm <i className="bi bi-arrow-right ml-1" />
                          </Button>
                        );
                      }
                      if (isPending) {
                        return (
                          <Button disabled className="font-bold text-[12.5px] rounded-xl h-9 px-5 border-none bg-[#f5f5f7] text-black/40">
                            Đang chờ duyệt
                          </Button>
                        );
                      }
                      return (
                        <Button
                          type="primary"
                          onClick={() => {
                            onRequestJoin(grp.id);
                            message.success(`Đã gửi yêu cầu tham gia "${grp.name}". Vui lòng chờ duyệt.`);
                          }}
                          className="font-bold text-[12.5px] rounded-xl h-9 px-5 shadow-sm shadow-[var(--color-primary)]/20"
                        >
                          Gửi yêu cầu
                        </Button>
                      );
                    })()}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredGroups.length > pageSize && (
            <div className="flex justify-center pt-6">
              <Pagination 
                current={currentPage} 
                total={filteredGroups.length} 
                pageSize={pageSize} 
                onChange={setCurrentPage}
                className="custom-modern-pagination"
              />
            </div>
          )}
          
          {filteredGroups.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-black/[0.04]">
              <i className="bi bi-search text-4xl text-black/20 mb-4 block" />
              <p className="text-[14px] font-bold text-black/50">Không tìm thấy nhóm thảo luận nào phù hợp.</p>
            </div>
          )}
        </div>

        {/* Right Sidebar (xl:col-span-4) */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          {/* Stats Overview */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-black/[0.04] rounded-3xl p-6 shadow-sm text-left relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[var(--color-primary)]/10 transition-colors duration-500" />
            <h4 className="text-[14px] font-black text-[#1d1d1f] tracking-tight mb-5 flex items-center gap-2">
              <i className="bi bi-bar-chart-fill text-[var(--color-primary)]" /> Thống kê cộng đồng
            </h4>

            <div className="space-y-3 relative z-10">
              {[
                { label: 'Tổng tài liệu', num: '14,250', icon: 'bi-files', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { label: 'Nhóm thảo luận', num: '128', icon: 'bi-chat-square-text', color: 'text-purple-500', bg: 'bg-purple-500/10' },
                { label: 'Thành viên trực tuyến', num: '1,040', icon: 'bi-wifi', color: 'text-[#34c759]', bg: 'bg-[#34c759]/10' },
              ].map((s, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-2xl bg-[#f9f9fb] border border-black/[0.02] hover:bg-white hover:border-black/[0.05] transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}>
                      <i className={`bi ${s.icon} text-[14px]`} />
                    </div>
                    <span className="text-[12.5px] font-bold text-black/70">{s.label}</span>
                  </div>
                  <span className={`text-[13px] font-black ${s.color}`}>{s.num}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Contributors / Active Members */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-black/[0.04] rounded-3xl p-6 shadow-sm text-left"
          >
            <h4 className="text-[14px] font-black text-[#1d1d1f] tracking-tight mb-5 flex items-center gap-2">
              <i className="bi bi-stars text-amber-500" /> Thành viên nổi bật
            </h4>
            
            <div className="space-y-4">
              {[
                { name: 'Alex Nguyen', role: 'Data Science', score: '9.8k', avatar: 'https://i.pravatar.cc/150?img=11' },
                { name: 'Minh Tran', role: 'Software Eng', score: '8.4k', avatar: 'https://i.pravatar.cc/150?img=33' },
                { name: 'Sarah Le', role: 'AI Research', score: '7.2k', avatar: 'https://i.pravatar.cc/150?img=5' },
                { name: 'Kevin Vu', role: 'Cyber Security', score: '5.9k', avatar: 'https://i.pravatar.cc/150?img=15' }
              ].map((user, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-black/5 group-hover:scale-105 transition-transform shadow-sm" />
                    <div>
                      <h5 className="text-[13px] font-bold text-[#1d1d1f] group-hover:text-[var(--color-primary)] transition-colors">{user.name}</h5>
                      <span className="text-[11px] font-medium text-black/40">{user.role}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[12px] font-black text-amber-500 flex items-center gap-1">
                      {user.score} <i className="bi bi-fire" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-2.5 rounded-xl border border-black/[0.05] bg-[#f9f9fb] text-[12px] font-bold text-black/60 hover:text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors">
              Xem tất cả
            </button>
          </motion.div>
        </div>

      </div>

      {/* ----------------- MODALS ----------------- */}

      {/* Create Group Modal */}
      <Modal
        open={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        footer={null}
        width={480}
        destroyOnHidden
        centered
        closeIcon={<i className="bi bi-x-circle-fill text-[20px] text-black/20 hover:text-black/40 transition-colors" />}
        className="modern-glass-modal"
      >
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="text-center mb-8 relative">
            <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-2xl flex items-center justify-center text-[var(--color-primary)] mx-auto mb-4 border border-[var(--color-primary)]/20 shadow-inner">
              <i className="bi bi-diagram-3-fill text-[28px]" />
            </div>
            <h3 className="text-[22px] font-black text-[#1d1d1f] tracking-tight">Tạo Nhóm Thảo Luận</h3>
            <p className="text-[13px] text-black/50 font-medium mt-1">Xây dựng không gian học tập và chia sẻ tài liệu</p>
          </div>

          <Form form={form} layout="vertical" onFinish={handleCreateGroup} requiredMark={false} className="space-y-4">
            <Form.Item
              label={<span className="text-[12px] font-bold text-black/70">Tên nhóm</span>}
              name="name"
              rules={[{ required: true, message: 'Vui lòng điền tên nhóm!' }]}
              className="mb-0"
            >
              <Input
                placeholder="Ví dụ: Nhóm học Machine Learning K22"
                className="h-12 rounded-xl bg-[#f5f5f7] border-transparent hover:border-black/10 focus:border-[var(--color-primary)] focus:bg-white text-[14px] font-medium transition-all shadow-none"
              />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item label={<span className="text-[12px] font-bold text-black/70">Group ID</span>} className="mb-0">
                <div className="h-12 w-full bg-[#f5f5f7] border border-transparent rounded-xl px-4 flex items-center text-black/50 font-mono font-bold text-[14px] select-all">
                  {generatedGroupId}
                </div>
              </Form.Item>

              <Form.Item
                label={<span className="text-[12px] font-bold text-black/70">Mật khẩu nhóm</span>}
                name="password"
                rules={[
                  { required: true, message: 'Vui lòng đặt mật khẩu!' },
                  { min: 4, message: 'Mật khẩu phải từ 4 ký tự!' }
                ]}
                className="mb-0"
              >
                <Input.Password
                  placeholder="Nhập mật khẩu"
                  visibilityToggle={{ visible: showPassword, onVisibleChange: setShowPassword }}
                  className="h-12 rounded-xl bg-[#f5f5f7] border-transparent hover:border-black/10 focus:border-[var(--color-primary)] focus:bg-white text-[14px] font-medium transition-all shadow-none"
                />
              </Form.Item>
            </div>

            <Form.Item
              label={<span className="text-[12px] font-bold text-black/70">Mô tả định hướng</span>}
              name="description"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả ngắn!' }]}
              className="mb-0"
            >
              <Input.TextArea
                rows={3}
                placeholder="Nhóm tập trung chia sẻ tài liệu và giải đáp thắc mắc..."
                className="rounded-xl bg-[#f5f5f7] border-transparent hover:border-black/10 focus:border-[var(--color-primary)] focus:bg-white text-[14px] font-medium transition-all shadow-none resize-none pt-3"
              />
            </Form.Item>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={() => setShowCreateModal(false)} 
                className="flex-1 rounded-xl font-bold text-[13px] h-12 bg-black/5 border-none hover:bg-black/10 text-black/70"
              >
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="flex-1 rounded-xl font-extrabold text-[13px] h-12 shadow-lg shadow-[var(--color-primary)]/20"
              >
                Tạo nhóm ngay
              </Button>
            </div>
          </Form>
        </motion.div>
      </Modal>

      {/* Join Group Modal */}
      <Modal
        open={showJoinModal}
        onCancel={() => setShowJoinModal(false)}
        footer={null}
        width={400}
        destroyOnHidden
        centered
        closeIcon={<i className="bi bi-x-circle-fill text-[20px] text-black/20 hover:text-black/40 transition-colors" />}
        className="modern-glass-modal"
      >
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}>
          <div className="text-center mb-6 relative">
            <div className="w-16 h-16 bg-[#007aff]/10 rounded-2xl flex items-center justify-center text-[#007aff] mx-auto mb-4 border border-[#007aff]/20 shadow-inner">
              <i className="bi bi-box-arrow-in-right text-[28px]" />
            </div>
            <h3 className="text-[22px] font-black text-[#1d1d1f] tracking-tight">Tham gia Nhóm</h3>
            <p className="text-[13px] text-black/50 font-medium mt-1">Kết nối thông qua Group ID</p>
          </div>

          <Form form={joinForm} layout="vertical" onFinish={handleJoinSubmit} requiredMark={false} className="space-y-4">
            <Form.Item
              label={<span className="text-[12px] font-bold text-black/70">Mã Group ID</span>}
              name="groupId"
              rules={[{ required: true, message: 'Vui lòng nhập Group ID!' }]}
              className="mb-0"
            >
              <Input
                placeholder="Ví dụ: A1B2C3"
                className="h-12 rounded-xl bg-[#f5f5f7] border-transparent hover:border-black/10 focus:border-[#007aff] focus:bg-white text-[15px] font-mono font-bold text-center uppercase transition-all shadow-none"
                onInput={(e) => e.target.value = e.target.value.toUpperCase()}
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-[12px] font-bold text-black/70">Mật khẩu truy cập</span>}
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              className="mb-0"
            >
              <Input.Password
                placeholder="Nhập mật khẩu nhóm"
                visibilityToggle={{ visible: showJoinPassword, onVisibleChange: setShowJoinPassword }}
                className="h-12 rounded-xl bg-[#f5f5f7] border-transparent hover:border-black/10 focus:border-[#007aff] focus:bg-white text-[14px] font-medium transition-all shadow-none text-center"
              />
            </Form.Item>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={() => setShowJoinModal(false)} 
                className="w-1/3 rounded-xl font-bold text-[13px] h-12 bg-black/5 border-none hover:bg-black/10 text-black/70"
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="w-2/3 rounded-xl font-extrabold text-[13px] h-12 bg-[#007aff] hover:bg-[#005bb5] shadow-lg shadow-[#007aff]/20 border-none"
              >
                Gửi yêu cầu
              </Button>
            </div>
          </Form>
        </motion.div>
      </Modal>

      <style jsx global>{`
        /* Minimalist Modal Styling Override */
        .modern-glass-modal .ant-modal-content {
          border-radius: 28px !important;
          padding: 32px !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15) !important;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .custom-modern-pagination .ant-pagination-item {
          border-radius: 8px !important;
          border: none !important;
          background: #f5f5f7;
          font-weight: 600;
        }
        .custom-modern-pagination .ant-pagination-item-active {
          background: var(--color-primary) !important;
        }
        .custom-modern-pagination .ant-pagination-item-active a {
          color: white !important;
        }
        .custom-modern-pagination .ant-pagination-prev .ant-pagination-item-link,
        .custom-modern-pagination .ant-pagination-next .ant-pagination-item-link {
          border-radius: 8px !important;
          border: none !important;
          background: #f5f5f7;
        }
      `}</style>
    </div>
  );
}
