import AxiosInstance from "./AxiosInstance";

const UserService = {
  loadusers: async (page: number) => {
    try {
      const response = await AxiosInstance.get(`/user/loadUsers?page=${page}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  storeUser: async (data: any) => {
    try {
      const response = await AxiosInstance.post("/user/storeUser", data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  updateUser: async (userId: string | number, data: any) => {
    try {
      const response = await AxiosInstance.put(
        `/user/updateUser/${userId}`,
        data,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  destroyUser: async (userId: string | number) => {
    try {
      const response = await AxiosInstance.put(`/user/destroyUser/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default UserService;
