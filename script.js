import { API_BASE } from './modules/config.js';
import { cargarEmpresas, crearEmpresa } from './modules/empresas.js';
import { generarRespuesta } from './modules/responder.js';
import { cargarInteracciones } from './modules/interacciones.js';
import { cargarPublicaciones, crearPublicacion } from './modules/publicaciones.js';
import { cargarBranding, guardarBranding } from './modules/brandingPanel.js';

const empresaSelect = document.getElementById('empresaSelect');
const formEmpresa = document.getElementById('formEmpresa');
const formPublicacion = document.getElementById('formPublicacion');
const btnGenerar = document.getElementById('btnGenerar');

// 🔹 Inicializar
async function init() {
  await cargarEmpresasEnSelect();
  await actualizarInteracciones();
  await actualizarPublicaciones();
}

// 🔹 Crear empresa
formEmpresa.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = e.target.nombre.value.trim();
  if (!nombre) return;
  await crearEmpresa(nombre);
  e.target.reset();
  await init();
});

// 🔹 Generar respuesta
btnGenerar.addEventListener('click', async () => {
  const empresaId = empresaSelect.value;
  if (!empresaId || empresaId === 'undefined') {
    console.error("❌ empresaId inválido:", empresaId);
    return;
  }

  const mensajeInput = document.getElementById('mensajeUsuario');
  const mensaje = mensajeInput.value.trim();
  const feedback = document.getElementById('mensajeFeedback');
  const loader = document.getElementById('loader');

  if (!mensaje || mensaje.length < 2) {
    feedback.style.display = 'block';
    loader.style.display = 'none';
    return;
  } else {
    feedback.style.display = 'none';
  }

  loader.style.display = 'block';

  const respuesta = await generarRespuesta(empresaId, mensaje);
  document.getElementById('respuestaBot').textContent = respuesta;
  loader.style.display = 'none';

  await actualizarInteracciones();
});


// 🔹 Crear publicación
formPublicacion.addEventListener('submit', async (e) => {
  e.preventDefault();
  const empresaId = empresaSelect.value;
  if (!empresaId || empresaId === 'undefined') {
    console.error("❌ empresaId inválido:", empresaId);
    return;
  }

  const data = {
    empresaId,
    fecha: e.target.fecha.value,
    plataforma: e.target.plataforma.value.trim(),
    contenido: e.target.contenido.value.trim()
  };
  await crearPublicacion(data);
  e.target.reset();
  await actualizarPublicaciones();
});

// 🔹 Cargar empresas en <select>
async function cargarEmpresasEnSelect() {
  try {
    const res = await fetch(`${API_BASE}/api/empresas`);
    if (!res.ok) throw new Error('Error al cargar empresas');
    const empresas = await res.json();

    empresaSelect.innerHTML = '';
    empresas.forEach(e => {
      const option = document.createElement('option');
      option.value = e.id;
      option.textContent = e.nombre;
      empresaSelect.appendChild(option);
    });
  } catch (error) {
    console.error('❌ Error al cargar empresas en select:', error);
  }
}

// 🔹 Actualizar interacciones
async function actualizarInteracciones() {
  const empresaId = empresaSelect.value;
  if (!empresaId || empresaId === 'undefined') {
    console.error("❌ empresaId inválido:", empresaId);
    return;
  }

  const interacciones = await cargarInteracciones(empresaId);
  const lista = document.getElementById('listaInteracciones');
  lista.innerHTML = '';

  if (!Array.isArray(interacciones)) {
    console.error("❌ Interacciones no válidas:", interacciones);
    return;
  }

  interacciones.forEach(i => {
    const li = document.createElement('li');
    li.textContent = `${i.usuario}: ${i.mensajeUsuario} → ${i.respuestaBot} (${i.reaccion})`;
    lista.appendChild(li);
  });
}

// 🔹 Actualizar publicaciones
async function actualizarPublicaciones() {
  const empresaId = empresaSelect.value;
  if (!empresaId || empresaId === 'undefined') {
    console.error("❌ empresaId inválido:", empresaId);
    return;
  }

  const publicaciones = await cargarPublicaciones(empresaId);
  const lista = document.getElementById('listaPublicaciones');
  lista.innerHTML = '';

  if (!Array.isArray(publicaciones)) {
    console.error("❌ Publicaciones no válidas:", publicaciones);
    return;
  }

  publicaciones.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `${p.fecha} - ${p.plataforma}: ${p.contenido} [${p.estado}]`;
    lista.appendChild(li);
  });
}

init();
