import axiosClient from './axiosClient';
import { initialDocuments } from '../data/documents';

// Simulating network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const documentService = {
  /**
   * Mock API: Lấy danh sách tài liệu
   * Khi backend sẵn sàng, đổi thành: return axiosClient.get('/documents');
   */
  getAllDocuments: async () => {
    await delay(300); // Giả lập độ trễ mạng 300ms
    return [...initialDocuments]; 
  },

  /**
   * Mock API: Thêm tài liệu mới
   */
  addDocument: async (newDoc) => {
    await delay(300);
    // Khi backend có sẵn: return axiosClient.post('/documents', newDoc);
    return { ...newDoc, id: 'doc_' + Date.now() }; 
  },

  /**
   * Mock API: Xóa tài liệu
   */
  deleteDocument: async (id) => {
    await delay(300);
    // Khi backend có sẵn: return axiosClient.delete(`/documents/${id}`);
    return { success: true, id };
  }
};

export default documentService;
