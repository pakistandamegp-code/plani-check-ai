import type { Empleador, RegistroPlanilla } from "./tipos";

export const EMPLEADORES_DEMO: Empleador[] = [
  {
    id: "EMP-DEMO-001",
    ruc: "RUC-DEMO-155900001-2-2026",
    nombre: "Distribuidora Istmeña Demo, S.A.",
    actividad: "Comercio al por mayor (ficticio)",
    trabajadores: 6,
  },
  {
    id: "EMP-DEMO-002",
    ruc: "RUC-DEMO-155900002-2-2026",
    nombre: "Constructora Bahía Sintética, S.A.",
    actividad: "Construcción (ficticio)",
    trabajadores: 5,
  },
  {
    id: "EMP-DEMO-003",
    ruc: "RUC-DEMO-155900003-2-2026",
    nombre: "Servicios Logísticos Chagres Demo, S.R.L.",
    actividad: "Transporte y logística (ficticio)",
    trabajadores: 4,
  },
];

export interface UsuarioDemo {
  id: string;
  nombre: string;
  rol: "Elaborador" | "Representante legal" | "Personal autorizado CSS" | "Seguridad y auditoría";
  empleadorId: string | null;
  permisos: {
    cargar: boolean;
    corregir: boolean;
    justificar: boolean;
    verTodos: boolean;
    verAuditoria: boolean;
  };
}

export const USUARIOS_DEMO: UsuarioDemo[] = [
  {
    id: "USR-DEMO-01",
    nombre: "Elaborador — Distribuidora Istmeña Demo",
    rol: "Elaborador",
    empleadorId: "EMP-DEMO-001",
    permisos: { cargar: true, corregir: true, justificar: false, verTodos: false, verAuditoria: false },
  },
  {
    id: "USR-DEMO-02",
    nombre: "Representante legal — Distribuidora Istmeña Demo",
    rol: "Representante legal",
    empleadorId: "EMP-DEMO-001",
    permisos: { cargar: true, corregir: true, justificar: true, verTodos: false, verAuditoria: true },
  },
  {
    id: "USR-DEMO-03",
    nombre: "Elaborador — Constructora Bahía Sintética",
    rol: "Elaborador",
    empleadorId: "EMP-DEMO-002",
    permisos: { cargar: true, corregir: true, justificar: false, verTodos: false, verAuditoria: false },
  },
  {
    id: "USR-DEMO-04",
    nombre: "Personal autorizado (perfil demo)",
    rol: "Personal autorizado CSS",
    empleadorId: null,
    permisos: { cargar: false, corregir: false, justificar: false, verTodos: true, verAuditoria: true },
  },
  {
    id: "USR-DEMO-05",
    nombre: "Seguridad y auditoría (perfil demo)",
    rol: "Seguridad y auditoría",
    empleadorId: null,
    permisos: { cargar: false, corregir: false, justificar: false, verTodos: true, verAuditoria: true },
  },
];

function reg(
  fila: number,
  tipoDocumento: string,
  numeroDocumento: string,
  numeroSeguroSocial: string,
  nombre: string,
  apellido: string,
  diasTrabajados: string,
  sueldo: string,
  extra: Partial<RegistroPlanilla> = {},
): RegistroPlanilla {
  return {
    fila,
    tipoDocumento,
    numeroDocumento,
    numeroSeguroSocial,
    nombre,
    apellido,
    diasTrabajados,
    sueldo,
    horasExtras: "0.00",
    decimoTercerMes: "0.00",
    comisiones: "0.00",
    bonificaciones: "0.00",
    viaticos: "0.00",
    gastoRepresentacion: "0.00",
    primasProduccion: "0.00",
    ...extra,
  };
}

