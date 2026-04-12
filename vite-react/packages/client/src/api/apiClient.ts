/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: Do not edit
 * @Date: 2025-06-18 20:11:13
 * @LastEditTime: 2025-06-18 20:34:28
 */
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 你可以在这里添加拦截器 (interceptors) 来统一处理
// 例如：请求拦截器，用于添加认证 token
apiClient.interceptors.request.use(
  (config) => {
    // 从 localStorage 中读取管理员密码
    const adminPwd = localStorage.getItem('admin_pwd');
    if (adminPwd) {
      config.headers['x-admin-pwd'] = adminPwd;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 简单的全局消息提示函数
const showMessage = (msg: string, type: 'error' | 'warning' | 'info' = 'error') => {
  const div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.top = '20px';
  div.style.left = '50%';
  div.style.transform = 'translateX(-50%)';
  div.style.padding = '10px 20px';
  div.style.borderRadius = '4px';
  div.style.color = '#fff';
  div.style.backgroundColor = type === 'error' ? '#ff4d4f' : type === 'warning' ? '#faad14' : '#1890ff';
  div.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  div.style.zIndex = '9999';
  div.style.transition = 'opacity 0.3s';
  div.innerText = msg;
  
  document.body.appendChild(div);
  
  setTimeout(() => {
    div.style.opacity = '0';
    setTimeout(() => document.body.removeChild(div), 300);
  }, 3000);
};

// 响应拦截器，用于统一处理错误
apiClient.interceptors.response.use(
  (response) => {
    return response; // 返回完整的 response 对象
  },
  (error) => {
    let errorMsg = '网络请求异常，请稍后重试';
    
    if (error.response) {
      const status = error.response.status;
      const dataMsg = error.response.data?.message || error.response.data?.error;
      
      switch (status) {
        case 401:
          errorMsg = '未授权或身份已过期，请重新登录';
          break;
        case 403:
          errorMsg = '拒绝访问：您没有权限执行此操作';
          break;
        case 404:
          errorMsg = `请求的资源不存在 (${error.config.url})`;
          break;
        case 500:
          errorMsg = '服务器内部错误，请联系管理员';
          break;
        default:
          errorMsg = dataMsg || `请求错误 (${status})`;
      }
    } else if (error.request) {
      errorMsg = '服务器无响应，请检查网络连接';
    }

    showMessage(errorMsg, 'error');
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error);
  }
);


export default apiClient; 