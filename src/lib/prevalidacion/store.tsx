import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  EMPLEADORES_DEMO,
  PERIODO_ACTUAL,
  PERIODO_ANTERIOR,
  PLANILLA_ENERO_EMP1,
  PLANILLA_ENERO_EMP2,
  PLANILLA_ENERO_EMP3,
  PLANILLA_FEBRERO_EMP1,
  PLANILLA_FEBRERO_EMP2,
  PLANILLA_FEBRERO_EMP3,
  USUARIOS_DEMO,
  type UsuarioDemo,
} from "./datos";
import { ESQUEMA_CSV, registrosACSV } from "./csv";
import { estadoDesdeHallazgos, validarPlanilla, type ContextoSalarial, type HistoricoTrabajador } from "./motor";
import { referenciaSalarial } from "./panama-2026";
import { huellaContenido, idNoPredecible, mensajeErrorSeguro, sanitizarTextoLibre } from "./seguridad";
import type { EventoAuditoria, Planilla, RegistroPlanilla } from "./tipos";

const CLAVE = "css-prevalidacion-demo-v1";

interface EstadoApp {
  planillas: Planilla[];
  auditoria: EventoAuditoria[];
  usuarioId: string;
}

interface Ctx {
  listo: boolean;
  usuario: UsuarioDemo;
  usuarios: UsuarioDemo[];
  cambiarUsuario: (id: string) => void;
  planillas: Planilla[];
  planillasVisibles: Planilla[];
  auditoria: EventoAuditoria[];
  obtenerPlanilla: (id: string) => { planilla?: Planilla; denegado: boolean };
  cargarPlanilla: (args: {
    registros: RegistroPlanilla[];
    periodo: string;
    archivoNombre: string;
  }) => { ok: boolean; mensaje: string; planillaId?: string };
  ejecutarValidacion: (planillaId: string) => void;
  crearVersionCorregida: (
    planillaId: string,
    registros: RegistroPlanilla[],
    motivo: string,
  ) => { ok: boolean; mensaje: string; planillaId?: string };
  justificarHallazgo: (planillaId: string, hallazgoId: string, texto: string) => { ok: boolean; mensaje: string };
  registrarEvento: (accion: string, detalle: string) => void;
  reiniciarDemo: () => void;
}

const PrevalidacionContext = createContext<Ctx | null>(null);

function evento(actor: string, accion: string, detalle: string): EventoAuditoria {
  return {
    id: idNoPredecible("ev"),
    fecha: new Date().toISOString(),
    actor,
    accion,
    detalle: sanitizarTextoLibre(detalle, 200),
  };
}

function contextoDe(empleadorId: string): ContextoSalarial | null {
  const r = referenciaSalarial(empleadorId);
  if (!r) return null;
  return {
    actividad: r.actividad,
    region: r.region,
    tasaHora: r.tasaHora,
    minimoMensual: r.minimoMensual,
  };
}

function historicoDe(registros: RegistroPlanilla[]): HistoricoTrabajador[] {
  return registros.map((r) => ({
    numeroDocumento: r.numeroDocumento,
    sueldo: Number(String(r.sueldo).replace(/[^\d.-]/g, "")) || 0,
  }));
}

function crearPlanilla(args: {
  empleadorId: string;
  periodo: string;
  registros: RegistroPlanilla[];
  archivoNombre: string;
  usuario: string;
  version?: number;
  origen?: string | null;
}): Planilla {
  const emp = EMPLEADORES_DEMO.find((e) => e.id === args.empleadorId)!;
  return {
    id: idNoPredecible("pl"),
    solicitudId: idNoPredecible("sol"),
    empleadorId: args.empleadorId,
    empleadorNombre: emp.nombre,
    periodo: args.periodo,
    version: args.version ?? 1,
    planillaOrigenId: args.origen ?? null,
    esquema: ESQUEMA_CSV,
    huella: huellaContenido(registrosACSV(args.registros)),
    archivoNombre: args.archivoNombre,
    recibidaEn: new Date().toISOString(),
    usuarioOrigen: args.usuario,
    estado: "RECIBIDA",
    registros: args.registros,
    hallazgos: [],
    auditoria: [],
  };
}

