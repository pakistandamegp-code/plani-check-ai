import { REGLAS, TIPOS_DOCUMENTO } from "./reglas";
import { idNoPredecible } from "./seguridad";
import type { EstadoPlanilla, Hallazgo, RegistroPlanilla, Regla } from "./tipos";

const R = new Map<string, Regla>(REGLAS.map((r) => [r.codigo, r]));

function regla(codigo: string): Regla {
  const r = R.get(codigo);
  if (!r) throw new Error("Regla no configurada");
  return r;
}

function nuevoHallazgo(
  codigo: string,
  fila: number,
  campo: string,
  descripcion: string,
): Hallazgo {
  const r = regla(codigo);
  return {
    id: idNoPredecible("hz"),
    fila,
    campo,
    codigoRegla: r.codigo,
    versionRegla: r.version,
    nivel: r.nivel,
    severidad: r.resultado,
    descripcion,
    accionSugerida: r.accion,
    fundamento: r.fundamento,
  };
}

const num = (v: string): number | null => {
  const t = (v ?? "").trim();
  if (t === "") return null;
  if (!/^-?\d+(\.\d{1,2})?$/.test(t)) return NaN;
  return Number(t);
};

const esCedula = (v: string) => /^\d{1,2}(AV|PI|E|N)?-\d{1,4}-\d{1,5}$/i.test(v.trim());
const esPasaporte = (v: string) => /^[A-Z0-9]{6,12}$/i.test(v.trim());

export interface HistoricoTrabajador {
  numeroDocumento: string;
  sueldo: number;
}

/** Referencia oficial de salario mínimo aplicable al empleador de la planilla. */
export interface ContextoSalarial {
  actividad: string;
  region: string;
  tasaHora: number;
  minimoMensual: number;
}

