/**
 * Controles prácticos de seguridad aplicados a la demo.
 * Todo ocurre en el navegador con datos sintéticos: no hay datos personales reales.
 */

export const LIMITES_ARCHIVO = {
  tamanoMaximoBytes: 2 * 1024 * 1024,
  extensionesPermitidas: [".csv"],
  tiposMimePermitidos: ["text/csv", "application/vnd.ms-excel", "text/plain", ""],
  filasMaximas: 5000,
  columnasMaximas: 40,
  longitudMaximaCelda: 120,
};

/** Identificador no predecible (128 bits) para solicitudes y objetos de la demo. */
export function idNoPredecible(prefijo: string): string {
  const bytes = new Uint8Array(16);
  if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = (Date.now() + i * 31) % 256;
  }
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${prefijo}-${hex}`;
}

/** Huella de integridad simple (no criptográfica) para evidenciar cambios de contenido. */
export function huellaContenido(texto: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < texto.length; i++) {
    const c = texto.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 16777619) >>> 0;
    h2 = Math.imul(h2 + c + i, 2246822519) >>> 0;
  }
  return `fp_${h1.toString(16).padStart(8, "0")}${h2.toString(16).padStart(8, "0")}`;
}

/** Neutraliza contenido peligroso de una celda CSV (inyección de fórmulas, control chars, HTML). */
export function sanitizarCelda(valor: string): string {
  let v = (valor ?? "").toString();
  v = v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
  v = v.replace(/^[\s]*[=+\-@\t\r]+/, (m) => m.replace(/[=+@]/g, ""));
  v = v.replace(/[<>]/g, "");
  v = v.trim();
  if (v.length > LIMITES_ARCHIVO.longitudMaximaCelda) {
    v = v.slice(0, LIMITES_ARCHIVO.longitudMaximaCelda);
  }
  return v;
}

export function sanitizarTextoLibre(valor: string, max = 400): string {
  return (valor ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, max);
}

/** Enmascara un identificador dejando visibles solo los últimos caracteres. */
export function enmascararDocumento(valor: string): string {
  const v = (valor ?? "").trim();
  if (v.length <= 4) return "•".repeat(Math.max(v.length, 3));
  return `${"•".repeat(Math.max(v.length - 4, 3))}${v.slice(-4)}`;
}

/** Muestra iniciales en lugar del nombre completo en listados. */
export function enmascararNombre(nombre: string, apellido: string): string {
  const n = (nombre ?? "").trim();
  const a = (apellido ?? "").trim();
  const ini = `${n.charAt(0) || "?"}. ${a.charAt(0) || "?"}.`;
  return ini.toUpperCase();
}

/** Mensaje de error seguro: sin rutas, sin detalles internos, sin datos de terceros. */
export function mensajeErrorSeguro(codigo: string, contexto?: string): string {
  const base: Record<string, string> = {
    ARCHIVO_TIPO: "El archivo no tiene un formato admitido. Use la plantilla CSV de la demo.",
    ARCHIVO_TAMANO: "El archivo supera el tamaño permitido para esta demostración.",
    ARCHIVO_VACIO: "El archivo no contiene registros procesables.",
    ARCHIVO_ESQUEMA: "El archivo no coincide con la versión del esquema esperada.",
    ARCHIVO_FILAS: "El archivo supera la cantidad de filas admitida en la demostración.",
    ACCESO_DENEGADO: "No tiene permiso para consultar información de otro empleador.",
    ROL_INSUFICIENTE: "Su rol de demostración no permite ejecutar esta acción.",
    IDEMPOTENCIA: "Esta solicitud ya fue recibida; no se duplicó el procesamiento.",
    GENERICO: "No fue posible completar la operación. Intente nuevamente.",
  };
  const texto = base[codigo] ?? base["GENERICO"]!;
  return contexto ? `${texto} (${sanitizarTextoLibre(contexto, 80)})` : texto;
}

export const AVISO_DATOS =
  "Demostración con datos sintéticos. No se utilizan, almacenan ni procesan datos personales reales. Documentos y empresas son ficticios y no válidos para trámites.";

export const AVISO_PREVALIDADA =
  "PREVALIDADA es un resultado interno de esta plataforma. No equivale a una aprobación, certificación ni validación institucional de la Caja de Seguro Social.";

export const AVISO_MVP =
  "MVP académico y demostrativo. No constituye asesoría legal, no está certificado, no tiene conexión con sistemas institucionales y no calcula cuotas oficiales. Requiere validación jurídica y técnica antes de cualquier uso en producción.";
