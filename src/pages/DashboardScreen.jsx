/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Table, Button, Tag, Modal, Form, Select, Upload, Tooltip, message, Segmented } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import FileIcon from '../components/FileIcon.jsx';
import DocumentViewer from '../components/DocumentViewer.jsx';
import { getFileTagColor, getFileTypeLabel, detectFileType } from '../utils/helpers.js';
import { TAB_OPTIONS, UPLOAD_TYPE_OPTIONS } from '../data';
import { formatRelativeTime } from '../utils/dateUtils';

const { Dragger } = Upload;

export default function DashboardScreen({
  documents,
  searchTerm,
  onAddDocument,
  onRemoveDocument,
  onSelectActiveDocument,
  currentUser,
  onLogout,
  onNavigate,
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [form] = Form.useForm();

  // Draggable floating assistant state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offsetStart, setOffsetStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setOffsetStart({ x: position.x, y: position.y });
    e.preventDefault();
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX, y: touch.clientY });
    setOffsetStart({ x: position.x, y: position.y });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setPosition({
        x: offsetStart.x + (e.clientX - dragStart.x),
        y: offsetStart.y + (e.clientY - dragStart.y)
      });
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, offsetStart]);

  useEffect(() => {
    const handleTouchMove = (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      setPosition({
        x: offsetStart.x + (touch.clientX - dragStart.x),
        y: offsetStart.y + (touch.clientY - dragStart.y)
      });
    };
    const handleTouchEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragStart, offsetStart]);

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes((searchTerm || '').toLowerCase());
    const matchesTab = activeTab === 'all' || doc.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleUploadSubmit = (values) => {
    let finalName = values.name;
    if (!finalName.includes('.')) finalName += `.${values.type}`;

    const newDoc = {
      id: 'doc_' + Date.now(),
      name: finalName,
      uploadedAt: new Date().toISOString(),
      size: values.size || '2.0 MB',
      type: values.type,
      content: values.content || `Nội dung mô phỏng chi tiết cho tài liệu học tập của ${finalName}.`,
    };

    onAddDocument(newDoc);
    form.resetFields();
    setShowUploadModal(false);
    message.success(`Đã tải lên "${finalName}" thành công!`);
  };

  const handleAskAIOnDoc = (doc) => {
    onSelectActiveDocument(doc);
    onNavigate('ai');
  };

  const columns = [
    {
      title: 'Tên tài liệu',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <FileIcon type={record.type} />
          <span
            className="font-semibold text-black hover:text-[#ff5c00] transition-colors cursor-pointer text-[13px] tracking-tight"
            onClick={() => setPreviewDoc(record)}
          >
            {text}
          </span>
        </div>
      ),
    },
    {
      title: 'Định dạng',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type) => (
        <Tag color={getFileTagColor(type)} className="font-bold text-[9px] uppercase rounded-full border-none px-2.5 py-0.5">
          {getFileTypeLabel(type)}
        </Tag>
      ),
    },
    {
      title: 'Ngày đồng bộ',
      dataIndex: 'uploadedAt',
      key: 'uploadedAt',
      width: 180,
      className: 'text-[12.5px] text-black/55 font-medium',
      render: (val) => formatRelativeTime(val),
    },
    {
      title: 'Dung lượng',
      dataIndex: 'size',
      key: 'size',
      width: 120,
      className: 'text-[12.5px] text-black/60 font-semibold',
    },
    {
      title: '',
      key: 'actions',
      width: 180,
      align: 'right',
      render: (_, record) => (
        <div className="flex items-center justify-end gap-2.5">
          <Button
            type="primary"
            size="small"
            onClick={() => handleAskAIOnDoc(record)}
            className="font-bold text-[11px] rounded-lg h-7 px-3.5"
          >
            <i className="bi bi-chat-dots mr-1" /> Hỏi AI
          </Button>
          <Tooltip title="Xóa tạm thời">
            <Button
              type="text"
              danger
              size="small"
              className="text-black/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg h-7 w-7 flex items-center justify-center cursor-pointer"
              onClick={() => {
                onRemoveDocument(record.id);
                message.success('Đã chuyển tài liệu vào Thùng rác.');
              }}
            >
              <i className="bi bi-trash3 text-[13px]" />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  // Removed heavy Framer Motion variants

  return (
    <div className="flex-1 w-full h-full overflow-y-auto px-3 sm:px-4 md:px-8 pb-10 pt-3 sm:pt-4 text-left select-none relative">
      <div>

        {/* Title + Action bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
          <div>
            <h2 className="text-[20px] sm:text-[23px] font-extrabold text-[#1d1d1f] tracking-tight">Thư viện của tôi</h2>
            <p className="text-[12px] sm:text-[13px] text-black/50 mt-0.5 font-semibold">Quản lý và số hóa học phần học thuật cùng Trợ lý AI</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] text-white rounded-xl font-bold text-[12px] sm:text-[13px] px-3.5 sm:px-4.5 py-2 flex items-center gap-1.5 shadow-lg orange-glow cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              <i className="bi bi-cloud-arrow-up text-[14px]" /> Tải lên tài liệu
            </button>

            <button
              onClick={() => {
                const name = prompt('Nhập tên thư mục mới:');
                if (name) message.success(`Đã tạo thư mục "${name}"`);
              }}
              className="bg-black/[0.01] border border-black/8 hover:border-black/20 text-black rounded-xl font-semibold text-[13px] px-4 py-2 flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              <i className="bi bi-folder-plus text-[14px] text-black/60" /> Tạo mục mới
            </button>

            <Segmented
              options={[
                { value: 'list', icon: <i className="bi bi-list-ul" /> },
                { value: 'grid', icon: <i className="bi bi-grid-3x3-gap" /> },
              ]}
              value={viewMode}
              onChange={setViewMode}
              className="p-0.5 rounded-xl border border-black/5 bg-black/[0.005]"
            />
          </div>
        </div>

        {/* Categories / Filter tabs */}
        <div className="mb-5 sm:mb-6 flex flex-wrap gap-2">
          {TAB_OPTIONS.map((tab) => {
            const count = tab.value === 'all'
              ? documents.length
              : documents.filter((d) => d.type === tab.value).length;
            const isActive = activeTab === tab.value;

            // Soft luxury format color mapping
            const tabColors = {
              all: {
                active: 'bg-[#1d1d1f] text-white font-extrabold shadow-sm border border-[#1d1d1f]',
                inactive: 'bg-black/[0.015] text-black/60 border border-black/5 hover:border-black/20 hover:text-black font-semibold',
                badgeActive: 'bg-white/20 text-white',
                badgeInactive: 'bg-black/5 text-black/40'
              },
              pdf: {
                active: 'bg-red-500 text-white font-extrabold shadow-md shadow-red-500/10 border border-red-500',
                inactive: 'bg-red-50/50 text-red-600 border border-red-100/40 hover:bg-red-50 hover:text-red-700 font-semibold',
                badgeActive: 'bg-white/20 text-white',
                badgeInactive: 'bg-red-100/50 text-red-600'
              },
              docx: {
                active: 'bg-blue-500 text-white font-extrabold shadow-md shadow-blue-500/10 border border-blue-500',
                inactive: 'bg-blue-50/50 text-blue-600 border border-blue-100/40 hover:bg-blue-50 hover:text-blue-700 font-semibold',
                badgeActive: 'bg-white/20 text-white',
                badgeInactive: 'bg-blue-100/50 text-blue-600'
              },
              pptx: {
                active: 'bg-orange-500 text-white font-extrabold shadow-md shadow-orange-500/10 border border-orange-500',
                inactive: 'bg-orange-50/50 text-orange-600 border border-orange-100/40 hover:bg-orange-50 hover:text-orange-700 font-semibold',
                badgeActive: 'bg-white/20 text-white',
                badgeInactive: 'bg-orange-100/50 text-orange-600'
              },
              xlsx: {
                active: 'bg-emerald-500 text-white font-extrabold shadow-md shadow-emerald-500/10 border border-emerald-500',
                inactive: 'bg-emerald-50/50 text-emerald-600 border border-emerald-100/40 hover:bg-emerald-50 hover:text-emerald-700 font-semibold',
                badgeActive: 'bg-white/20 text-white',
                badgeInactive: 'bg-emerald-100/50 text-emerald-600'
              },
              txt: {
                active: 'bg-purple-500 text-white font-extrabold shadow-md shadow-purple-500/10 border border-purple-500',
                inactive: 'bg-purple-50/50 text-purple-600 border border-purple-100/40 hover:bg-purple-50 hover:text-purple-700 font-semibold',
                badgeActive: 'bg-white/20 text-white',
                badgeInactive: 'bg-purple-100/50 text-purple-600'
              }
            };

            const classes = tabColors[tab.value] || tabColors.all;

            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4.5 py-2 rounded-full text-[12px] transition-all duration-200 flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.97] ${isActive ? classes.active : classes.inactive
                  }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[9.5px] px-2 py-0.5 rounded-full font-bold ${isActive ? classes.badgeActive : classes.badgeInactive
                  }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main List content viewport */}
        <div className="flex-1 w-full flex flex-col relative animate-fade-in">
          {viewMode === 'list' ? (
            <div
              key="list-view"
              className="premium-glass rounded-2xl border border-black/5 p-2 shadow-sm overflow-x-auto flex-1 animate-fade-in"
            >
              <Table
                className="min-w-[600px]"
                columns={columns}
                dataSource={filteredDocs}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showTotal: (total) => `Tổng cộng ${total} tài liệu`,
                  className: 'px-4 font-semibold text-black/45 text-[12px]',
                }}
                locale={{ emptyText: <span className="text-black/35 text-[12.5px] font-semibold py-8 block text-center">Thư mục trống</span> }}
                size="middle"
              />
            </div>
          ) : (
            <div
              key="grid-view"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 flex-1 animate-fade-in"
            >
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-black/5 p-5 shadow-sm flex flex-col justify-between group overflow-hidden relative hover-card-depth cursor-pointer transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <Tag color={getFileTagColor(doc.type)} className="font-bold text-[9px] rounded-full uppercase border-none px-2 py-0.5">
                        {getFileTypeLabel(doc.type)}
                      </Tag>
                      <Button
                        type="text"
                        danger
                        size="small"
                        className="text-black/30 hover:text-red-500 hover:bg-red-500/10 rounded-lg h-7 w-7 flex items-center justify-center cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveDocument(doc.id);
                          message.success('Đã chuyển tài liệu vào Thùng rác.');
                        }}
                      >
                        <i className="bi bi-trash3" />
                      </Button>
                    </div>
                    <div className="flex gap-3 items-center cursor-pointer" onClick={() => setPreviewDoc(doc)}>
                      <FileIcon type={doc.type} />
                      <h4 className="font-semibold text-[14.5px] text-black tracking-tight line-clamp-1 group-hover:text-[#ff5c00] transition-colors">{doc.name}</h4>
                    </div>
                    <p className="text-[12.5px] text-black/55 font-semibold leading-relaxed line-clamp-2 bg-black/[0.005] p-3 rounded-xl border border-black/5">
                      {doc.content || 'Nhấp "Hỏi AI" để bắt đầu tìm hiểu và số hóa tệp tin...'}
                    </p>
                  </div>
                  <div className="pt-3.5 border-t border-black/5 flex justify-between items-center mt-4">
                    <div className="text-[11px] text-black/40 font-semibold space-y-0.5">
                      <p>{formatRelativeTime(doc.uploadedAt)}</p>
                      <p>{doc.size}</p>
                    </div>
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => handleAskAIOnDoc(doc)}
                      className="rounded-lg font-bold text-[11px] h-7 px-3"
                    >
                      <i className="bi bi-chat-dots mr-1" /> Hỏi AI
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Floating Draggable AI Assistant with glowing ring */}
        <div
          className="fixed z-50 touch-none select-none"
          style={{
            bottom: '24px',
            right: '24px',
            transform: `translate(${position.x}px, ${position.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <Tooltip title={isDragging ? "Đang kéo thả..." : "Kéo tôi đến bất kỳ góc nào!"} placement="left">
            <button
              onClick={() => {
                const moved = Math.abs(position.x - offsetStart.x) > 8 || Math.abs(position.y - offsetStart.y) > 8;
                if (!moved) onNavigate('ai');
              }}
              className={`w-[48px] h-[48px] sm:w-[54px] sm:h-[54px] bg-gradient-to-tr from-[#ff8a00] to-[#ff5c00] text-white rounded-full flex items-center justify-center border-2 border-white/20 shadow-2xl orange-glow hover:scale-105 active:scale-95 transition-all cursor-grab active:cursor-grabbing ${isDragging ? 'scale-110 shadow-2xl ring-4 ring-[#ff5c00]/30' : ''
                }`}
            >
              <i className={`bi bi-stars text-[22px] ${isDragging ? 'animate-pulse' : 'animate-bounce duration-[3s]'}`} />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Document Viewer Modal */}
      <DocumentViewer
        document={previewDoc}
        open={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        onAskAI={handleAskAIOnDoc}
        onDelete={(docId) => {
          onRemoveDocument(docId);
          message.success('Đã chuyển tài liệu vào Thùng rác.');
        }}
      />

      {/* Upload Modal (Premium Glassmorphism) */}
      <Modal
        title={null}
        open={showUploadModal}
        onCancel={() => setShowUploadModal(false)}
        footer={null}
        width={720}
        styles={{ body: { padding: 0 } }}
        destroyOnHidden
        centered
        className="!p-0 overflow-hidden"
      >
        <div className="bg-gradient-to-br from-[#ff8a00] to-[#ff5c00] px-6 py-5 flex items-center gap-4 relative overflow-hidden rounded-t-2xl shadow-inner">
          {/* Decorative Background Elements */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none mix-blend-overlay" />
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white backdrop-blur-md shadow-xl relative z-10"
          >
            <i className="bi bi-cloud-arrow-up-fill text-[24px]" />
          </motion.div>
          <div className="text-left text-white z-10">
            <h3 className="text-[18px] font-extrabold tracking-tight drop-shadow-md leading-tight">Tải tài liệu lên</h3>
            <p className="text-[10.5px] font-bold text-white/90 uppercase tracking-widest mt-0.5">Đồng bộ & phân tích bằng AI</p>
          </div>
        </div>

        <div className="p-6 bg-[#fcfcfd] rounded-b-2xl relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
            
            {/* Dragger Column */}
            <div className="md:col-span-5 h-full">
              <Dragger
                beforeUpload={(file) => {
                  form.setFieldsValue({
                    name: file.name,
                    type: detectFileType(file.name),
                    size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                  });
                  return false;
                }}
                showUploadList={false}
                className="!rounded-2xl !border-2 !border-dashed !border-[#ff5c00]/20 hover:!border-[#ff5c00] !bg-gradient-to-b !from-[#ff5c00]/[0.03] !to-transparent hover:!from-[#ff5c00]/10 transition-all duration-500 group overflow-hidden relative shadow-sm h-full flex flex-col justify-center py-6"
                style={{ height: '100%' }}
              >
                <div className="relative z-10 flex flex-col items-center justify-center px-2">
                  <div className="w-14 h-14 bg-white shadow-md shadow-[#ff5c00]/10 rounded-full flex items-center justify-center mb-3 group-hover:-translate-y-1 transition-transform duration-500 border border-black/5">
                    <i className="bi bi-cloud-upload text-[#ff5c00] text-[26px] group-hover:scale-110 group-hover:text-[#ff8a00] transition-all duration-500" />
                  </div>
                  <h4 className="text-[14px] font-extrabold text-black mb-1 leading-tight px-1">Kéo thả tài liệu học tập</h4>
                  <p className="text-[11.5px] text-black/50 font-bold mb-4 leading-tight">
                    hoặc <span className="text-[#ff5c00] underline decoration-[#ff5c00]/30 underline-offset-4 hover:decoration-[#ff5c00] transition-colors">chọn từ máy tính</span>
                  </p>
                  
                  <div className="flex gap-1.5 flex-wrap justify-center px-2">
                    {['PDF', 'DOCX', 'XLSX'].map(ext => (
                      <span key={ext} className="text-[9px] font-extrabold text-black/50 bg-white border border-black/5 shadow-sm rounded-md px-1.5 py-0.5 tracking-wide">{ext}</span>
                    ))}
                  </div>
                </div>
              </Dragger>
            </div>

            {/* Form Column */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <Form form={form} layout="vertical" onFinish={handleUploadSubmit} initialValues={{ type: 'pdf', size: '1.5 MB' }} className="h-full flex flex-col">
                <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm space-y-1 flex-1">
                  <Form.Item
                    label={<span className="text-[10.5px] font-bold text-black/50 uppercase tracking-widest flex items-center gap-1.5"><i className="bi bi-file-earmark-text text-[#ff5c00]" /> Tên tài liệu</span>}
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng điền tên tệp!' }]}
                    className="mb-3.5"
                  >
                    <input
                      type="text"
                      placeholder="Ví dụ: Giao_Trinh.pdf"
                      className="w-full bg-black/[0.02] border-2 border-transparent hover:border-black/5 rounded-xl px-4 py-2 text-black text-[12.5px] font-semibold outline-none focus:border-[#ff5c00] focus:bg-white focus:ring-4 focus:ring-[#ff5c00]/10 transition-all"
                    />
                  </Form.Item>

                  <div className="grid grid-cols-2 gap-4 mb-3.5">
                    <Form.Item label={<span className="text-[10.5px] font-bold text-black/50 uppercase tracking-widest flex items-center gap-1.5"><i className="bi bi-tags text-[#ff5c00]" /> Định dạng</span>} name="type" className="mb-0">
                      <Select className="font-semibold text-[12.5px] h-[34px]" classNames={{ popup: "rounded-xl font-semibold" }} options={UPLOAD_TYPE_OPTIONS} />
                    </Form.Item>

                    <Form.Item label={<span className="text-[10.5px] font-bold text-black/50 uppercase tracking-widest flex items-center gap-1.5"><i className="bi bi-hdd text-[#ff5c00]" /> Dung lượng</span>} name="size" className="mb-0">
                      <input
                        type="text"
                        readOnly
                        className="w-full bg-black/[0.02] border-2 border-transparent rounded-xl px-3 py-[5px] text-black/60 text-[12.5px] font-bold outline-none cursor-not-allowed h-[34px]"
                      />
                    </Form.Item>
                  </div>

                  <Form.Item label={<span className="text-[10.5px] font-bold text-black/50 uppercase tracking-widest flex items-center gap-1.5"><i className="bi bi-body-text text-[#ff5c00]" /> Nội dung tóm tắt</span>} name="content" className="mb-0">
                    <textarea
                      rows={2}
                      placeholder="Ghi chú nhanh để AI có thêm ngữ cảnh phân tích..."
                      className="w-full bg-black/[0.02] border-2 border-transparent hover:border-black/5 rounded-xl px-3.5 py-2 text-black text-[12.5px] font-semibold outline-none focus:border-[#ff5c00] focus:bg-white focus:ring-4 focus:ring-[#ff5c00]/10 transition-all resize-none"
                    />
                  </Form.Item>
                </div>

                <div className="flex gap-2.5 justify-end mt-4">
                  <Button 
                    onClick={() => setShowUploadModal(false)} 
                    className="rounded-xl font-bold text-[12px] h-[38px] px-5 border-black/10 hover:border-black/20 hover:bg-black/5"
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="rounded-xl font-extrabold text-[12px] h-[38px] px-6 shadow-md shadow-[#ff5c00]/30 orange-glow"
                  >
                    <i className="bi bi-cloud-arrow-up-fill mr-1" /> Xác nhận Tải lên
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
