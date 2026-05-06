import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Django backend
  withCredentials: true, // For session auth if needed
});

export const tmdbImage = (path: string, size: string = 'w500') => {
  if (path?.startsWith('http')) return path;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export default api;
