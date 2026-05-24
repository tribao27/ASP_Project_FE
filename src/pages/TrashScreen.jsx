/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Table, Button, Tag, Tooltip, message, Popconfirm, Empty } from 'antd';
import { motion } from 'framer-motion';
import FileIcon from '../components/FileIcon.jsx';
import { getFileTagColor, getFileTypeLabel } from '../utils/helpers.js';

/**
 * Premium TrashScreen Redesign — Ultra-Premium Apple Finder & Linear table style.
 * Includes beautiful glassmorphic container, soft formatted format tags,
 * custom micro-interactive action pills, and gorgeous empty state widget.
 */
export default function TrashScreen({
  deletedDocs = [],
  onRestoreDoc,
  onPermanentlyDeleteDoc,
}) {
  const handleRestore = (doc) => {
    onRestoreDoc(doc);
    message.success(`Khôi phục tài liệu "${doc.name}" thành công!`);
  };

  const handlePermanentDelete = (docId) => {
    onPermanentlyDeleteDoc(docId);
    message.success('Tài liệu đã được xóa hoàn toàn khỏi cơ sở học trình.');
  };

  const columns = [
    {
      title: <span className="text-[10px] font-black text-black/35 uppercase tracking-widest">Tên tài liệu đã xóa</span>,
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center gap-3.5 py-1">
          <div className="p-2 rounded-xl bg-[#f4f4f7] border border-black/[0.03] shadow-sm flex items-center justify-center shrink-0">
            <FileIcon type={record.type} />
          </div>
          <span className="font-extrabold text-[#1d1d1f] text-xs hover:text-[#ff5c00] transition-all duration-200">
            {text}
          </span>
        </div>
      ),
    },
    {
      title: <span className="text-[10px] font-black text-black/35 uppercase tracking-widest">Định dạng</span>,
      dataIndex: 'type',
      key: 'type',
      width: 130,
      render: (type) => (
        <Tag color={getFileTagColor(type)} className="font-black text-[9px] uppercase rounded-full px-2.5 py-0.5 border-none shadow-sm">
          {getFileTypeLabel(type)}
        </Tag>
      ),
    },
    {
      title: <span className="text-[10px] font-black text-black/35 uppercase tracking-widest">Dung lượng</span>,
      dataIndex: 'size',
      key: 'size',
      width: 120,
      render: (size) => (
        <span className="text-xs font-extrabold text-black/55">{size}</span>
      ),
    },
    {
      title: <span className="text-[10px] font-black text-black/35 uppercase tracking-widest text-right block">Thao tác xử lý</span>,
      key: 'actions',
      width: 260,
      align: 'right',
      render: (_, record) => (
        <div className="flex items-center justify-end gap-2.5">
          <motion.button
            whileHover={{ scale: 1.02, y: -0.5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleRestore(record)}
            className="font-bold text-[11px] rounded-xl text-black hover:text-[#ff5c00] bg-white border border-black/8 hover:border-[#ff5c00]/20 hover:bg-[#ff5c00]/5 h-8 px-4 transition-all duration-200 shadow-sm cursor-pointer inline-flex items-center gap-1.5"
          >
            <i className="bi bi-arrow-counterclockwise text-[12px]" /> Khôi phục
          </motion.button>

          <Popconfirm
            title="Xóa vĩnh viễn"
            description="Lưu ý: Tệp này sẽ biến mất vĩnh viễn khỏi hệ thống."
            onConfirm={() => handlePermanentDelete(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
            okButtonProps={{ danger: true, size: 'small', className: 'rounded-lg text-[10px] font-bold h-7 cursor-pointer' }}
            cancelButtonProps={{ size: 'small', className: 'rounded-lg text-[10px] font-semibold h-7 cursor-pointer' }}
          >
            <Tooltip title="Giải phóng hoàn toàn tài liệu">
              <motion.button
                whileHover={{ scale: 1.02, y: -0.5 }}
                whileTap={{ scale: 0.98 }}
                className="font-bold text-[11px] rounded-xl text-white bg-red-500 hover:bg-red-600 h-8 px-3.5 transition-all shadow-sm shadow-red-500/10 cursor-pointer inline-flex items-center gap-1.5 border-none"
              >
                <i className="bi bi-trash-fill text-[11px]" /> Xóa vĩnh viễn
              </motion.button>
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 w-full h-full overflow-y-auto px-3 sm:px-4 md:px-8 pb-10 pt-3 sm:pt-4 text-left select-none relative bg-transparent">
      <div>
        
        {/* Title bar */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1d1d1f]">Thùng rác tài nguyên</h2>
            <p className="text-[11px] sm:text-xs text-black/40 mt-0.5 font-semibold">
              Quản trị phục hồi các tệp đã xóa tạm thời hoặc dọn sạch tài nguyên lưu trữ của bạn
            </p>
          </div>
          
          {deletedDocs.length > 0 && (
            <Popconfirm
              title="Dọn sạch thùng rác"
              description="Hành động này sẽ xóa vĩnh viễn tất cả tệp tin trong thùng rác học tập."
              onConfirm={() => {
                deletedDocs.forEach((d) => onPermanentlyDeleteDoc(d.id));
                message.success('Đã làm trống thùng rác học tập!');
              }}
              okText="Làm trống ngay"
              cancelText="Hủy"
              okButtonProps={{ danger: true, className: 'cursor-pointer rounded-lg text-[10px] h-7 font-bold' }}
              cancelButtonProps={{ className: 'cursor-pointer rounded-lg text-[10px] h-7 font-semibold' }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-xl font-bold text-xs h-9 px-4.5 text-white bg-red-500 hover:bg-red-600 shadow-md shadow-red-500/10 border-none flex items-center gap-1.5 cursor-pointer"
              >
                <i className="bi bi-trash3-fill" /> Dọn sạch thùng rác
              </motion.button>
            </Popconfirm>
          )}
        </div>

        {/* Content table view */}
        {deletedDocs.length > 0 ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-black/[0.04] p-2.5 sm:p-3.5 shadow-sm overflow-hidden flex-1 animate-scale-up">
            <Table
              columns={columns}
              dataSource={deletedDocs}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showTotal: (total) => `Tổng số ${total} tài liệu chờ giải phóng`,
                className: 'px-4 font-semibold text-black/40 text-xs',
              }}
              className="rounded-2xl custom-premium-table"
              size="middle"
            />
          </div>
        ) : (
          <div className="flex-1 bg-white rounded-2xl sm:rounded-[2.5rem] border border-black/[0.04] p-8 sm:p-16 shadow-sm flex flex-col items-center justify-center text-center animate-scale-up">
            <Empty
              image={
                <div className="w-20 h-20 rounded-3xl bg-[#ffedd5]/40 flex items-center justify-center text-[#ff8a00] border border-[#ff8a00]/10 mx-auto shadow-inner relative">
                  <div className="absolute inset-0 rounded-3xl bg-[#ff8a00]/5 animate-ping duration-1000 opacity-60" />
                  <i className="bi bi-folder-symlink-fill text-[36px]" />
                </div>
              }
              description={
                <div className="space-y-2 mt-5">
                  <p className="text-[14px] font-black text-[#1d1d1f]">Thùng rác học tập trống!</p>
                  <p className="text-[11.5px] text-black/40 font-semibold max-w-sm mx-auto leading-relaxed">
                    Khi bạn xóa tệp ở Trang chủ, chúng sẽ được tạm thời chuyển lưu trữ tại đây để bạn khôi phục hoặc xóa hẳn bất kỳ lúc nào.
                  </p>
                </div>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
