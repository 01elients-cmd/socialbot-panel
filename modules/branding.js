import { API_BASE } from './config.js';
import axios from 'axios';

export async function cargarBranding() {
  const empresaId = localStorage.getItem("empresaId");
  const res = await axios.get(`/api/branding?empresaId=${empresaId}`);
  return res.data;
}

export async function guardarBranding(branding) {
  const empresaId = localStorage.getItem("empresaId");
  await axios.put(`/api/branding?empresaId=${empresaId}`, branding);
}
