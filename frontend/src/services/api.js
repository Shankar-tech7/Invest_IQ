import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/ai`;

export const api = {
  analyzeAutopsy: async (content) => {
    const res = await axios.post(`${API_URL}/autopsy`, { content });
    return res.data.result;
  },

  estimateTOD: async (data) => {
    const res = await axios.post(`${API_URL}/tod`, data);
    return res.data.result;
  },

  correlateDigital: async (parts) => {
    const res = await axios.post(`${API_URL}/digital`, { parts });
    return res.data.result;
  },

  scoreRisk: async (prompt) => {
    const res = await axios.post(`${API_URL}/risk`, { prompt });
    return res.data;
  },

  generateSummary: async (prompt) => {
    const res = await axios.post(`${API_URL}/summary`, { prompt });
    return res.data.result;
  }
};