/** Período anterior (enero 2026) — planilla ya prevalidada, base del análisis histórico. */
export const PLANILLA_ENERO_EMP1: RegistroPlanilla[] = [
  reg(1, "CEDULA", "8-9001-2201", "SS-DEMO-100001", "ARIEL", "MENDIETA", "30", "1250.00", { horasExtras: "85.00" }),
  reg(2, "CEDULA", "8-9001-2202", "SS-DEMO-100002", "LORENA", "BATISTA", "30", "980.50", { comisiones: "150.00" }),
  reg(3, "CEDULA", "8-9001-2203", "SS-DEMO-100003", "JAVIER", "QUINTERO", "30", "1600.00", { gastoRepresentacion: "300.00" }),
  reg(4, "PASAPORTE", "PA9083112", "SS-DEMO-100004", "MARCO", "ARJONA", "30", "760.00"),
  reg(5, "CEDULA", "8-9001-2205", "SS-DEMO-100005", "YARISKA", "CEDEÑO", "30", "1100.00", { bonificaciones: "90.00" }),
  reg(6, "CEDULA", "8-9001-2206", "SS-DEMO-100006", "ELIÉCER", "SAMANIEGO", "30", "890.00"),
];

/** Febrero 2026 con inconsistencias deliberadas para demostrar cada nivel de validación. */
export const PLANILLA_FEBRERO_EMP1: RegistroPlanilla[] = [
  reg(1, "CEDULA", "8-9001-2201", "SS-DEMO-100001", "ARIEL", "MENDIETA", "30", "1250.00", { horasExtras: "1450.00" }),
  reg(2, "CEDULA", "8-9001-2202", "SS-DEMO-100002", "LORENA", "BATISTA", "30", "1780.00", { comisiones: "150.00" }),
  reg(3, "CEDULA", "8-9001-2203", "SS-DEMO-100003", "JAVIER", "QUINTERO", "30", "1600.00", {
    gastoRepresentacion: "1900.00",
    primasProduccion: "950.00",
  }),
  reg(4, "PASAPORTE", "PA-9083112*", "SS-DEMO-100004", "MARCO", "ARJONA", "30", "760.00"),
  reg(5, "CEDULA", "8-9001-2205", "", "YARISKA", "CEDEÑO", "30", "1100.00", { viaticos: "520.00" }),
  reg(6, "CEDULA", "8-9001-2205", "SS-DEMO-100005", "YARISKA", "CEDEÑO", "30", "1100.00"),
  reg(7, "CEDULA", "8-9001-2208", "SS-DEMO-100008", "", "PIMENTEL", "31", "0.00", { bonificaciones: "220.00" }),
  reg(8, "CEDULA", "8-9001-2209", "SS-DEMO-100009", "DIANA", "ESPINOSA", "30", "1.050,00"),
];

/** Febrero 2026 sin hallazgos: caso PREVALIDADA. */
export const PLANILLA_FEBRERO_EMP3: RegistroPlanilla[] = [
  reg(1, "CEDULA", "4-7712-3301", "SS-DEMO-300001", "OMAR", "VILLALAZ", "30", "1420.00", { horasExtras: "110.00" }),
  reg(2, "CEDULA", "4-7712-3302", "SS-DEMO-300002", "KEYLA", "MORÁN", "30", "1180.00", { decimoTercerMes: "0.00" }),
  reg(3, "CEDULA", "4-7712-3303", "SS-DEMO-300003", "RUBÉN", "NAVARRO", "30", "1330.00", { bonificaciones: "75.00" }),
  reg(4, "CARNE_RESIDENTE", "CR774120", "SS-DEMO-300004", "SOFÍA", "LEZCANO", "30", "1050.00"),
];

/** Enero 2026 del empleador 3, usado como histórico coherente. */
export const PLANILLA_ENERO_EMP3: RegistroPlanilla[] = [
  reg(1, "CEDULA", "4-7712-3301", "SS-DEMO-300001", "OMAR", "VILLALAZ", "30", "1420.00"),
  reg(2, "CEDULA", "4-7712-3302", "SS-DEMO-300002", "KEYLA", "MORÁN", "30", "1180.00"),
  reg(3, "CEDULA", "4-7712-3303", "SS-DEMO-300003", "RUBÉN", "NAVARRO", "30", "1330.00"),
  reg(4, "CARNE_RESIDENTE", "CR774120", "SS-DEMO-300004", "SOFÍA", "LEZCANO", "30", "1050.00"),
];

