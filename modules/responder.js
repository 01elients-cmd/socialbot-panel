export async function responder(data) {
  console.log("Body que se envía:", data);

  const res = await fetch("http://localhost:5000/api/respuesta", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  return result.respuesta;
}

export async function generarRespuesta(empresaId, mensajeUsuario) {
  const id = parseInt(empresaId);

  if (!id || isNaN(id)) {
    console.error("❌ empresaId inválido:", empresaId);
    return "Error: empresaId inválido";
  }

  const data = { empresaId: id, mensajeUsuario };
  return await responder(data);
}


