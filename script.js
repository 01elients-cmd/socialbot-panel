import { API_BASE } from './modules/config.js';
import { cargarEmpresas, crearEmpresa } from './modules/empresas.js';
import { generarRespuesta } from './modules/responder.js';
import { cargarInteracciones } from './modules/interacciones.js';
import { cargarPublicaciones, crearPublicacion } from './modules/publicaciones.js';
import { cargarBranding, guardarBranding } from './modules/brandingPanel.js';

// ── Elementos del DOM ──
const empresaSelect = document.getElementById('empresaSelect');
const formEmpresa = document.getElementById('formEmpresa');
const formPublicacion = document.getElementById('formPublicacion');
const btnGenerar = document.getElementById('btnGenerar');
const btnCopiar = document.getElementById('btnCopiar');
const btnGuardarBranding = document.getElementById('btnGuardarBranding');
const mensajeInput = document.getElementById('mensajeUsuario');
const charCount = document.getElementById('charCount');
const loader = document.getElementById('loader');
const feedback = document.getElementById('mensajeFeedback');
const respuestaBot = document.getElementById('respuestaBot');
const respuestaBotContainer = document.getElementById('respuestaBotContainer');
const statusPill = document.getElementById('statusPill');
const statusText = document.getElementById('statusText');
const brandingStatus = document.getElementById('brandingStatus');

// ── Toast ──
function showToast(msg, type = 'info', duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  setTimeout(() => { toast.className = 'toast'; }, duration);
}

// ── Conteo de caracteres ──
mensajeInput.addEventListener('input', () => {
  const len = mensajeInput.value.length;
  charCount.textContent = `${len} / 1000`;
  charCount.style.color = len > 900 ? '#e63946' : '';
  if (len >= 2) feedback.style.display = 'none';
});

// ── Verificar estado del backend ──
async function verificarEstado() {
  try {
    const res = await fetch(`${API_BASE}/`, { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      statusPill.className = 'status-pill online';
      statusText.textContent = 'API conectada';
    } else {
      throw new Error('Status no OK');
    }
  } catch {
    statusPill.className = 'status-pill offline';
    statusText.textContent = 'API desconectada';
  }
}

// ── Inicializar ──
async function init() {
  verificarEstado();
  await cargarEmpresasEnSelect();
  if (empresaSelect.value && empresaSelect.value !== 'undefined') {
    await Promise.all([
      actualizarInteracciones(),
      actualizarPublicaciones(),
      cargarBrandingEnPanel()
    ]);
  }
}

// ── Crear empresa ──
formEmpresa.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = e.target.nombre.value.trim();
  if (!nombre) return;

  const btn = e.target.querySelector('button');
  btn.disabled = true;
  btn.textContent = 'Creando…';

  const result = await crearEmpresa(nombre);
  btn.disabled = false;
  btn.textContent = '+ Crear';
  e.target.reset();

  if (result) {
    showToast(`✅ Empresa "${result.nombre}" creada`, 'success');
    await init();
  } else {
    showToast('❌ Error al crear empresa', 'error');
  }
});

// ── Cambio de empresa activa ──
empresaSelect.addEventListener('change', async () => {
  await Promise.all([
    actualizarInteracciones(),
    actualizarPublicaciones(),
    cargarBrandingEnPanel()
  ]);
});

// ── Generar respuesta ──
btnGenerar.addEventListener('click', async () => {
  const empresaId = empresaSelect.value;
  const mensaje = mensajeInput?.value?.trim();

  if (!empresaId || empresaId === 'undefined') {
    showToast('⚠️ Selecciona una empresa primero', 'error');
    return;
  }
  if (!mensaje || mensaje.length < 2) {
    feedback.style.display = 'block';
    return;
  }

  feedback.style.display = 'none';
  loader.style.display = 'flex';
  btnGenerar.disabled = true;
  respuestaBotContainer.style.display = 'none';
  btnCopiar.style.display = 'none';

  try {
    const respuesta = await generarRespuesta(empresaId, mensaje);
    respuestaBot.textContent = respuesta;
    respuestaBotContainer.style.display = 'block';
    btnCopiar.style.display = 'inline-flex';
    await actualizarInteracciones();
  } catch {
    showToast('❌ Error al generar respuesta', 'error');
  } finally {
    loader.style.display = 'none';
    btnGenerar.disabled = false;
  }
});

// ── Copiar respuesta ──
btnCopiar.addEventListener('click', async () => {
  const texto = respuestaBot.textContent;
  try {
    await navigator.clipboard.writeText(texto);
    showToast('📋 Copiado al portapapeles', 'success', 2000);
  } catch {
    showToast('⚠️ No se pudo copiar', 'error');
  }
});

// ── Guardar branding ──
btnGuardarBranding.addEventListener('click', async () => {
  const empresaId = empresaSelect.value;
  if (!empresaId || empresaId === 'undefined') {
    showToast('⚠️ Selecciona una empresa', 'error');
    return;
  }

  const branding = {
    empresa_id: parseInt(empresaId),
    tono: document.getElementById('brandTono').value,
    emoji: document.getElementById('brandEmoji').value || '🤖',
    firma: document.getElementById('brandFirma').value,
    color: document.getElementById('brandColor').value
  };

  btnGuardarBranding.disabled = true;
  brandingStatus.textContent = 'Guardando…';
  brandingStatus.className = 'status-msg';

  try {
    await guardarBranding(empresaId, branding);
    brandingStatus.textContent = '✅ Branding guardado';
    brandingStatus.className = 'status-msg ok';
    showToast('✅ Branding actualizado', 'success');
  } catch {
    brandingStatus.textContent = '❌ Error al guardar';
    brandingStatus.className = 'status-msg err';
    showToast('❌ Error al guardar branding', 'error');
  } finally {
    btnGuardarBranding.disabled = false;
    setTimeout(() => { brandingStatus.textContent = ''; }, 3500);
  }
});

