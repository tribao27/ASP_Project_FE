import { useState } from 'react';
import { Table, Input, Select, Tooltip, message, Dropdown, Row, Col, Progress, Modal, Form, InputNumber, Switch } from 'antd';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MOCK_USERS, MOCK_SYSTEM_DOCS, MOCK_LOGS } from '../data/mockData';
import { formatRelativeTime, formatDateOnly } from '../utils/dateUtils';

const { Search } = Input;

// --- COMPONENTS ---
const SoftBadge = ({ color, text, dot = true, icon = null }) => {
  const colorMap = {
    orange: 'bg-[#ff5c00]/10 text-[#ff5c00] border-[#ff5c00]/20',
    blue: 'bg-[#007aff]/10 text-[#007aff] border-[#007aff]/20',
    green: 'bg-[#34c759]/10 text-[#34c759] border-[#34c759]/20',
    red: 'bg-[#ff3b30]/10 text-[#ff3b30] border-[#ff3b30]/20',
    gray: 'bg-black/5 text-black/60 border-black/10',
    purple: 'bg-[#af52de]/10 text-[#af52de] border-[#af52de]/20'
  };
  const dotColorMap = { orange: 'bg-[#ff5c00]', blue: 'bg-[#007aff]', green: 'bg-[#34c759]', red: 'bg-[#ff3b30]', gray: 'bg-black/40', purple: 'bg-[#af52de]' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold tracking-wide ${colorMap[color] || colorMap.gray}`}>
      {dot && !icon && <span className={`w-1.5 h-1.5 rounded-full ${dotColorMap[color] || dotColorMap.gray}`} />}
      {icon && <i className={`bi ${icon}`} />}
      {text}
    </span>
  );
};

export default function AdminScreen({ onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState(MOCK_USERS);
  const [docs, setDocs] = useState(MOCK_SYSTEM_DOCS);
  
  // Modals state
  const [isStorageModalVisible, setIsStorageModalVisible] = useState(false);
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [quotaForm] = Form.useForm();
  const [roleForm] = Form.useForm();
  
  const navigate = useNavigate();
  
  // --- WORKFLOW HANDLERS ---
  const handleToggleUserStatus = (user) => {
    Modal.confirm({
      title: <span className="font-bold text-[16px]">Xác nhận cập nhật trạng thái?</span>,
      content: <span className="text-[13px] text-black/60">{user.status === 'active' ? `Tài khoản ${user.email} sẽ bị buộc đăng xuất và không thể truy cập hệ thống. Dữ liệu Cloud vẫn được giữ nguyên.` : `Tài khoản ${user.email} sẽ có thể đăng nhập lại bình thường.`}</span>,
      okText: 'Xác nhận',
      cancelText: 'Hủy bỏ',
      okButtonProps: { danger: user.status === 'active', className: 'rounded-xl font-semibold shadow-none' },
      cancelButtonProps: { className: 'rounded-xl font-medium' },
      onOk: () => {
        setUsers(users.map(u => {
          if (u.id === user.id) return { ...u, status: u.status === 'active' ? 'banned' : 'active' };
          return u;
        }));
        message.success(user.status === 'active' ? 'Đã khóa tài khoản và thu hồi Token!' : 'Đã mở khóa tài khoản!');
      }
    });
  };

  const handleOpenStorageModal = (user) => {
    setSelectedUser(user);
    quotaForm.setFieldsValue({ cloudLimit: user.cloudLimit / 1000 }); // convert MB to GB roughly for UI
    setIsStorageModalVisible(true);
  };

  const handleUpdateStorage = (values) => {
    setUsers(users.map(u => {
      if (u.id === selectedUser.id) return { ...u, cloudLimit: values.cloudLimit * 1000 };
      return u;
    }));
    message.success(`Đã cập nhật dung lượng Cloud của ${selectedUser.name} lên ${values.cloudLimit} GB.`);
    setIsStorageModalVisible(false);
  };

  const handleOpenRoleModal = (user) => {
    setSelectedUser(user);
    roleForm.setFieldsValue({ role: user.role });
    setIsRoleModalVisible(true);
  };

  const handleUpdateRole = (values) => {
    setUsers(users.map(u => {
      if (u.id === selectedUser.id) return { ...u, role: values.role };
      return u;
    }));
    message.success(`Đã phân quyền ${values.role.toUpperCase()} cho ${selectedUser.name}.`);
    setIsRoleModalVisible(false);
  };

  const handleDeleteDoc = (doc) => {
    Modal.confirm({
      title: <span className="font-bold text-[16px]">Xóa tài liệu hệ thống?</span>,
      content: <span className="text-[13px] text-black/60">Bạn sắp xóa vĩnh viễn file "{doc.name}" của người dùng {doc.ownerName}. Hành động này không thể hoàn tác.</span>,
      okText: 'Xóa vĩnh viễn',
      cancelText: 'Hủy bỏ',
      okButtonProps: { danger: true, className: 'rounded-xl font-semibold shadow-none' },
      cancelButtonProps: { className: 'rounded-xl font-medium' },
      onOk: () => {
        setDocs(docs.filter(d => d.id !== doc.id));
        message.success('Đã xóa tài liệu khỏi Cloud Storage.');
      }
    });
  };

  const handleSaveSettings = () => {
    message.success('Đã lưu cấu hình hệ thống thành công!');
  };

  // --- RENDER TABS ---
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-[20px] font-bold text-[#1d1d1f] tracking-tight mb-2">Dashboard Overview</h2>
            
            {/* KPI Cards */}
            <Row gutter={[20, 20]}>
              <Col xs={24} sm={12} lg={6}>
                <div className="bg-white border border-black/5 p-6 rounded-[24px] shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#ff5c00]/5 rounded-full blur-[30px]" />
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#ff5c00]/10 text-[#ff5c00] flex items-center justify-center text-[18px]">
                      <i className="bi bi-people-fill" />
                    </div>
                    <SoftBadge color="orange" text="Active Users" dot={false} />
                  </div>
                  <div className="text-[28px] font-bold text-[#1d1d1f] tracking-tight">3<span className="text-[14px] text-black/40 font-semibold ml-1">/4</span></div>
                  <div className="text-[12px] text-[#34c759] mt-1 font-semibold flex items-center gap-1"><i className="bi bi-arrow-up-right"/> Tăng 20% so với tuần trước</div>
                </div>
              </Col>
              
              <Col xs={24} sm={12} lg={6}>
                <div className="bg-white border border-black/5 p-6 rounded-[24px] shadow-sm relative overflow-hidden hover:shadow-md transition-all">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#007aff]/5 rounded-full blur-[30px]" />
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#007aff]/10 text-[#007aff] flex items-center justify-center text-[18px]">
                      <i className="bi bi-cloud-check-fill" />
                    </div>
                    <SoftBadge color="blue" text="Cloud Used" dot={false} />
                  </div>
                  <div className="text-[28px] font-bold text-[#1d1d1f] tracking-tight">1.9<span className="text-[14px] text-black/40 font-semibold ml-1">GB</span></div>
                  <div className="mt-3">
                    <Progress percent={23} size="small" showInfo={false} strokeColor="#007aff" trailColor="rgba(0,122,255,0.1)" />
                  </div>
                </div>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <div className="bg-white border border-black/5 p-6 rounded-[24px] shadow-sm relative overflow-hidden hover:shadow-md transition-all">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#34c759]/5 rounded-full blur-[30px]" />
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#34c759]/10 text-[#34c759] flex items-center justify-center text-[18px]">
                      <i className="bi bi-file-earmark-plus-fill" />
                    </div>
                    <SoftBadge color="green" text="New Uploads" dot={false} />
                  </div>
                  <div className="text-[28px] font-bold text-[#1d1d1f] tracking-tight">128</div>
                  <div className="text-[12px] text-black/40 mt-1 font-medium">Files tải lên trong tuần</div>
                </div>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <div className="bg-white border border-black/5 p-6 rounded-[24px] shadow-sm relative overflow-hidden hover:shadow-md transition-all">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#af52de]/5 rounded-full blur-[30px]" />
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#af52de]/10 text-[#af52de] flex items-center justify-center text-[18px]">
                      <i className="bi bi-robot" />
                    </div>
                    <SoftBadge color="purple" text="AI Requests" dot={false} />
                  </div>
                  <div className="text-[28px] font-bold text-[#1d1d1f] tracking-tight">14.5<span className="text-[14px] text-black/40 font-semibold ml-1">K</span></div>
                  <div className="text-[12px] text-[#ff3b30] mt-1 font-semibold flex items-center gap-1"><i className="bi bi-exclamation-triangle-fill"/> Cảnh báo quota API</div>
                </div>
              </Col>
            </Row>

            {/* Bottom Section */}
            <Row gutter={[20, 20]}>
              <Col xs={24} lg={16}>
                <div className="bg-white border border-black/5 p-6 rounded-[24px] shadow-sm h-full flex flex-col min-h-[400px]">
                  <h3 className="text-[15px] font-bold text-[#1d1d1f] tracking-tight mb-6 flex items-center gap-2">
                    Lưu lượng & Mức sử dụng Cloud
                  </h3>
                  {/* Mock Area Chart */}
                  <div className="flex-1 w-full bg-black/[0.02] rounded-2xl relative border border-black/5 flex items-end justify-between p-6">
                     <svg className="absolute inset-0 w-full h-full opacity-50" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <path d="M0,100 L0,80 C20,70 30,90 50,60 C70,30 80,50 100,20 L100,100 Z" fill="url(#grad)" />
                        <path d="M0,80 C20,70 30,90 50,60 C70,30 80,50 100,20" fill="none" stroke="#ff5c00" strokeWidth="2" />
                        <defs>
                          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ff5c00" stopOpacity="0.15"/>
                            <stop offset="100%" stopColor="#ff5c00" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                     </svg>
                  </div>
                </div>
              </Col>
              
              <Col xs={24} lg={8}>
                <div className="bg-white border border-black/5 p-6 rounded-[24px] shadow-sm h-full min-h-[400px]">
                  <h3 className="text-[15px] font-bold text-[#1d1d1f] tracking-tight mb-6">System Logs</h3>
                  <div className="space-y-5">
                    {MOCK_LOGS.map((log, i) => (
                      <div key={i} className="flex gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          log.color === 'blue' ? 'bg-[#007aff]/10 text-[#007aff]' :
                          log.color === 'purple' ? 'bg-[#af52de]/10 text-[#af52de]' :
                          log.color === 'orange' ? 'bg-[#ff5c00]/10 text-[#ff5c00]' :
                          'bg-[#ff3b30]/10 text-[#ff3b30]'
                        }`}>
                          <i className={`bi ${log.icon} text-[14px]`} />
                        </div>
                        <div className="flex-1 border-b border-black/5 pb-4">
                          <div className="flex justify-between items-center mb-1">
                            <div className="text-[13px] font-semibold text-[#1d1d1f]">{log.action}</div>
                            <div className="text-[10px] font-medium text-black/40">{formatRelativeTime(log.time)}</div>
                          </div>
                          <div className="text-[12px] text-black/60 leading-relaxed">
                            <span className="font-semibold text-black/80">{log.user}</span>: {log.detail}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>
          </motion.div>
        );
      
      case 'users':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 flex flex-col h-full">
            <div className="flex justify-between items-center bg-white p-5 rounded-[24px] border border-black/5 shadow-sm">
              <div>
                <h2 className="text-[18px] font-bold text-[#1d1d1f]">User Management</h2>
                <p className="text-[12px] font-medium text-black/50">Quản lý định danh, trạng thái và dung lượng Cloud của sinh viên.</p>
              </div>
              <div className="flex gap-3 bg-black/[0.02] p-1.5 rounded-[16px] border border-black/5">
                 <Select defaultValue="all" className="premium-select-input" style={{ width: 150 }} popupClassName="premium-dropdown">
                  <Select.Option value="all">Tất cả vai trò</Select.Option>
                  <Select.Option value="admin">Quản trị viên</Select.Option>
                  <Select.Option value="user">Học viên</Select.Option>
                </Select>
                <Input 
                  placeholder="Tìm kiếm MSSV, Email..." 
                  prefix={<i className="bi bi-search text-black/40 mr-1.5" />} 
                  allowClear 
                  className="premium-search-input" 
                  style={{ width: 280 }} 
                />
              </div>
            </div>
            
            <div className="bg-white border border-black/5 rounded-[24px] overflow-hidden shadow-sm flex-1">
              <Table 
                dataSource={users} 
                rowKey="id" 
                pagination={{ pageSize: 8 }}
                className="admin-light-table"
                columns={[
                  { title: 'User (ID & Name)', key: 'user', render: (_, r) => (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center font-bold text-[13px] text-[#ff5c00]">
                        {r.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-[#1d1d1f]">{r.name}</div>
                        <div className="text-[11px] font-mono text-black/40 uppercase tracking-wider">{r.mssv}</div>
                      </div>
                    </div>
                  )},
                  { title: 'Email liên hệ', dataIndex: 'email', key: 'email', render: t => <span className="text-black/60 font-medium">{t}</span> },
                  { title: 'Vai trò & TT', key: 'roleStatus', render: (_, r) => (
                    <div className="flex gap-2">
                       <SoftBadge color={r.role === 'admin' ? 'orange' : 'gray'} text={r.role === 'admin' ? 'Admin' : 'User'} dot={false} />
                       <SoftBadge color={r.status === 'active' ? 'green' : 'red'} text={r.status === 'active' ? 'Active' : 'Banned'} />
                    </div>
                  )},
                  { title: 'Cloud Usage', key: 'cloud', width: 250, render: (_, r) => {
                    const percent = Math.round((r.cloudUsed / r.cloudLimit) * 100);
                    const isWarning = percent > 70 && percent <= 90;
                    const isDanger = percent > 90;
                    const strokeColor = isDanger ? '#ff3b30' : isWarning ? '#ffcc00' : '#34c759';
                    return (
                      <div>
                         <div className="flex justify-between text-[11px] font-semibold mb-1">
                            <span className="text-black/50">{r.cloudUsed}MB</span>
                            <span className="text-black/80">{r.cloudLimit >= 1000 ? `${r.cloudLimit/1000}GB` : `${r.cloudLimit}MB`}</span>
                         </div>
                         <Progress percent={percent} size="small" showInfo={false} strokeColor={strokeColor} trailColor="rgba(0,0,0,0.05)" />
                      </div>
                    )
                  }},
                  { title: 'Hành động', key: 'action', align: 'right', render: (_, r) => (
                    <Dropdown menu={{ items: [
                      { key: '1', label: r.status === 'active' ? <div className="flex items-center gap-3 text-[#ff3b30]"><div className="w-7 h-7 rounded-lg bg-[#ff3b30]/10 flex items-center justify-center"><i className="bi bi-shield-lock"/></div><span className="font-semibold text-[13px]">Khóa tài khoản</span></div> : <div className="flex items-center gap-3 text-[#34c759]"><div className="w-7 h-7 rounded-lg bg-[#34c759]/10 flex items-center justify-center"><i className="bi bi-shield-check"/></div><span className="font-semibold text-[13px]">Mở khóa User</span></div>, onClick: () => handleToggleUserStatus(r) },
                      { type: 'divider' },
                      { key: '2', label: <div className="flex items-center gap-3 text-[#1d1d1f]"><div className="w-7 h-7 rounded-lg bg-black/5 flex items-center justify-center text-black/60"><i className="bi bi-hdd-network"/></div><span className="font-semibold text-[13px]">Đổi dung lượng</span></div>, onClick: () => handleOpenStorageModal(r) },
                      { key: '3', label: <div className="flex items-center gap-3 text-[#1d1d1f]"><div className="w-7 h-7 rounded-lg bg-black/5 flex items-center justify-center text-black/60"><i className="bi bi-person-gear"/></div><span className="font-semibold text-[13px]">Phân quyền Role</span></div>, onClick: () => handleOpenRoleModal(r) },
                    ] }} placement="bottomRight" trigger={['click']} overlayClassName="premium-action-dropdown">
                      <button className="h-9 w-9 rounded-[12px] bg-white border border-black/5 text-black/60 hover:bg-black/5 hover:text-black hover:border-black/10 transition-all flex items-center justify-center shadow-sm">
                        <i className="bi bi-three-dots" />
                      </button>
                    </Dropdown>
                  ) }
                ]} 
              />
            </div>
          </motion.div>
        );

      case 'docs':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 flex flex-col h-full">
            <div className="flex justify-between items-center bg-white p-5 rounded-[24px] border border-black/5 shadow-sm">
              <div>
                <h2 className="text-[18px] font-bold text-[#1d1d1f]">Document Moderation</h2>
                <p className="text-[12px] font-medium text-black/50">Kiểm duyệt và quản lý toàn bộ tài liệu lưu trữ trên Cloud.</p>
              </div>
              <div className="flex gap-3 bg-black/[0.02] p-1.5 rounded-[16px] border border-black/5 w-full lg:w-auto">
                <Select defaultValue="all_format" className="premium-select-input" style={{ width: 160 }} popupClassName="premium-dropdown">
                  <Select.Option value="all_format">Mọi định dạng</Select.Option>
                  <Select.Option value="pdf">Tài liệu .PDF</Select.Option>
                  <Select.Option value="docx">Văn bản .DOCX</Select.Option>
                </Select>
                <Select defaultValue="all" className="premium-select-input" style={{ width: 170 }} popupClassName="premium-dropdown">
                  <Select.Option value="all">Tất cả môn học</Select.Option>
                </Select>
                <Input 
                  placeholder="Tìm tên file..." 
                  prefix={<i className="bi bi-search text-black/40 mr-1.5" />} 
                  allowClear
                  className="premium-search-input" 
                  style={{ width: 220 }} 
                />
              </div>
            </div>

            <div className="bg-white border border-black/5 rounded-[24px] overflow-hidden shadow-sm flex-1">
              <Table 
                dataSource={docs} 
                rowKey="id" 
                pagination={false}
                className="admin-light-table"
                columns={[
                  { title: 'Tên File & Định dạng', dataIndex: 'name', key: 'name', render: (t, r) => (
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[18px] ${r.format === 'pdf' ? 'bg-[#ff3b30]/10 text-[#ff3b30]' : r.format === 'docx' ? 'bg-[#007aff]/10 text-[#007aff]' : 'bg-[#34c759]/10 text-[#34c759]'}`}>
                        <i className={`bi ${r.format === 'pdf' ? 'bi-file-pdf-fill' : r.format === 'docx' ? 'bi-file-word-fill' : 'bi-file-earmark-spreadsheet-fill'}`} />
                      </div>
                      <div>
                         <div className="font-semibold text-[#1d1d1f] max-w-[250px] truncate">{t}</div>
                         <div className="text-[11px] text-black/40 font-medium uppercase tracking-wider">{r.subject}</div>
                      </div>
                    </div>
                  )},
                  { title: 'Người Upload', dataIndex: 'owner', key: 'owner', render: (_, r) => (
                    <div>
                      <div className="font-semibold text-[#1d1d1f] hover:text-[#ff5c00] cursor-pointer transition-colors">{r.ownerName}</div>
                      <div className="text-[11px] text-black/50">{r.owner}</div>
                    </div>
                  )},
                  { title: 'Kích thước / Thời gian', key: 'meta', render: (_, r) => (
                    <div>
                      <div className="text-[13px] font-semibold text-black/70">{r.size}</div>
                      <div className="text-[11px] text-black/40 font-medium">{formatRelativeTime(r.uploadedAt)}</div>
                    </div>
                  )},
                  { title: 'Kiểm duyệt', key: 'action', align: 'right', render: (_, r) => (
                    <div className="flex gap-2 justify-end">
                      <Tooltip title="Preview">
                        <button className="h-9 w-9 rounded-xl bg-[#007aff]/10 text-[#007aff] hover:bg-[#007aff]/20 transition-all flex items-center justify-center">
                          <i className="bi bi-eye-fill" />
                        </button>
                      </Tooltip>
                      <Tooltip title="Xóa khỏi Cloud (Vi phạm)">
                        <button 
                          onClick={() => handleDeleteDoc(r)} 
                          className="h-9 px-3 rounded-xl bg-[#ff3b30]/10 text-[#ff3b30] hover:bg-[#ff3b30]/20 transition-all flex items-center gap-2 font-semibold text-[12px]"
                        >
                          <i className="bi bi-trash3-fill" /> Ban File
                        </button>
                      </Tooltip>
                    </div>
                  ) }
                ]} 
              />
            </div>
          </motion.div>
        );

      case 'settings':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-[20px] font-bold text-[#1d1d1f] tracking-tight mb-2">System & AI Settings</h2>
            
            <div className="bg-white border border-black/5 p-8 rounded-[24px] shadow-sm max-w-4xl">
              <h3 className="text-[15px] font-bold text-[#1d1d1f] tracking-tight mb-6 flex items-center gap-2 border-b border-black/5 pb-4">
                <i className="bi bi-cloud-arrow-up-fill text-[#007aff]" /> Cấu hình Cloud Storage mặc định
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="font-semibold text-[13px] text-[#1d1d1f] mb-1">Dung lượng cấp cho tài khoản mới (Default Quota)</div>
                  <div className="text-[12px] text-black/50 mb-3 font-medium">Giới hạn không gian lưu trữ cho sinh viên mới đăng ký. Tính bằng GB.</div>
                  <InputNumber defaultValue={1} min={1} max={50} addonAfter="GB" className="custom-input-number w-full" />
                </div>
                <div>
                  <div className="font-semibold text-[13px] text-[#1d1d1f] mb-1">Dung lượng file tải lên tối đa (Max Upload Size)</div>
                  <div className="text-[12px] text-black/50 mb-3 font-medium">Giới hạn kích thước cho một lần upload file. Tính bằng MB.</div>
                  <InputNumber defaultValue={50} min={5} max={1000} addonAfter="MB" className="custom-input-number w-full" />
                </div>
              </div>

              <h3 className="text-[15px] font-bold text-[#1d1d1f] tracking-tight mb-6 flex items-center gap-2 border-b border-black/5 pb-4 pt-4">
                <i className="bi bi-robot text-[#af52de]" /> Tích hợp Chatbot AI (ChatbotService)
              </h3>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-center justify-between bg-black/[0.02] p-4 rounded-2xl border border-black/5">
                   <div>
                     <div className="font-semibold text-[13px] text-[#1d1d1f]">Trạng thái kết nối AI Service</div>
                     <div className="text-[12px] text-black/50 font-medium">Ping tới máy chủ Chatbot Backend.</div>
                   </div>
                   <SoftBadge color="green" text="Connected & Healthy" icon="bi-check-circle-fill" dot={false} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="font-semibold text-[13px] text-[#1d1d1f] mb-1">Giới hạn Tokens / Ngày / User</div>
                    <div className="text-[12px] text-black/50 mb-3 font-medium">Để kiểm soát chi phí API (API Cost control).</div>
                    <InputNumber defaultValue={2000} min={100} addonAfter="Tokens" className="custom-input-number w-full" />
                  </div>
                  <div>
                    <div className="font-semibold text-[13px] text-[#1d1d1f] mb-1">Cho phép AI đọc PDF nội bộ</div>
                    <div className="text-[12px] text-black/50 mb-3 font-medium">Bật/tắt tính năng RAG phân tích tài liệu của sinh viên.</div>
                    <Switch defaultChecked style={{ background: '#af52de' }} />
                  </div>
                </div>
              </div>

              <div className="border-t border-black/5 pt-6 flex justify-end">
                 <button onClick={handleSaveSettings} className="h-10 px-8 rounded-xl bg-[#ff5c00] text-white font-semibold text-[13px] shadow-[0_5px_15px_rgba(255,92,0,0.2)] hover:shadow-[0_10px_20px_rgba(255,92,0,0.3)] hover:-translate-y-0.5 transition-all">
                    Lưu toàn bộ Cấu hình
                 </button>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen max-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans overflow-hidden">
      {/* Admin Sidebar */}
      <aside className="w-[280px] bg-white border-r border-black/5 flex flex-col shrink-0 relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        {/* Brand */}
        <div className="p-6 pt-8 flex items-center gap-4 border-b border-black/5">
          <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#ff8a00] to-[#ff5c00] flex items-center justify-center shadow-md shadow-[#ff5c00]/20 shrink-0">
            <i className="bi bi-shield-lock-fill text-[18px] text-white" />
          </div>
          <div>
            <h1 className="font-bold text-[16px] tracking-tight text-[#1d1d1f] leading-none mb-1">AI Study Hub</h1>
            <span className="text-[10px] font-semibold text-[#ff5c00] uppercase tracking-widest block bg-[#ff5c00]/10 inline-block px-2 py-0.5 rounded-md">Admin Console</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-5 py-6 space-y-2 overflow-y-auto">
          {[
            { id: 'overview', icon: 'bi-grid-1x2-fill', label: 'Dashboard Overview' },
            { id: 'users', icon: 'bi-people-fill', label: 'User Management' },
            { id: 'docs', icon: 'bi-card-checklist', label: 'Document Moderation' },
            { id: 'settings', icon: 'bi-sliders', label: 'System & AI Settings' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-[14px] transition-all font-semibold text-[13px] text-left relative overflow-hidden group ${
                activeTab === tab.id 
                  ? 'text-[#ff5c00] bg-[#ff5c00]/10' 
                  : 'text-black/60 hover:text-black hover:bg-black/[0.02]'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="adminNavIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#ff5c00] rounded-r-full" 
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <i className={`bi ${tab.icon} text-[16px] ${activeTab === tab.id ? 'text-[#ff5c00]' : 'group-hover:text-[#ff5c00] transition-colors'}`} />
              <span className="tracking-wide">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* User profile / Logout */}
        <div className="p-5 border-t border-black/5 bg-black/[0.01]">
          <button 
            onClick={() => {
              if (onLogout) onLogout();
              navigate('/admin/login');
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-[14px] text-[#ff3b30] bg-[#ff3b30]/10 hover:bg-[#ff3b30]/20 transition-all text-[13px] font-semibold"
          >
            <i className="bi bi-box-arrow-left text-[15px]" />
            Đăng xuất Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden bg-[#f5f5f7]">
        {/* Topbar */}
        <header className="h-[72px] border-b border-black/5 flex items-center justify-between px-8 shrink-0 bg-white/70 backdrop-blur-xl relative z-10">
          <div className="flex items-center gap-2 text-black/40 text-[12px] font-semibold uppercase tracking-widest bg-black/5 px-4 py-1.5 rounded-full">
            <i className="bi bi-house-door" /> <span className="mx-1">/</span> <span className="text-[#ff5c00]">{activeTab.replace('_', ' ')}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Tooltip title="Thông báo hệ thống">
              <button className="w-9 h-9 rounded-full bg-white border border-black/5 shadow-sm flex items-center justify-center text-black/50 hover:text-[#ff5c00] hover:border-[#ff5c00]/30 transition-all relative cursor-pointer">
                <i className="bi bi-bell-fill text-[14px]" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#ff5c00] rounded-full border-2 border-white" />
              </button>
            </Tooltip>
            
            <div className="flex items-center gap-3 pl-5 border-l border-black/10">
              <div className="text-right hidden md:block">
                <div className="text-[13px] font-bold text-[#1d1d1f] leading-none mb-1">System Admin</div>
                <div className="text-[10px] text-[#34c759] font-semibold tracking-widest uppercase">Online</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff8a00] to-[#ff5c00] p-[2px] shadow-sm">
                <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center text-[#ff5c00] font-bold text-[15px]">
                  A
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative z-10">
          <div className="max-w-[1400px] mx-auto h-full">
             {renderContent()}
          </div>
        </div>
      </main>
      
      {/* MODALS */}
      {/* Storage Modal */}
      <Modal
        title={<div className="font-bold text-[16px] text-[#1d1d1f] mb-1">Thay đổi dung lượng Cloud Storage</div>}
        open={isStorageModalVisible}
        onCancel={() => setIsStorageModalVisible(false)}
        footer={null}
        width={420}
        centered
        className="premium-modal"
      >
        <div className="pt-2 pb-1">
          <div className="flex items-center gap-3 mb-6 bg-black/5 p-4 rounded-2xl border border-black/5">
             <div className="w-10 h-10 bg-white rounded-[12px] flex items-center justify-center font-bold text-[14px] text-[#ff5c00] shadow-sm">{selectedUser?.name.charAt(0)}</div>
             <div>
               <div className="font-semibold text-[14px] text-[#1d1d1f]">{selectedUser?.name}</div>
               <div className="text-[12px] text-black/50 font-mono">{selectedUser?.email}</div>
             </div>
          </div>
          <Form form={quotaForm} layout="vertical" onFinish={handleUpdateStorage}>
            <Form.Item name="cloudLimit" label={<span className="font-semibold text-[13px] text-black/80">Giới hạn lưu trữ mới (Tính bằng GB)</span>} rules={[{ required: true }]}>
               <InputNumber className="custom-input-number w-full" min={1} max={100} addonAfter="GB" />
            </Form.Item>
            <div className="text-[12px] text-black/60 font-medium bg-[#ff5c00]/5 border border-[#ff5c00]/20 p-3.5 rounded-[14px] mb-6 flex items-start gap-2.5 leading-relaxed">
               <i className="bi bi-info-circle-fill mt-0.5 text-[#ff5c00]" />
               Hệ thống sẽ cập nhật Quota Rule cho thư mục của người dùng trên Cloud Storage ngay lập tức.
            </div>
            <div className="flex justify-end gap-3 pt-2">
               <button type="button" onClick={() => setIsStorageModalVisible(false)} className="h-10 px-5 rounded-[12px] font-semibold text-[13px] text-black/60 bg-black/5 hover:bg-black/10 transition-colors">Hủy bỏ</button>
               <button type="submit" className="h-10 px-6 rounded-[12px] font-bold text-[13px] text-white bg-[#ff5c00] hover:bg-[#ff8a00] shadow-[0_4px_10px_rgba(255,92,0,0.2)] transition-all">Xác nhận lưu</button>
            </div>
          </Form>
        </div>
      </Modal>

      {/* Role Modal */}
      <Modal
        title={<div className="font-bold text-[16px] text-[#1d1d1f] mb-1">Thay đổi Phân quyền (Role)</div>}
        open={isRoleModalVisible}
        onCancel={() => setIsRoleModalVisible(false)}
        footer={null}
        width={420}
        centered
        className="premium-modal"
      >
        <div className="pt-2 pb-1">
          <div className="flex items-center gap-3 mb-6 bg-black/5 p-4 rounded-2xl border border-black/5">
             <div className="w-10 h-10 bg-white rounded-[12px] flex items-center justify-center font-bold text-[14px] text-[#ff5c00] shadow-sm">{selectedUser?.name.charAt(0)}</div>
             <div>
               <div className="font-semibold text-[14px] text-[#1d1d1f]">{selectedUser?.name}</div>
               <div className="text-[12px] text-black/50 font-mono">{selectedUser?.email}</div>
             </div>
          </div>
          <Form form={roleForm} layout="vertical" onFinish={handleUpdateRole}>
            <Form.Item name="role" label={<span className="font-semibold text-[13px] text-black/80">Lựa chọn vai trò</span>} rules={[{ required: true }]}>
               <Select className="custom-select-modal">
                 <Select.Option value="user">Người dùng (User)</Select.Option>
                 <Select.Option value="admin">Quản trị viên (Admin)</Select.Option>
               </Select>
            </Form.Item>
            <div className="text-[12px] text-black/60 font-medium bg-[#ff5c00]/5 border border-[#ff5c00]/20 p-3.5 rounded-[14px] mb-6 flex items-start gap-2.5 leading-relaxed">
               <i className="bi bi-shield-exclamation text-[#ff5c00] mt-0.5 text-[14px]" />
               Cấp quyền Admin sẽ cho phép người này can thiệp vào toàn bộ hệ thống. Hãy cẩn trọng.
            </div>
            <div className="flex justify-end gap-3 pt-2">
               <button type="button" onClick={() => setIsRoleModalVisible(false)} className="h-10 px-5 rounded-[12px] font-semibold text-[13px] text-black/60 bg-black/5 hover:bg-black/10 transition-colors">Hủy bỏ</button>
               <button type="submit" className="h-10 px-6 rounded-[12px] font-bold text-[13px] text-white bg-[#ff5c00] hover:bg-[#ff8a00] shadow-[0_4px_10px_rgba(255,92,0,0.2)] transition-all">Lưu quyền mới</button>
            </div>
          </Form>
        </div>
      </Modal>

      <style>{`
        /* Table Styles (Premium Light) */
        .admin-light-table .ant-table { background: transparent !important; }
        .admin-light-table .ant-table-thead > tr > th {
          background: rgba(0, 0, 0, 0.02) !important;
          color: rgba(0, 0, 0, 0.5) !important;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
          font-weight: 700; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;
          padding: 14px 20px !important;
        }
        .admin-light-table .ant-table-thead > tr > th:first-child { padding-left: 24px !important; }
        .admin-light-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid rgba(0, 0, 0, 0.03) !important;
          font-size: 13px; padding: 14px 20px !important; color: #1d1d1f;
        }
        .admin-light-table .ant-table-tbody > tr > td:first-child { padding-left: 24px !important; }
        .admin-light-table .ant-table-tbody > tr:hover > td { background: rgba(0, 0, 0, 0.015) !important; }
        
        /* Modern Premium Select & Search Inputs */
        .premium-search-input {
          height: 44px; border-radius: 12px !important; background: white; border-color: transparent; font-weight: 500; font-size: 13px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.02); padding-left: 14px;
        }
        .premium-search-input input { font-weight: 500; }
        .premium-search-input:focus-within { border-color: #ff5c00; box-shadow: 0 0 0 3px rgba(255,92,0,0.1); }
        .premium-search-input .ant-input-clear-icon { color: rgba(0,0,0,0.2) !important; font-size: 14px; }
        .premium-search-input .ant-input-clear-icon:hover { color: #ff3b30 !important; }
        
        .premium-select-input .ant-select-selector { height: 44px !important; border-radius: 12px !important; background: white !important; border-color: transparent !important; align-items: center; font-weight: 600; font-size: 13px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
        .premium-select-input.ant-select-focused .ant-select-selector { border-color: #ff5c00 !important; box-shadow: 0 0 0 3px rgba(255,92,0,0.1) !important; }

        /* Premium Dropdowns (Select and Action Menus) */
        .premium-dropdown .ant-select-item { border-radius: 8px; margin: 4px; padding: 10px 12px; font-weight: 500; }
        .premium-dropdown .ant-select-item-option-selected { background-color: rgba(255,92,0,0.1) !important; color: #ff5c00 !important; font-weight: 700; }
        
        .premium-action-dropdown .ant-dropdown-menu {
          padding: 8px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid rgba(0,0,0,0.05);
          min-width: 220px;
        }
        .premium-action-dropdown .ant-dropdown-menu-item {
          border-radius: 12px; padding: 8px; transition: all 0.2s ease;
        }
        .premium-action-dropdown .ant-dropdown-menu-item:hover {
          background-color: rgba(0,0,0,0.03);
        }
        .premium-action-dropdown .ant-dropdown-menu-item-divider {
          margin: 8px 4px; background-color: rgba(0,0,0,0.05);
        }
        
        /* Input Number inside Settings */
        .custom-input-number .ant-input-number-input-wrap input { height: 40px; font-weight: 600; border-radius: 10px 0 0 10px; }
        .custom-input-number .ant-input-number-group-addon { border-radius: 0 10px 10px 0; background: rgba(0,0,0,0.02); font-weight: 600; border-color: #d9d9d9; }
        .custom-input-number:hover { border-color: #ff5c00; }
        .custom-input-number.ant-input-number-focused { border-color: #ff5c00; box-shadow: 0 0 0 2px rgba(255,92,0,0.1); }

        .custom-select-modal .ant-select-selector { height: 42px !important; border-radius: 10px !important; align-items: center; font-weight: 600; }
        .custom-select-modal.ant-select-focused .ant-select-selector { border-color: #ff5c00 !important; box-shadow: 0 0 0 2px rgba(255,92,0,0.1) !important; }
        
        /* Modals */
        .premium-modal .ant-modal-content {
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          border: 1px solid rgba(0,0,0,0.05);
        }
        .premium-modal .ant-modal-header { margin-bottom: 16px; }

        /* Scrollbar */
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.15); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.25); }
      `}</style>
    </div>
  );
}
