/**
 * Parámetros reales de planilla en Panamá para 2026.
 *
 * Salario mínimo: Decreto Ejecutivo N.° 13 de 31 de diciembre de 2025 (MITRADEL),
 * publicado en Gaceta Oficial Digital N.° 30438 del 6 de enero de 2026, vigente
 * desde el 16 de enero de 2026. Fija 59 tasas para 74 actividades económicas
 * según actividad, ocupación, tamaño de empresa y región.
 *
 * Cuotas: porcentajes vigentes de la Caja de Seguro Social y del seguro educativo.
 *
 * Uso académico: las cifras aquí registradas son las tasas publicadas para las
 * actividades de la demostración. Antes de aplicarlas a una planilla real deben
 * confirmarse con la CSS, MITRADEL o un contador autorizado.
 */

export const FUENTE_SALARIO_MINIMO =
  "Decreto Ejecutivo N.° 13 de 31 de diciembre de 2025 — Gaceta Oficial Digital N.° 30438 (6 de enero de 2026), vigente desde el 16 de enero de 2026.";

export type Region = "1" | "2";

export interface TasaSalarioMinimo {
  clave: string;
  actividad: string;
  tamano: "Pequeña empresa" | "Gran empresa" | "Todas";
  /** Balboas por hora. Nacional usa el mismo valor en ambas regiones. */
  region1: number;
  region2: number;
}

/** Tasas por hora publicadas para 2026 (subconjunto usado por la demostración). */
export const TASAS_SALARIO_MINIMO_2026: TasaSalarioMinimo[] = [
  { clave: "AGRO_PEQ", actividad: "Agricultura, ganadería, caza, silvicultura y pesca", tamano: "Pequeña empresa", region1: 1.64, region2: 1.64 },
  { clave: "AGRO_GRAN", actividad: "Agricultura, ganadería, caza, silvicultura y pesca", tamano: "Gran empresa", region1: 2.1, region2: 2.1 },
  { clave: "BANANO", actividad: "Actividades bananeras", tamano: "Todas", region1: 2.58, region2: 2.58 },
  { clave: "MANUF_PEQ", actividad: "Industrias manufactureras", tamano: "Pequeña empresa", region1: 2.32, region2: 1.95 },
  { clave: "MANUF_GRAN", actividad: "Industrias manufactureras", tamano: "Gran empresa", region1: 3.13, region2: 2.58 },
  { clave: "CEMENTO", actividad: "Fabricación de cemento y/o concreto", tamano: "Todas", region1: 3.39, region2: 3.24 },
  { clave: "CONSTRUCCION", actividad: "Construcción", tamano: "Todas", region1: 3.51, region2: 3.3 },
  { clave: "ELECTRICIDAD", actividad: "Suministro de electricidad, gas, vapor y aire acondicionado", tamano: "Todas", region1: 3.5, region2: 3.5 },
  { clave: "COMERCIO_MENOR_GRAN", actividad: "Comercio al por menor", tamano: "Gran empresa", region1: 3.02, region2: 2.48 },
  { clave: "SUPERMERCADOS", actividad: "Supermercados (5 o más sucursales)", tamano: "Todas", region1: 3.09, region2: 2.54 },
  { clave: "HOTELES_GRAN", actividad: "Hoteles", tamano: "Gran empresa", region1: 2.96, region2: 2.43 },
  { clave: "CARGA_ZF_GRAN", actividad: "Transporte de carga en zonas francas y zonas económicas especiales", tamano: "Gran empresa", region1: 3.49, region2: 2.6 },
  { clave: "TRIPULANTES", actividad: "Tripulantes de cabina en vuelos internacionales", tamano: "Todas", region1: 5.01, region2: 5.01 },
];

/** El servicio doméstico se mantiene como monto mensual, no por hora. */
export const SERVICIO_DOMESTICO_MENSUAL_2026 = { region1: 350, region2: 320 };

/** Jornada de referencia para llevar la tasa por hora a un monto mensual. */
export const JORNADA_REFERENCIA = { horasSemanales: 48, semanasPorMes: 52 / 12 };

export interface CuotaPlanilla {
  concepto: string;
  trabajador: string;
  empleador: string;
  base: string;
}

export const CUOTAS_PLANILLA_2026: CuotaPlanilla[] = [
  {
    concepto: "Caja de Seguro Social",
    trabajador: "9.75%",
    empleador: "12.25%",
    base: "Sueldo ordinario y rubros con carácter salarial",
  },
  {
    concepto: "Seguro educativo",
    trabajador: "1.25%",
    empleador: "1.50%",
    base: "Sueldo ordinario",
  },
  {
    concepto: "Riesgos profesionales",
    trabajador: "—",
    empleador: "1.05% a 5.67% según actividad",
    base: "Sueldo ordinario",
  },
  {
    concepto: "Décimo tercer mes",
    trabajador: "Retención según normativa",
    empleador: "Aporte según normativa",
    base: "Partidas de abril, agosto y diciembre",
  },
];

export interface ClasificacionEmpleador {
  empleadorId: string;
  claveTasa: string;
  region: Region;
  distritoReferencia: string;
}

/** Clasificación asumida para cada empleador de la demostración. */
export const CLASIFICACION_EMPLEADORES: ClasificacionEmpleador[] = [
  { empleadorId: "EMP-DEMO-001", claveTasa: "COMERCIO_MENOR_GRAN", region: "1", distritoReferencia: "Panamá" },
  { empleadorId: "EMP-DEMO-002", claveTasa: "CONSTRUCCION", region: "1", distritoReferencia: "Panamá" },
  { empleadorId: "EMP-DEMO-003", claveTasa: "CARGA_ZF_GRAN", region: "2", distritoReferencia: "Colón (fuera de Región 1)" },
];

export function tasaPorClave(clave: string): TasaSalarioMinimo | undefined {
  return TASAS_SALARIO_MINIMO_2026.find((t) => t.clave === clave);
}

export function tasaHora(t: TasaSalarioMinimo, region: Region): number {
  return region === "1" ? t.region1 : t.region2;
}

/** Monto mensual mínimo estimado a partir de la tasa por hora y la jornada de referencia. */
export function minimoMensual(tasa: number): number {
  return (
    Math.round(tasa * JORNADA_REFERENCIA.horasSemanales * JORNADA_REFERENCIA.semanasPorMes * 100) / 100
  );
}

export interface ReferenciaSalarial {
  claveTasa: string;
  actividad: string;
  tamano: string;
  region: Region;
  distritoReferencia: string;
  tasaHora: number;
  minimoMensual: number;
}

export function referenciaSalarial(empleadorId: string): ReferenciaSalarial | null {
  const c = CLASIFICACION_EMPLEADORES.find((x) => x.empleadorId === empleadorId);
  if (!c) return null;
  const t = tasaPorClave(c.claveTasa);
  if (!t) return null;
  const hora = tasaHora(t, c.region);
  return {
    claveTasa: c.claveTasa,
    actividad: t.actividad,
    tamano: t.tamano,
    region: c.region,
    distritoReferencia: c.distritoReferencia,
    tasaHora: hora,
    minimoMensual: minimoMensual(hora),
  };
}

/** Cuotas estimadas sobre una masa salarial declarada (solo referencia informativa). */
export function cuotasEstimadas(masaSalarial: number) {
  const r2 = (v: number) => Math.round(v * 100) / 100;
  return {
    cssTrabajador: r2(masaSalarial * 0.0975),
    cssEmpleador: r2(masaSalarial * 0.1225),
    educativoTrabajador: r2(masaSalarial * 0.0125),
    educativoEmpleador: r2(masaSalarial * 0.015),
  };
}
