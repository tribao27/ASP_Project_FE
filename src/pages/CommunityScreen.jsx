/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Button, Tag, Modal, Form, Select, message } from 'antd';
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
  const [form] = Form.useForm();

  const handleCreateGroup = (values) => {
    const newGroup = {
      id: 'grp_' + Date.now(),
      name: values.name,
      description: values.description,
      category: values.subject,
      subject: values.subject,
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

  const finalSearchQuery = localSearch || searchTerm || '';
  const filteredGroups = groups.filter((grp) => {
    return (
      grp.name.toLowerCase().includes(finalSearchQuery.toLowerCase()) ||
      grp.subject.toLowerCase().includes(finalSearchQuery.toLowerCase())
    );
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="flex-1 w-full h-full overflow-y-auto px-4 md:px-8 pb-10 pt-4 text-left select-none relative">
      <div>
        
        {/* Banner hero header component */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl relative overflow-hidden orange-glow"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="text-left space-y-2 relative z-10 max-w-xl">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/70 bg-white/10 px-3 py-1 rounded-full inline-block">Mạng xã hội học thuật</span>
            <h3 className="text-[20px] md:text-[24px] font-extrabold tracking-tight">Cộng đồng chia sẻ & Đồng hành thi cử</h3>
            <p className="text-[12.5px] text-white/80 font-semibold leading-relaxed">
              Khám phá hàng chục nhóm thảo luận chuyên môn đại học. Tải lên giáo trình của bạn để hỗ trợ đồng đội giải quyết bài tập nhóm.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03, backgroundColor: '#ffffff' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowCreateModal(true)}
            className="bg-white text-black font-extrabold text-[13px] rounded-xl px-6 py-3 cursor-pointer shadow-lg hover:bg-white/95"
          >
            Tạo nhóm thảo luận
          </motion.button>
        </motion.div>

        {/* Main Grid View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Group Grid (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-4">
            <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest block text-left">Danh sách nhóm thảo luận</span>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {filteredGroups.map((grp) => (
                <motion.div
                  key={grp.id}
                  variants={itemVariants}
                  className="bg-white border border-black/5 hover:border-[#ff5c00]/30 rounded-3xl p-5 shadow-sm flex flex-col justify-between hover-card-depth cursor-pointer overflow-hidden relative"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <Tag color="purple" className="font-bold text-[9px] uppercase rounded-full border-none px-2.5 py-0.5">
                        {grp.subject || grp.category}
                      </Tag>
                      <span className="text-[12px] font-bold text-black/40"><i className="bi bi-people-fill mr-1 text-[#ff5c00]" /> {grp.members?.length || 0} thành viên</span>
                    </div>
                    <div className="text-left space-y-1.5">
                      <h4 className="text-[16px] font-extrabold text-black tracking-tight">{grp.name}</h4>
                      <p className="text-[12.5px] text-black/55 font-semibold leading-relaxed line-clamp-2">{grp.description}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-black/5 flex justify-between items-center mt-5">
                    <span className="text-[11px] font-bold text-black/40"><i className="bi bi-folder2-open mr-1 text-[#ff5c00]" /> {grp.documents?.length || 0} tài liệu</span>
                    
                    {(() => {
                      const isOwner = grp.owner === currentUser;
                      const isMember = grp.members?.some(m => m.email === currentUser);
                      const isPending = grp.pendingRequests?.includes(currentUser);

                      if (isOwner || isMember) {
                        return (
                          <Button
                            type="default"
                            size="small"
                            onClick={() => onViewDetail(grp.id)}
                            className="font-bold text-[11px] rounded-lg h-7.5 px-4"
                          >
                            Chi tiết
                          </Button>
                        );
                      }
                      if (isPending) {
                        return (
                          <Button
                            disabled
                            size="small"
                            className="font-bold text-[11px] rounded-lg h-7.5 px-4"
                          >
                            Đang chờ duyệt
                          </Button>
                        );
                      }
                      return (
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => {
                            onRequestJoin(grp.id);
                            message.success(`Đã gửi yêu cầu tham gia "${grp.name}". Vui lòng chờ Leader duyệt.`);
                          }}
                          className="font-bold text-[11px] rounded-lg h-7.5 px-4"
                        >
                          Gửi yêu cầu
                        </Button>
                      );
                    })()}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Metrics panel (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="premium-glass border border-black/5 rounded-3xl p-6 shadow-sm text-left space-y-5 bg-white">
              <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest block">Hoạt động hôm nay</span>
              
              <div className="space-y-4">
                {[
                  { label: 'Tổng tài liệu chia sẻ', num: '14,250 file', icon: 'bi-files' },
                  { label: 'Số nhóm thảo luận', num: '128 nhóm', icon: 'bi-chat-square-text' },
                  { label: 'Học viên trực tuyến', num: '• 1,040 online', icon: 'bi-wifi', active: true },
                ].map((s, i) => (
                  <div key={i} className="flex justify-between items-center bg-black/[0.005] p-3 rounded-xl border border-black/5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-black/40"><i className={`bi ${s.icon} text-[15px]`} /></span>
                      <span className="text-[12px] font-bold text-black/55">{s.label}</span>
                    </div>
                    <span className={`text-[12.5px] font-bold ${s.active ? 'text-[#34c759]' : 'text-black'}`}>{s.num}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending tags sidebar */}
            <div className="premium-glass border border-black/5 rounded-3xl p-6 shadow-sm text-left space-y-4 bg-white">
              <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest block">Chủ đề hot nhất</span>
              <div className="flex flex-wrap gap-2.5">
                {['Deep Learning', 'Calculus III', 'Microeconomics', 'Linear Algebra', 'Algorithms', 'Quantum Computing'].map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => message.info(`Lọc tài liệu theo chủ đề: ${tag}`)}
                    className="px-3 py-1.5 bg-black/[0.01] border border-black/5 hover:border-[#ff5c00]/30 hover:text-black rounded-xl text-[11px] font-bold text-black/60 transition-all cursor-pointer"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Group Create Modal (Premium Glass) */}
      <Modal
        title={null}
        open={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        footer={null}
        width={460}
        destroyOnHidden
        centered
      >
        <div className="bg-[#fafafb] px-6 py-5 border-b border-black/5 text-black flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff5c00]/3 rounded-full blur-2xl pointer-events-none" />
          <div className="w-10 h-10 rounded-xl bg-black/[0.01] border border-black/5 flex items-center justify-center text-[#ff5c00] orange-glow">
            <i className="bi bi-people text-[20px]" />
          </div>
          <div className="text-left">
            <h3 className="text-[16px] font-bold text-black tracking-tight">Tạo nhóm mới</h3>
            <p className="text-[10px] text-black/40 font-bold uppercase tracking-wider mt-1">Kết nối tri thức học thuật</p>
          </div>
        </div>

        <div className="p-6 bg-white rounded-b-2xl">
          <Form form={form} layout="vertical" onFinish={handleCreateGroup} initialValues={{ subject: 'KHOA HỌC MÁY TÍNH' }}>
            <Form.Item
              label={<span className="text-[10px] font-bold text-black/50 uppercase tracking-wider">Tên nhóm thảo luận</span>}
              name="name"
              rules={[{ required: true, message: 'Vui lòng điền tên nhóm!' }]}
            >
              <input 
                type="text" 
                placeholder="Nhóm nghiên cứu Machine Learning K22" 
                className="w-full bg-black/[0.01] border border-black/8 rounded-xl px-3.5 py-2.5 text-black text-[13px] outline-none focus:border-[#ff5c00] transition-all"
              />
            </Form.Item>

            <Form.Item label={<span className="text-[10px] font-bold text-black/50 uppercase tracking-wider">Chuyên ngành học tập</span>} name="subject">
              <Select
                className="font-semibold text-[13px]"
                classNames={{ popup: "rounded-xl" }}
                options={[
                  { value: 'KHOA HỌC MÁY TÍNH', label: 'Khoa học máy tính' },
                  { value: 'ĐẠI SỐ TUYẾN TÍNH', label: 'Đại số tuyến tính' },
                  { value: 'KINH TẾ VĨ MÔ', label: 'Kinh tế vĩ mô' },
                  { value: 'TRIẾT HỌC MÁC-LÊNIN', label: 'Triết học Mác-Lênin' },
                ]}
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-[10px] font-bold text-black/50 uppercase tracking-wider">Mô tả định hướng nhóm</span>}
              name="description"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
            >
              <textarea 
                rows={3} 
                placeholder="Nhóm tập trung chia sẻ tài liệu ôn thi cuối kỳ, tài liệu nghiên cứu giải thuật và bài tập lớn..." 
                className="w-full bg-black/[0.01] border border-black/8 rounded-xl px-3.5 py-2.5 text-black text-[13px] outline-none focus:border-[#ff5c00] transition-all resize-none"
              />
            </Form.Item>

            <div className="flex gap-3 justify-end pt-4 border-t border-black/5">
              <Button onClick={() => setShowCreateModal(false)} className="rounded-xl font-semibold text-[12px] border-black/10 hover:border-black/20 h-9">
                Hủy thao tác
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="rounded-xl font-bold text-[12.5px] h-9"
              >
                Xác nhận tạo nhóm
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
}