// ── Crear publicación ──
formPublicacion.addEventListener('submit', async (e) => {
  e.preventDefault();
  const empresaId = empresaSelect.value;
  if (!empresaId || empresaId === 'undefined') {
    showToast('⚠️ Selecciona una empresa primero', 'error');
    return;
  }

  const data = {
    empresaId,
    fecha: e.target.fecha.value,
    plataforma: e.target.plataforma.value,
    contenido: e.target.contenido.value.trim()
  };

  const btn = e.target.querySelector('button');
  btn.disabled = true;
  btn.textContent = 'Enviando…';

  const result = await crearPublicacion(data);
  btn.disabled = false;
  btn.textContent = '📤 Crear publicación';

  if (result) {
    showToast('✅ Publicación creada', 'success');
    e.target.reset();
    await actualizarPublicaciones();
  } else {
    showToast('❌ Error al crear publicación', 'error');
  }
});

// ── Cargar empresas en <select> ──
async function cargarEmpresasEnSelect() {
  try {
    const res = await fetch(`${API_BASE}/api/empresas`);
    if (!res.ok) throw new Error('Error al cargar empresas');
    const empresas = await res.json();

    // Actualizar select
    empresaSelect.innerHTML = '';
    if (empresas.length === 0) {
      empresaSelect.innerHTML = '<option value="">Sin empresas</option>';
    }
    empresas.forEach(e => {
      const option = document.createElement('option');
      option.value = e.id;
      option.textContent = e.nombre;
      empresaSelect.appendChild(option);
    });

    // Actualizar lista de la sidebar
    const lista = document.getElementById('listaEmpresas');
    lista.innerHTML = '';
    empresas.forEach(e => {
      const li = document.createElement('li');
      li.textContent = `${e.emoji || '🏢'} ${e.nombre}`;
      lista.appendChild(li);
    });

    document.getElementById('badgeEmpresas').textContent = empresas.length;

  } catch (error) {
    console.error('❌ Error al cargar empresas en select:', error);
    showToast('⚠️ No se pudo conectar con el backend', 'error', 5000);
  }
}

// ── Cargar branding en el panel ──
async function cargarBrandingEnPanel() {
  const empresaId = empresaSelect.value;
  if (!empresaId || empresaId === 'undefined') return;

  try {
    const data = await cargarBranding(empresaId);
    document.getElementById('brandTono').value = data.tono || 'neutral';
    document.getElementById('brandEmoji').value = data.emoji || '🤖';
    document.getElementById('brandFirma').value = data.firma || '';
    document.getElementById('brandColor').value = data.color || '#ff0000';
  } catch {
    // Branding no cargado — no es crítico
  }
}

// ── Actualizar interacciones ──
async function actualizarInteracciones() {
  const empresaId = empresaSelect.value;
  if (!empresaId || empresaId === 'undefined') return;

  const interacciones = await cargarInteracciones(empresaId);
  const lista = document.getElementById('listaInteracciones');
  const empty = document.getElementById('emptyInteracciones');
  lista.innerHTML = '';

  if (!Array.isArray(interacciones) || interacciones.length === 0) {
    empty.style.display = 'block';
    document.getElementById('badgeInteracciones').textContent = 0;
    return;
  }

  empty.style.display = 'none';
  document.getElementById('badgeInteracciones').textContent = interacciones.length;

  interacciones.forEach(i => {
    const li = document.createElement('li');
    const tipo = i.tipo || 'respuesta';
    const fecha = i.fecha ? new Date(i.fecha).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : '';
    li.innerHTML = `
      <div>${i.respuesta || '—'}</div>
      <div class="meta">${tipo} · ${fecha}</div>
    `;
    lista.appendChild(li);
  });
}

// ── Actualizar publicaciones ──
async function actualizarPublicaciones() {
  const empresaId = empresaSelect.value;
  if (!empresaId || empresaId === 'undefined') return;

  const publicaciones = await cargarPublicaciones(empresaId);
  const lista = document.getElementById('listaPublicaciones');
  const empty = document.getElementById('emptyPublicaciones');
  lista.innerHTML = '';

  if (!Array.isArray(publicaciones) || publicaciones.length === 0) {
    empty.style.display = 'block';
    document.getElementById('badgePublicaciones').textContent = 0;
    return;
  }

  empty.style.display = 'none';
  document.getElementById('badgePublicaciones').textContent = publicaciones.length;

  const estadoColor = { pendiente: '#ffd166', publicado: '#3ddc84', cancelado: '#e63946' };

  publicaciones.forEach(p => {
    const li = document.createElement('li');
    const fecha = p.fecha ? new Date(p.fecha).toLocaleDateString('es-ES') : '—';
    const color = estadoColor[p.estado] || '#7a8299';
    li.innerHTML = `
      <div><strong>${p.plataforma || '—'}</strong> · <span style="color:${color}; font-size:0.8em;">${p.estado || '—'}</span></div>
      <div style="margin-top:4px; font-size:0.88em;">${p.contenido}</div>
      <div class="meta">${fecha}</div>
    `;
    lista.appendChild(li);
  });
}

// ── Arrancar ──
init();
