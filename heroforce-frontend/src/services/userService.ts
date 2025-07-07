import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/users`;

export const getHeroes = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
