export type Severidad = "VALIDO" | "ALERTA" | "ERROR" | "FALLA_TECNICA";

export type EstadoPlanilla =
  | "RECIBIDA"
  | "EN_VALIDACION"
  | "CON_ERRORES"
  | "EN_REVISION"
  | "PREVALIDADA";

export type NivelValidacion = "A" | "B" | "C" | "D" | "E" | "F";

export interface Regla {
  codigo: string;
  version: string;
  nivel: NivelValidacion;
  nombre: string;
  campos: string[];
  condicion: string;
  fuente: string;
  fundamento: string;
  resultado: Exclude<Severidad, "FALLA_TECNICA">;
  accion: string;
  vigenciaDesde: string;
  estadoRegla: "Activa" | "Limitada" | "Pendiente de validación institucional";
}

export interface RegistroPlanilla {
  fila: number;
  tipoDocumento: string;
  numeroDocumento: string;
  numeroSeguroSocial: string;
  nombre: string;
  apellido: string;
  diasTrabajados: string;
  sueldo: string;
  horasExtras: string;
  decimoTercerMes: string;
  comisiones: string;
  bonificaciones: string;
  viaticos: string;
  gastoRepresentacion: string;
  primasProduccion: string;
}

export interface Hallazgo {
  id: string;
  fila: number;
  campo: string;
  codigoRegla: string;
  versionRegla: string;
  nivel: NivelValidacion;
  severidad: Exclude<Severidad, "FALLA_TECNICA">;
  descripcion: string;
  accionSugerida: string;
  fundamento: string;
  justificacion?: string;
}

export interface EventoAuditoria {
  id: string;
  fecha: string;
  actor: string;
  accion: string;
  detalle: string;
}

export interface Planilla {
  id: string;
  solicitudId: string;
  empleadorId: string;
  empleadorNombre: string;
  periodo: string;
  version: number;
  planillaOrigenId: string | null;
  esquema: string;
  huella: string;
  archivoNombre: string;
  recibidaEn: string;
  usuarioOrigen: string;
  estado: EstadoPlanilla;
  registros: RegistroPlanilla[];
  hallazgos: Hallazgo[];
  auditoria: EventoAuditoria[];
}

export interface Empleador {
  id: string;
  ruc: string;
  nombre: string;
  actividad: string;
  trabajadores: number;
}