/** Febrero 2026 del empleador 2: alertas históricas, sin errores bloqueantes. */
export const PLANILLA_ENERO_EMP2: RegistroPlanilla[] = [
  reg(1, "CEDULA", "2-5540-1101", "SS-DEMO-200001", "HÉCTOR", "BERNAL", "30", "1500.00"),
  reg(2, "CEDULA", "2-5540-1102", "SS-DEMO-200002", "MELISSA", "GRAJALES", "30", "1220.00"),
  reg(3, "CEDULA", "2-5540-1103", "SS-DEMO-200003", "IVÁN", "CASTILLERO", "30", "980.00"),
  reg(4, "CEDULA", "2-5540-1104", "SS-DEMO-200004", "NOEMÍ", "SERRACÍN", "30", "1340.00"),
  reg(5, "CEDULA", "2-5540-1105", "SS-DEMO-200005", "GABRIEL", "TUÑÓN", "30", "1010.00"),
];

export const PLANILLA_FEBRERO_EMP2: RegistroPlanilla[] = [
  reg(1, "CEDULA", "2-5540-1101", "SS-DEMO-200001", "HÉCTOR", "BERNAL", "30", "2400.00"),
  reg(2, "CEDULA", "2-5540-1102", "SS-DEMO-200002", "MELISSA", "GRAJALES", "30", "1220.00"),
  reg(3, "CEDULA", "2-5540-1103", "SS-DEMO-200003", "IVÁN", "CASTILLERO", "30", "980.00", { viaticos: "480.00" }),
  reg(4, "CEDULA", "2-5540-1104", "SS-DEMO-200004", "NOEMÍ", "SERRACÍN", "30", "1340.00"),
  reg(6, "CEDULA", "2-5540-1109", "SS-DEMO-200009", "ALEXIS", "MOJICA", "18", "760.00"),
];

/**
 * Planilla de referencia con montos construidos sobre las tasas reales de salario
 * mínimo 2026 (Decreto Ejecutivo 13 de 2025). Los trabajadores son ficticios, pero
 * los sueldos se sitúan alrededor del mínimo legal de la actividad para que la
 * validación compare contra la tasa oficial y no contra un umbral inventado.
 *
 * Región 1, comercio al por menor (gran empresa): B/. 3.02 por hora ≈ B/. 628.16
 * mensuales con jornada de 48 horas semanales.
 */
export const PLANILLA_REFERENCIA_2026: RegistroPlanilla[] = [
  reg(1, "CEDULA", "8-9001-2201", "SS-DEMO-100001", "ARIEL", "MENDIETA", "30", "628.16"),
  reg(2, "CEDULA", "8-9001-2202", "SS-DEMO-100002", "LORENA", "BATISTA", "30", "560.00", { comisiones: "80.00" }),
  reg(3, "CEDULA", "8-9001-2203", "SS-DEMO-100003", "JAVIER", "QUINTERO", "30", "1600.00"),
  reg(4, "CEDULA", "8-9001-2205", "SS-DEMO-100005", "YARISKA", "CEDEÑO", "15", "314.08"),
  reg(5, "CEDULA", "8-9001-2206", "SS-DEMO-100006", "ELIÉCER", "SAMANIEGO", "30", "890.00", { horasExtras: "96.00" }),
  reg(6, "CEDULA", "8-9001-2210", "SS-DEMO-100010", "TAMARA", "GONDOLA", "26", "480.00"),
];

export const PERIODO_ANTERIOR = "2026-01";
export const PERIODO_ACTUAL = "2026-02";

export const RUBROS_DEMO = [
  "Sueldo",
  "Horas extras",
  "Décimo tercer mes",
  "Vacaciones",
  "Prima de producción",
  "Gastos de representación",
];

export function formatoBalboas(valor: number): string {
  return `B/. ${valor.toLocaleString("es-PA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function totalSueldos(registros: RegistroPlanilla[]): number {
  return registros.reduce((acc, r) => {
    const v = Number(String(r.sueldo).replace(/[^\d.-]/g, ""));
    return acc + (Number.isFinite(v) ? v : 0);
  }, 0);
}
