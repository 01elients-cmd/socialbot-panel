import { API_BASE } from './config.js';

export async function cargarInteracciones(empresaId) {
  try {
    const res = await fetch(`${API_BASE}/api/interacciones/${empresaId}`);
    if (!res.ok) throw new Error('Error al cargar interacciones');
    return await res.json();
  } catch (error) {
    console.error('Error al obtener interacciones:', error);
    return [];
  }
}
