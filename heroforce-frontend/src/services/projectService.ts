import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/projects`;

export const getProjects = async (filters = {}) => {
  const token = localStorage.getItem("token");
  const queryParams = new URLSearchParams(
    filters as Record<string, string>
  ).toString();
  const url = `${API_URL}${queryParams ? "?" + queryParams : ""}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const saveProject = async (projectData: any, projectId?: string) => {
  const token = localStorage.getItem("token");
  const url = projectId ? `${API_URL}/${projectId}` : API_URL;
  const method = projectId ? "put" : "post";

  const response = await axios[method](url, projectData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getProjectById = async (id: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteProject = async (id: string) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return res.data;
};