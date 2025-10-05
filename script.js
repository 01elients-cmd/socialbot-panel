import { cargarEmpresas, crearEmpresa } from './modules/empresas.js';
import { generarRespuesta } from './modules/responder.js';
import { cargarInteracciones } from './modules/interacciones.js';
import { cargarPublicaciones, crearPublicacion } from './modules/publicaciones.js';

const empresaSelect = document.getElementById('empresaSelect');
const formEmpresa = document.getElementById('formEmpresa');
const formPublicacion = document.getElementById('formPublicacion');
const btnGenerar = document.getElementById('btnGenerar');

// Inicializar
async function init() {
  await cargarEmpresas();
  await cargarEmpresasEnSelect();
  await actualizarInteracciones();
  await actualizarPublicaciones();
}

formEmpresa.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = e.target.nombre.value;
  await crearEmpresa(nombre);
  e.target.reset();
  await init();
});

btnGenerar.addEventListener('click', async () => {
  const empresaId = empresaSelect.value;
  if (!empresaId || empresaId === 'undefined') {
    console.error("❌ empresaId inválido:", empresaId);
    return;
  }

  const loader = document.getElementById('loader');
  loader.style.display = 'block';

  const mensaje = document.getElementById('mensajeUsuario').value;
  const respuesta = await generarRespuesta(empresaId, mensaje);

  document.getElementById('respuestaBot').textContent = respuesta;
  loader.style.display = 'none';

  await actualizarInteracciones();
});

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
    plataforma: e.target.plataforma.value,
    contenido: e.target.contenido.value
  };
  await crearPublicacion(data);
  e.target.reset();
  await actualizarPublicaciones();
});

async function cargarEmpresasEnSelect() {
  const res = await fetch('http://localhost:5000/api/empresas');
  const empresas = await res.json();
  empresaSelect.innerHTML = '';
  empresas.forEach(e => {
    const option = document.createElement('option');
    option.value = e.id; // ✅ corregido: usa 'id' en vez de '_id'
    option.textContent = e.nombre;
    empresaSelect.appendChild(option);
  });
}

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
