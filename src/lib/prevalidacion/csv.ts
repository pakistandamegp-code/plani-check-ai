import { CAMPOS_CSV } from "./reglas";
import { LIMITES_ARCHIVO, mensajeErrorSeguro, sanitizarCelda } from "./seguridad";
import type { RegistroPlanilla } from "./tipos";

export const ESQUEMA_CSV = "planilla-css-v1.0";

export const ENCABEZADOS = [...CAMPOS_CSV];

const MAPA: Record<string, keyof RegistroPlanilla> = {
  tipo_documento: "tipoDocumento",
  numero_documento: "numeroDocumento",
  numero_seguro_social: "numeroSeguroSocial",
  nombre: "nombre",
  apellido: "apellido",
  dias_trabajados: "diasTrabajados",
  sueldo: "sueldo",
  horas_extras: "horasExtras",
  decimo_tercer_mes: "decimoTercerMes",
  comisiones: "comisiones",
  bonificaciones: "bonificaciones",
  viaticos: "viaticos",
  gasto_representacion: "gastoRepresentacion",
  primas_produccion: "primasProduccion",
};

export interface ResultadoParseo {
  ok: boolean;
  error?: string;
  registros: RegistroPlanilla[];
  columnasFaltantes: string[];
  columnasDesconocidas: string[];
  /** Celdas cuyo contenido fue neutralizado al sanear (fórmulas, HTML, control). */
  celdasSaneadas: number;
}

function dividirLinea(linea: string): string[] {
  const out: string[] = [];
  let actual = "";
  let entreComillas = false;
  for (let i = 0; i < linea.length; i++) {
    const ch = linea[i]!;
    if (ch === '"') {
      if (entreComillas && linea[i + 1] === '"') {
        actual += '"';
        i++;
      } else entreComillas = !entreComillas;
    } else if ((ch === "," || ch === ";") && !entreComillas) {
      out.push(actual);
      actual = "";
    } else actual += ch;
  }
  out.push(actual);
  return out;
}

export function parsearCSV(texto: string): ResultadoParseo {
  const vacio: ResultadoParseo = {
    ok: false,
    registros: [],
    columnasFaltantes: [],
    columnasDesconocidas: [],
    celdasSaneadas: 0,
  };
  const lineas = texto
    .replace(/\r\n/g, "\n")
    .split("\n")
    .filter((l) => l.trim().length > 0);

  if (lineas.length < 2) return { ...vacio, error: mensajeErrorSeguro("ARCHIVO_VACIO") };
  if (lineas.length - 1 > LIMITES_ARCHIVO.filasMaximas)
    return { ...vacio, error: mensajeErrorSeguro("ARCHIVO_FILAS") };

  const cabecera = dividirLinea(lineas[0]!).map((c) =>
    sanitizarCelda(c).toLowerCase().replace(/\s+/g, "_"),
  );
  if (cabecera.length > LIMITES_ARCHIVO.columnasMaximas)
    return { ...vacio, error: mensajeErrorSeguro("ARCHIVO_ESQUEMA") };

  const columnasFaltantes = ENCABEZADOS.filter((c) => !cabecera.includes(c));
  const columnasDesconocidas = cabecera.filter((c) => !ENCABEZADOS.includes(c as never));

  if (columnasFaltantes.length > 0) {
    return {
      ...vacio,
      error: mensajeErrorSeguro("ARCHIVO_ESQUEMA"),
      columnasFaltantes,
      columnasDesconocidas,
    };
  }

  const registros: RegistroPlanilla[] = [];
  let celdasSaneadas = 0;
  for (let i = 1; i < lineas.length; i++) {
    const celdas = dividirLinea(lineas[i]!);
    const reg: RegistroPlanilla = {
      fila: i,
      tipoDocumento: "",
      numeroDocumento: "",
      numeroSeguroSocial: "",
      nombre: "",
      apellido: "",
      diasTrabajados: "",
      sueldo: "",
      horasExtras: "",
      decimoTercerMes: "",
      comisiones: "",
      bonificaciones: "",
      viaticos: "",
      gastoRepresentacion: "",
      primasProduccion: "",
    };
    cabecera.forEach((col, idx) => {
      const clave = MAPA[col];
      if (!clave || clave === "fila") return;
      const crudo = celdas[idx] ?? "";
      const limpio = sanitizarCelda(crudo);
      if (limpio !== crudo.trim()) celdasSaneadas++;
      (reg[clave] as string) = limpio;
    });
    registros.push(reg);
  }

  return { ok: true, registros, columnasFaltantes, columnasDesconocidas, celdasSaneadas };
}

export function registrosACSV(registros: RegistroPlanilla[]): string {
  const filas = registros.map((r) =>
    ENCABEZADOS.map((h) => {
      const clave = MAPA[h]!;
      const v = String(r[clave] ?? "");
      return /[",;\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
    }).join(","),
  );
  return [ENCABEZADOS.join(","), ...filas].join("\n");
}

export const PLANTILLA_CSV = [
  ENCABEZADOS.join(","),
  "CEDULA,8-9001-2201,SS-DEMO-100001,ARIEL,MENDIETA,30,1250.00,85.00,0.00,0.00,120.00,0.00,0.00,0.00",
  "CEDULA,8-9001-2202,SS-DEMO-100002,LORENA,BATISTA,30,980.50,0.00,0.00,150.00,0.00,45.00,0.00,0.00",
  "PASAPORTE,PA9083112,SS-DEMO-100003,MARCO,ARJONA,15,700.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00",
].join("\n");

export function descargarTexto(nombre: string, contenido: string, mime = "text/csv;charset=utf-8") {
  const blob = new Blob([contenido], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function validarArchivo(file: File): string | null {
  const nombre = file.name.toLowerCase();
  const extOk = LIMITES_ARCHIVO.extensionesPermitidas.some((e) => nombre.endsWith(e));
  const mimeOk = LIMITES_ARCHIVO.tiposMimePermitidos.includes(file.type);
  if (!extOk || !mimeOk) return mensajeErrorSeguro("ARCHIVO_TIPO");
  if (file.size > LIMITES_ARCHIVO.tamanoMaximoBytes) return mensajeErrorSeguro("ARCHIVO_TAMANO");
  if (file.size === 0) return mensajeErrorSeguro("ARCHIVO_VACIO");
  return null;
}
