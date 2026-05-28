import axiosClient from '@/api/axiosClient.js';
import { initialGroups } from '@/features/community/mock/groups.mock.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const groupService = {
  /**
   * Mock API: Lấy danh sách nhóm cộng đồng
   * Khi backend sẵn sàng: return axiosClient.get('/groups');
   */
  getAllGroups: async () => {
    await delay(300);
    return [...initialGroups];
  },

  /**
   * Mock API: Tạo nhóm mới
   */
  createGroup: async (groupData) => {
    await delay(300);
    // return axiosClient.post('/groups', groupData);
    return { ...groupData, id: 'grp_' + Date.now() };
  }
};

export default groupService;
