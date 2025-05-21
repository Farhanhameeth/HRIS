import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5077',  // Replace with your API base URL
  headers: {
    'PPA_KEY': 'SvnqwrRcCGE_RSMS_KEY5xWUYcI3aLAi4=PPa', // Replace with your actual PPA_KEY
    'Content-Type': 'application/json',
    'Accept': '*/*', 
  },
});

axiosInstance.interceptors.request.use(function (config) {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