function semilla(): EstadoApp {
  const auditoria: EventoAuditoria[] = [];
  const planillas: Planilla[] = [];

  const definiciones = [
    { emp: "EMP-DEMO-001", periodo: PERIODO_ANTERIOR, regs: PLANILLA_ENERO_EMP1, hist: [] as RegistroPlanilla[], archivo: "planilla_2026-01_demo.csv" },
    { emp: "EMP-DEMO-001", periodo: PERIODO_ACTUAL, regs: PLANILLA_FEBRERO_EMP1, hist: PLANILLA_ENERO_EMP1, archivo: "planilla_2026-02_demo.csv" },
    { emp: "EMP-DEMO-002", periodo: PERIODO_ANTERIOR, regs: PLANILLA_ENERO_EMP2, hist: [], archivo: "planilla_2026-01_demo.csv" },
    { emp: "EMP-DEMO-002", periodo: PERIODO_ACTUAL, regs: PLANILLA_FEBRERO_EMP2, hist: PLANILLA_ENERO_EMP2, archivo: "planilla_2026-02_demo.csv" },
    { emp: "EMP-DEMO-003", periodo: PERIODO_ANTERIOR, regs: PLANILLA_ENERO_EMP3, hist: [], archivo: "planilla_2026-01_demo.csv" },
    { emp: "EMP-DEMO-003", periodo: PERIODO_ACTUAL, regs: PLANILLA_FEBRERO_EMP3, hist: PLANILLA_ENERO_EMP3, archivo: "planilla_2026-02_demo.csv" },
  ];

  definiciones.forEach((d) => {
    const p = crearPlanilla({
      empleadorId: d.emp,
      periodo: d.periodo,
      registros: d.regs,
      archivoNombre: d.archivo,
      usuario: "Carga inicial de demostración",
    });
    p.hallazgos = validarPlanilla(d.regs, historicoDe(d.hist), contextoDe(d.emp));
    p.estado = estadoDesdeHallazgos(p.hallazgos);
    p.auditoria = [
      evento("Sistema (demo)", "RECEPCION", `Solicitud registrada para el período ${d.periodo}.`),
      evento("Sistema (demo)", "VALIDACION", `Ejecución del catálogo de reglas: ${p.hallazgos.length} hallazgos.`),
    ];
    auditoria.push(...p.auditoria.map((e) => ({ ...e, detalle: `${e.detalle} [${d.emp}]` })));
    planillas.push(p);
  });

  return { planillas, auditoria, usuarioId: USUARIOS_DEMO[0]!.id };
}

