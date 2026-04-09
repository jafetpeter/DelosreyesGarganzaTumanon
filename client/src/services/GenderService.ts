import AxiosInstance from "./AxiosInstance"

const GenderService = {
    storeGender: async (data :any) => {
        try {
            const response = await AxiosInstance.post('/gender/storedGender', data);
            return response;
        } catch(error) {
          throw error;  

        }
    },
};

export default GenderService;