import axios from 'axios';

const API_URL = 'http://localhost:3001/projects'; 

export const getProjects = async (filters = {}) => {
  const token = localStorage.getItem('token');

  const queryParams = new URLSearchParams(filters as Record<string, string>).toString();
  const url = `http://localhost:3001/projects${queryParams ? '?' + queryParams : ''}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
