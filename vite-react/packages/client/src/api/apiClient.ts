/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: Do not edit
 * @Date: 2025-06-18 20:11:13
 * @LastEditTime: 2025-06-18 20:34:28
 */
import axios from 'axios';

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 你可以在这里添加拦截器 (interceptors) 来统一处理
// 例如：请求拦截器，用于添加认证 token
apiClient.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器，用于统一处理错误
apiClient.interceptors.response.use(
  (response) => {
    return response; // 返回完整的 response 对象
  },
  (error) => {
    // 在这里可以处理各种错误，例如 401 未授权，404 未找到等
    // 也可以弹出一个全局的错误提示
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error);
  }
);


export default apiClient; 