export function validarPlanilla(
  registros: RegistroPlanilla[],
  historico: HistoricoTrabajador[] = [],
  contexto: ContextoSalarial | null = null,
): Hallazgo[] {
  const hallazgos: Hallazgo[] = [];
  const vistos = new Map<string, number>();
  const previos = new Map(historico.map((h) => [h.numeroDocumento.trim().toUpperCase(), h.sueldo]));
  const actuales = new Set<string>();

  registros.forEach((reg) => {
    const f = reg.fila;

    // Nivel A — estructura
    const obligatorios: [keyof RegistroPlanilla, string][] = [
      ["tipoDocumento", "tipo_documento"],
      ["numeroDocumento", "numero_documento"],
      ["nombre", "nombre"],
      ["apellido", "apellido"],
      ["sueldo", "sueldo"],
    ];
    obligatorios.forEach(([k, campo]) => {
      if (!String(reg[k] ?? "").trim()) {
        hallazgos.push(
          nuevoHallazgo("REG-EST-002", f, campo, `El campo obligatorio ${campo} está vacío.`),
        );
      }
    });

    const monetarios: [keyof RegistroPlanilla, string][] = [
      ["sueldo", "sueldo"],
      ["horasExtras", "horas_extras"],
      ["decimoTercerMes", "decimo_tercer_mes"],
      ["comisiones", "comisiones"],
      ["bonificaciones", "bonificaciones"],
      ["viaticos", "viaticos"],
      ["gastoRepresentacion", "gasto_representacion"],
      ["primasProduccion", "primas_produccion"],
    ];
    monetarios.forEach(([k, campo]) => {
      const raw = String(reg[k] ?? "").trim();
      if (raw === "") return;
      const v = num(raw);
      if (v === null || Number.isNaN(v) || v < 0) {
        hallazgos.push(
          nuevoHallazgo(
            "REG-EST-003",
            f,
            campo,
            `El valor declarado en ${campo} no es un monto decimal válido en balboas.`,
          ),
        );
      }
    });

    const clave = `${reg.tipoDocumento.trim().toUpperCase()}|${reg.numeroDocumento.trim().toUpperCase()}`;
    if (reg.numeroDocumento.trim()) {
      if (vistos.has(clave)) {
        hallazgos.push(
          nuevoHallazgo(
            "REG-EST-004",
            f,
            "numero_documento",
            `Registro duplicado: la clave de identificación ya aparece en la fila ${vistos.get(clave)}.`,
          ),
        );
      } else vistos.set(clave, f);
      actuales.add(reg.numeroDocumento.trim().toUpperCase());
    }

    // Nivel B — identidad
    const tipo = reg.tipoDocumento.trim().toUpperCase();
    if (tipo && !TIPOS_DOCUMENTO.includes(tipo)) {
      hallazgos.push(
        nuevoHallazgo(
          "REG-IDE-001",
          f,
          "tipo_documento",
          `El tipo de documento declarado no pertenece al catálogo controlado.`,
        ),
      );
    }
    const doc = reg.numeroDocumento.trim();
    if (doc && tipo) {
      const formatoOk =
        tipo === "CEDULA" ? esCedula(doc) : tipo === "PASAPORTE" || tipo === "CARNE_RESIDENTE" ? esPasaporte(doc) : true;
      if (!formatoOk) {
        hallazgos.push(
          nuevoHallazgo(
            "REG-IDE-002",
            f,
            "numero_documento",
            `El número de documento no cumple el formato definido para ${tipo}.`,
          ),
        );
      }
    }
    const ss = reg.numeroSeguroSocial.trim();
    if (!ss || !/^[A-Z0-9-]{6,20}$/i.test(ss)) {
      hallazgos.push(
        nuevoHallazgo(
          "REG-IDE-003",
          f,
          "numero_seguro_social",
          "El número de seguro social está ausente o no tiene una estructura coherente; requiere confirmación.",
        ),
      );
    }

    // Nivel C — consistencia laboral
    const dias = num(reg.diasTrabajados);
    if (dias === null || Number.isNaN(dias) || !Number.isInteger(dias) || dias < 0 || dias > 30) {
      hallazgos.push(
        nuevoHallazgo(
          "REG-LAB-001",
          f,
          "dias_trabajados",
          "Los días trabajados deben ser un entero entre 0 y 30 para un período mensual.",
        ),
      );
    }
    const sueldo = num(reg.sueldo);
    const sueldoOk = sueldo !== null && !Number.isNaN(sueldo);
    if (sueldoOk && sueldo === 0 && dias !== null && !Number.isNaN(dias) && dias > 0) {
      hallazgos.push(
        nuevoHallazgo(
          "REG-LAB-002",
          f,
          "sueldo",
          "Se declararon días trabajados con sueldo en cero.",
        ),
      );
    }

    // Nivel E — salario mínimo legal vigente (Decreto Ejecutivo 13 de 2025)
    if (contexto && sueldoOk && sueldo > 0 && dias !== null && !Number.isNaN(dias) && dias > 0) {
      const minimoProporcional = (contexto.minimoMensual * Math.min(dias, 30)) / 30;
      if (sueldo < minimoProporcional * 0.99) {
        hallazgos.push(
          nuevoHallazgo(
            "REG-SAL-003",
            f,
            "sueldo",
            `El sueldo declarado (B/. ${sueldo.toFixed(2)}) es inferior al mínimo legal de la actividad "${contexto.actividad}" en Región ${contexto.region}: B/. ${contexto.tasaHora.toFixed(2)} por hora equivalen a B/. ${minimoProporcional.toFixed(2)} por ${Math.min(dias, 30)} días.`,
          ),
        );
      }
    }

    // Nivel D — consistencia entre campos
    const rubros: [keyof RegistroPlanilla, string][] = [
      ["comisiones", "comisiones"],
      ["bonificaciones", "bonificaciones"],
      ["horasExtras", "horas_extras"],
    ];
    rubros.forEach(([k, campo]) => {
      const v = num(String(reg[k] ?? ""));
      if (v !== null && !Number.isNaN(v) && v > 0 && sueldoOk && sueldo === 0 && (dias ?? 0) === 0) {
        hallazgos.push(
          nuevoHallazgo(
            "REG-CON-001",
            f,
            campo,
            `Se declaró ${campo} sin sueldo ni días trabajados en el período.`,
          ),
        );
      }
    });
    const extras = num(reg.horasExtras);
    if (sueldoOk && sueldo > 0 && extras !== null && !Number.isNaN(extras) && extras > sueldo) {
      hallazgos.push(
        nuevoHallazgo(
          "REG-CON-002",
          f,
          "horas_extras",
          "Las horas extras superan el 100% del sueldo del período.",
        ),
      );
    }

    // Nivel E — normativa de rubros
    const viaticos = num(reg.viaticos);
    if (sueldoOk && sueldo > 0 && viaticos !== null && !Number.isNaN(viaticos) && viaticos > sueldo * 0.25) {
      hallazgos.push(
        nuevoHallazgo(
          "REG-SAL-001",
          f,
          "viaticos",
          "Los viáticos superan el 25% del sueldo y requieren revisión del sustento.",
        ),
      );
    }
    const gasto = num(reg.gastoRepresentacion);
    if (sueldoOk && sueldo > 0 && gasto !== null && !Number.isNaN(gasto) && gasto > sueldo) {
      hallazgos.push(
        nuevoHallazgo(
          "REG-SAL-002",
          f,
          "gasto_representacion",
          "El gasto de representación supera el sueldo ordinario declarado.",
        ),
      );
    }
    const prima = num(reg.primasProduccion);
    if (sueldoOk && sueldo > 0 && prima !== null && !Number.isNaN(prima) && prima > sueldo * 0.5) {
      hallazgos.push(
        nuevoHallazgo(
          "REG-SAL-005",
          f,
          "primas_produccion",
          "La prima de producción representa una proporción alta del sueldo; su clasificación está pendiente de validación institucional.",
        ),
      );
    }

    // Nivel F — histórico
    const docKey = doc.toUpperCase();
    if (docKey && previos.size > 0) {
      const anterior = previos.get(docKey);
      if (anterior === undefined) {
        hallazgos.push(
          nuevoHallazgo(
            "REG-HIS-003",
            f,
            "numero_documento",
            "El trabajador no figuraba en el período anterior del mismo empleador.",
          ),
        );
      } else if (sueldoOk && sueldo > 0 && anterior > 0) {
        const variacion = Math.abs(sueldo - anterior) / anterior;
        if (variacion > 0.4) {
          hallazgos.push(
            nuevoHallazgo(
              "REG-HIS-001",
              f,
              "sueldo",
              `Variación de sueldo de ${(variacion * 100).toFixed(1)}% respecto del período anterior.`,
            ),
          );
        }
      }
    }
  });

  // Trabajadores ausentes respecto al período anterior
  previos.forEach((_, docKey) => {
    if (!actuales.has(docKey)) {
      hallazgos.push(
        nuevoHallazgo(
          "REG-HIS-002",
          0,
          "numero_documento",
          "Un trabajador presente en el período anterior no aparece en esta planilla.",
        ),
      );
    }
  });

  return hallazgos;
}

export function estadoDesdeHallazgos(hallazgos: Hallazgo[]): EstadoPlanilla {
  const pendientes = hallazgos.filter((h) => !h.justificacion);
  if (pendientes.some((h) => h.severidad === "ERROR")) return "CON_ERRORES";
  if (pendientes.some((h) => h.severidad === "ALERTA")) return "EN_REVISION";
  return "PREVALIDADA";
}

export function resumenHallazgos(hallazgos: Hallazgo[]) {
  return {
    errores: hallazgos.filter((h) => h.severidad === "ERROR").length,
    alertas: hallazgos.filter((h) => h.severidad === "ALERTA" && !h.justificacion).length,
    justificadas: hallazgos.filter((h) => !!h.justificacion).length,
    total: hallazgos.length,
  };
}
