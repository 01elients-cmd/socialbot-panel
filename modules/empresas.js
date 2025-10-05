export async function cargarEmpresas() {
  const res = await fetch('http://localhost:5000/api/empresas');
  const empresas = await res.json();
  const lista = document.getElementById('listaEmpresas');
  lista.innerHTML = '';
  empresas.forEach(e => {
    const li = document.createElement('li');
    li.textContent = e.nombre;
    lista.appendChild(li);
  });
}

export async function crearEmpresa(nombre) {
  await fetch('http://localhost:5000/api/empresas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre })
  });
}
