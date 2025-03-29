import axios from 'axios';

// Konfigurasi API URL
const API_URL = '/api'; // Ubah sesuai dengan setup backend Anda

// Service untuk mengirim pesan ke backend
export const sendMessage = async (message) => {
  try {
    const response = await axios.post(`${API_URL}/chat`, { message });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Gagal mengirim pesan');
  }
};

// Service untuk mengambil riwayat chat
export const getChatHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/chat/history`);
    return response.data.history;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Gagal mengambil riwayat chat');
  }
};