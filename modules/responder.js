import { API_BASE } from './config.js';

export async function responder(data) {
  console.log("📤 Body que se envía:", data);

  try {
    const res = await fetch(`${API_BASE}/api/respuesta`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Error al generar respuesta');
    const result = await res.json();
    return result.respuesta;
  } catch (error) {
    console.error("❌ Error al generar respuesta:", error);
    return "Lo siento, no pude generar una respuesta en este momento. 😕";
  }
}

export async function generarRespuesta(empresaId, mensajeUsuario) {
  const id = parseInt(empresaId);

  if (!id || isNaN(id)) {
    console.error("❌ empresaId inválido:", empresaId);
    return "Error: empresaId inválido";
  }

  if (!mensajeUsuario || typeof mensajeUsuario !== 'string' || mensajeUsuario.trim().length < 2) {
    console.error("❌ mensajeUsuario inválido:", mensajeUsuario);
    return "Error: mensajeUsuario inválido";
  }

  const data = {
    empresaId: id,
    mensajeUsuario: mensajeUsuario.trim()
  };

  return await responder(data);
}
