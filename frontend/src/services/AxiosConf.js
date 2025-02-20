
import axios from 'axios';

const baseUrl = axios.create({
  baseURL: 'http://34.78.213.218',
 //  baseURL: 'http://localhost:5000',
});

const authAxiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer YOUR_TOKEN`, 
  },
});


export { baseUrl, authAxiosInstance };
