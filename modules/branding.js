// modules/branding.js
// ⚠️ Este archivo usa axios, que no es compatible con ES Modules en el navegador sin bundle.
// Reemplazado por brandingPanel.js que usa fetch nativo.
// Mantener este archivo solo por compatibilidad si se usa con un bundler.

import { API_BASE } from './config.js';

export async function cargarBranding(empresaId) {
  const res = await fetch(`${API_BASE}/api/branding?empresaId=${empresaId}`);
  if (!res.ok) throw new Error(`Error al cargar branding: ${res.status}`);
  return await res.json();
}

export async function guardarBranding(empresaId, branding) {
  const res = await fetch(`${API_BASE}/api/branding?empresaId=${empresaId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(branding)
  });
  if (!res.ok) throw new Error(`Error al guardar branding: ${res.status}`);
  return await res.json();
}
