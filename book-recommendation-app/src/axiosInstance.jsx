import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001', 
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('An error occurred:', error.response ? error.response.data : error.message);
    alert('An error occurred. Please try again later.');
    return Promise.reject(error);
  }
);

export default axiosInstance;
