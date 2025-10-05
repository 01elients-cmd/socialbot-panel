export async function cargarInteracciones(empresaId) {
  const res = await fetch(`http://localhost:5000/api/interacciones/${empresaId}`);
  const interacciones = await res.json();
  return interacciones;
}
