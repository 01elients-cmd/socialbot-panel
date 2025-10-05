export async function cargarPublicaciones(empresaId) {
  const res = await fetch(`http://localhost:5000/api/publicaciones/${empresaId}`);
  const publicaciones = await res.json();
  return publicaciones;
}

export async function crearPublicacion(data) {
  await fetch('http://localhost:5000/api/publicaciones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}
