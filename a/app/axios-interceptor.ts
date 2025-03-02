import axios from "axios";

const axiosConfig: { jwt?: string } = {};

axios.interceptors.request.use((request) => {
    if (axiosConfig.jwt) {
        request.headers['Authorization'] = `Bearer ${axiosConfig.jwt}`;
    }
    return request;
});

export default axiosConfig;
