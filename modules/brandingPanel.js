import { API_BASE } from './config.js';

export async function cargarBranding(empresaId) {
  const res = await fetch(`${API_BASE}/api/branding?empresaId=${empresaId}`);
  if (!res.ok) throw new Error("Error al cargar branding");
  return await res.json();
}

export async function guardarBranding(empresaId, branding) {
  const res = await fetch(`${API_BASE}/api/branding?empresaId=${empresaId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(branding)
  });
  if (!res.ok) throw new Error("Error al guardar branding");
}