export function PrevalidacionProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoApp | null>(null);

  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(CLAVE);
      if (guardado) {
        const parsed = JSON.parse(guardado) as EstadoApp;
        if (parsed?.planillas?.length) {
          setEstado(parsed);
          return;
        }
      }
    } catch {
      /* estado local ilegible: se regenera la demo */
    }
    setEstado(semilla());
  }, []);

  useEffect(() => {
    if (!estado) return;
    try {
      window.localStorage.setItem(CLAVE, JSON.stringify(estado));
    } catch {
      /* almacenamiento no disponible */
    }
  }, [estado]);

  const usuario = useMemo(
    () => USUARIOS_DEMO.find((u) => u.id === estado?.usuarioId) ?? USUARIOS_DEMO[0]!,
    [estado?.usuarioId],
  );

  const registrar = useCallback(
    (accion: string, detalle: string) =>
      setEstado((prev) =>
        prev ? { ...prev, auditoria: [evento(usuario.nombre, accion, detalle), ...prev.auditoria].slice(0, 300) } : prev,
      ),
    [usuario.nombre],
  );

  const planillas = estado?.planillas ?? [];

  const planillasVisibles = useMemo(() => {
    if (usuario.permisos.verTodos) return planillas;
    return planillas.filter((p) => p.empleadorId === usuario.empleadorId);
  }, [planillas, usuario]);

  const obtenerPlanilla = useCallback(
    (id: string) => {
      const p = planillas.find((x) => x.id === id);
      if (!p) return { denegado: false };
      if (!usuario.permisos.verTodos && p.empleadorId !== usuario.empleadorId) {
        return { denegado: true };
      }
      return { planilla: p, denegado: false };
    },
    [planillas, usuario],
  );

  const cambiarUsuario = useCallback((id: string) => {
    setEstado((prev) => {
      if (!prev) return prev;
      const u = USUARIOS_DEMO.find((x) => x.id === id) ?? USUARIOS_DEMO[0]!;
      return {
        ...prev,
        usuarioId: u.id,
        auditoria: [evento(u.nombre, "SESION", `Sesión de demostración iniciada con rol ${u.rol}.`), ...prev.auditoria],
      };
    });
  }, []);

  const cargarPlanilla = useCallback<Ctx["cargarPlanilla"]>(
    ({ registros, periodo, archivoNombre }) => {
      if (!usuario.permisos.cargar || !usuario.empleadorId) {
        registrar("ACCESO_DENEGADO", "Intento de carga sin permiso suficiente.");
        return { ok: false, mensaje: mensajeErrorSeguro("ROL_INSUFICIENTE") };
      }
      const huella = huellaContenido(registrosACSV(registros));
      const duplicada = planillas.find(
        (p) => p.empleadorId === usuario.empleadorId && p.periodo === periodo && p.huella === huella,
      );
      if (duplicada) {
        registrar("IDEMPOTENCIA", `Reenvío detectado para el período ${periodo}; no se duplicó el procesamiento.`);
        return { ok: false, mensaje: mensajeErrorSeguro("IDEMPOTENCIA"), planillaId: duplicada.id };
      }

      const anterior = planillas
        .filter((p) => p.empleadorId === usuario.empleadorId && p.periodo < periodo)
        .sort((a, b) => (a.periodo < b.periodo ? 1 : -1))[0];

      const nueva = crearPlanilla({
        empleadorId: usuario.empleadorId,
        periodo,
        registros,
        archivoNombre,
        usuario: usuario.nombre,
      });
      nueva.hallazgos = validarPlanilla(
        registros,
        anterior ? historicoDe(anterior.registros) : [],
        contextoDe(nueva.empleadorId),
      );
      nueva.estado = estadoDesdeHallazgos(nueva.hallazgos);
      nueva.auditoria = [
        evento(usuario.nombre, "CARGA_CSV", `Archivo recibido y saneado (${registros.length} registros).`),
        evento(usuario.nombre, "VALIDACION", `Reglas ejecutadas: ${nueva.hallazgos.length} hallazgos.`),
      ];

      setEstado((prev) =>
        prev
          ? {
              ...prev,
              planillas: [nueva, ...prev.planillas],
              auditoria: [...nueva.auditoria, ...prev.auditoria].slice(0, 300),
            }
          : prev,
      );
      return { ok: true, mensaje: "Solicitud registrada y validada.", planillaId: nueva.id };
    },
    [planillas, registrar, usuario],
  );

  const ejecutarValidacion = useCallback(
    (planillaId: string) => {
      setEstado((prev) => {
        if (!prev) return prev;
        const planillas2 = prev.planillas.map((p) => {
          if (p.id !== planillaId) return p;
          const anterior = prev.planillas
            .filter((x) => x.empleadorId === p.empleadorId && x.periodo < p.periodo)
            .sort((a, b) => (a.periodo < b.periodo ? 1 : -1))[0];
          const hallazgos = validarPlanilla(
            p.registros,
            anterior ? historicoDe(anterior.registros) : [],
            contextoDe(p.empleadorId),
          );
          const previas = new Map(p.hallazgos.filter((h) => h.justificacion).map((h) => [h.codigoRegla + h.fila + h.campo, h.justificacion]));
          const conJust = hallazgos.map((h) => {
            const j = previas.get(h.codigoRegla + h.fila + h.campo);
            return j ? { ...h, justificacion: j } : h;
          });
          return {
            ...p,
            hallazgos: conJust,
            estado: estadoDesdeHallazgos(conJust),
            auditoria: [evento(usuario.nombre, "VALIDACION", `Reejecución del catálogo de reglas.`), ...p.auditoria],
          };
        });
        return {
          ...prev,
          planillas: planillas2,
          auditoria: [evento(usuario.nombre, "VALIDACION", "Reejecución de validación solicitada."), ...prev.auditoria],
        };
      });
    },
    [usuario.nombre],
  );

  const crearVersionCorregida = useCallback<Ctx["crearVersionCorregida"]>(
    (planillaId, registros, motivo) => {
      const origen = planillas.find((p) => p.id === planillaId);
      if (!origen) return { ok: false, mensaje: mensajeErrorSeguro("GENERICO") };
      if (!usuario.permisos.verTodos && origen.empleadorId !== usuario.empleadorId) {
        registrar("ACCESO_DENEGADO", "Intento de corregir una planilla de otro empleador.");
        return { ok: false, mensaje: mensajeErrorSeguro("ACCESO_DENEGADO") };
      }
      if (!usuario.permisos.corregir) {
        registrar("ACCESO_DENEGADO", "Intento de corrección sin permiso suficiente.");
        return { ok: false, mensaje: mensajeErrorSeguro("ROL_INSUFICIENTE") };
      }

      const anterior = planillas
        .filter((p) => p.empleadorId === origen.empleadorId && p.periodo < origen.periodo)
        .sort((a, b) => (a.periodo < b.periodo ? 1 : -1))[0];

      const maxVersion = Math.max(
        ...planillas
          .filter((p) => p.empleadorId === origen.empleadorId && p.periodo === origen.periodo)
          .map((p) => p.version),
      );

      const modificados = registros.filter((r, i) => JSON.stringify(r) !== JSON.stringify(origen.registros[i])).length;

      const nueva = crearPlanilla({
        empleadorId: origen.empleadorId,
        periodo: origen.periodo,
        registros,
        archivoNombre: origen.archivoNombre.replace(/\.csv$/, "") + `_v${maxVersion + 1}.csv`,
        usuario: usuario.nombre,
        version: maxVersion + 1,
        origen: origen.id,
      });
      nueva.hallazgos = validarPlanilla(
        registros,
        anterior ? historicoDe(anterior.registros) : [],
        contextoDe(nueva.empleadorId),
      );
      nueva.estado = estadoDesdeHallazgos(nueva.hallazgos);
      nueva.auditoria = [
        evento(
          usuario.nombre,
          "CORRECCION",
          `Versión ${maxVersion + 1} creada desde la versión ${origen.version}. Registros modificados: ${modificados}. Motivo: ${motivo}`,
        ),
        evento(usuario.nombre, "VALIDACION", `Reglas ejecutadas sobre la nueva versión: ${nueva.hallazgos.length} hallazgos.`),
      ];

      setEstado((prev) =>
        prev
          ? {
              ...prev,
              planillas: [nueva, ...prev.planillas],
              auditoria: [...nueva.auditoria, ...prev.auditoria].slice(0, 300),
            }
          : prev,
      );
      return { ok: true, mensaje: `Versión ${maxVersion + 1} generada.`, planillaId: nueva.id };
    },
    [planillas, registrar, usuario],
  );

  const justificarHallazgo = useCallback<Ctx["justificarHallazgo"]>(
    (planillaId, hallazgoId, texto) => {
      if (!usuario.permisos.justificar) {
        registrar("ACCESO_DENEGADO", "Intento de justificar una alerta sin permiso suficiente.");
        return { ok: false, mensaje: mensajeErrorSeguro("ROL_INSUFICIENTE") };
      }
      const limpio = sanitizarTextoLibre(texto, 300);
      if (limpio.length < 10) return { ok: false, mensaje: "La justificación debe tener al menos 10 caracteres." };

      setEstado((prev) => {
        if (!prev) return prev;
        const planillas2 = prev.planillas.map((p) => {
          if (p.id !== planillaId) return p;
          const hallazgos = p.hallazgos.map((h) =>
            h.id === hallazgoId && h.severidad === "ALERTA" ? { ...h, justificacion: limpio } : h,
          );
          return {
            ...p,
            hallazgos,
            estado: estadoDesdeHallazgos(hallazgos),
            auditoria: [evento(usuario.nombre, "JUSTIFICACION", `Alerta confirmada con justificación registrada.`), ...p.auditoria],
          };
        });
        return {
          ...prev,
          planillas: planillas2,
          auditoria: [evento(usuario.nombre, "JUSTIFICACION", "Alerta confirmada por el usuario autorizado."), ...prev.auditoria],
        };
      });
      return { ok: true, mensaje: "Alerta confirmada." };
    },
    [registrar, usuario],
  );

  const reiniciarDemo = useCallback(() => setEstado(semilla()), []);

  const valor: Ctx = {
    listo: !!estado,
    usuario,
    usuarios: USUARIOS_DEMO,
    cambiarUsuario,
    planillas,
    planillasVisibles,
    auditoria: estado?.auditoria ?? [],
    obtenerPlanilla,
    cargarPlanilla,
    ejecutarValidacion,
    crearVersionCorregida,
    justificarHallazgo,
    registrarEvento: registrar,
    reiniciarDemo,
  };

  return <PrevalidacionContext.Provider value={valor}>{children}</PrevalidacionContext.Provider>;
}

export function usePrevalidacion() {
  const ctx = useContext(PrevalidacionContext);
  if (!ctx) throw new Error("usePrevalidacion debe usarse dentro de PrevalidacionProvider");
  return ctx;
}
