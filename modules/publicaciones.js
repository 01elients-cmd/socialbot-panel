import { API_BASE } from './config.js';

export async function cargarPublicaciones(empresaId) {
  try {
    const res = await fetch(`${API_BASE}/api/publicaciones/${empresaId}`);
    if (!res.ok) throw new Error('Error al cargar publicaciones');
    return await res.json();
  } catch (error) {
    console.error('Error al obtener publicaciones:', error);
    return [];
  }
}

export async function crearPublicacion(data) {
  try {
    const res = await fetch(`${API_BASE}/api/publicaciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error('Error al crear publicación');
    return await res.json();
  } catch (error) {
    console.error('Error al crear publicación:', error);
    return null;
  }
}
