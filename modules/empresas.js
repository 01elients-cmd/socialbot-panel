import { API_BASE } from './config.js';

export async function cargarEmpresas() {
  try {
    const res = await fetch(`${API_BASE}/api/empresas`);
    if (!res.ok) throw new Error('Error al cargar empresas');
    const empresas = await res.json();

    const lista = document.getElementById('listaEmpresas');
    lista.innerHTML = '';
    empresas.forEach(e => {
      const li = document.createElement('li');
      li.textContent = e.nombre;
      lista.appendChild(li);
    });
  } catch (error) {
    console.error('Error al obtener empresas:', error);
  }
}

export async function crearEmpresa(nombre, tono = 'neutral', emoji = '🤖', firma = '', color = '#333') {
  try {
    const res = await fetch(`${API_BASE}/api/empresas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, tono, emoji, firma, color })
    });

    if (!res.ok) throw new Error('Error al crear empresa');
    return await res.json();
  } catch (error) {
    console.error('Error al crear empresa:', error);
    return null;
  }
}
