import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Loader2,
  ShieldCheck,
  FileCheck,
  Sparkles,
  AlertTriangle,
  XCircle,
  ScanLine,
  Database,
  Lock,
  ArrowRight,
  FastForward,
} from "lucide-react";
import { NIVELES } from "@/lib/prevalidacion/reglas";
import { cn } from "@/lib/utils";

export interface PasoProceso {
  clave: string;
  titulo: string;
  detalle: string;
  icono: React.ReactNode;
  ejemplo?: string;
  /** Milisegundos que dura este paso en pantalla. */
  duracion: number;
}

const ICONO_TAMANO = 18;

/** Pasos visibles durante la animación de validación, con ejemplos didácticos. */
export const PASOS_PROCESO: PasoProceso[] = [
  {
    clave: "recepcion",
    titulo: "Recepción segura",
    detalle: "Verificamos tipo, tamaño y que el archivo no exceda los límites antes de leerlo.",
    icono: <Lock size={ICONO_TAMANO} />,
    ejemplo: "CSV · 12 KB · UTF-8",
    duracion: 1600,
  },
  {
    clave: "saneamiento",
    titulo: "Limpieza de celdas",
    detalle: "Neutralizamos caracteres de control, HTML y fórmulas ejecutables para proteger la demo.",
    icono: <Sparkles size={ICONO_TAMANO} />,
    ejemplo: "Celdas saneadas",
    duracion: 1500,
  },
  ...NIVELES.map((n) => ({
    clave: `nivel-${n.nivel}`,
    titulo: `Nivel ${n.nivel} · ${n.titulo}`,
    detalle: n.objetivo,
    icono: <ScanLine size={ICONO_TAMANO} />,
    ejemplo: `Revisando reglas del nivel ${n.nivel}`,
    duracion: 1700,
  })),
  {
    clave: "bitacora",
    titulo: "Registro en bitácora",
    detalle: "Guardamos quién envió, cuándo y con qué versión de reglas, para auditoría.",
    icono: <Database size={ICONO_TAMANO} />,
    ejemplo: "Evento de auditoría creado",
    duracion: 1500,
  },
  {
    clave: "resultado",
    titulo: "Resultado listo",
    detalle: "La planilla se clasifica en uno de los cinco estados del ciclo de vida.",
    icono: <FileCheck size={ICONO_TAMANO} />,
    ejemplo: "Preparando vista de hallazgos",
    duracion: 1400,
  },
];

interface Props {
  abierto: boolean;
  registros: number;
  /** Se llama cuando el usuario decide continuar al detalle de la planilla. */
  alTerminar: () => void;
}

/**
 * Overlay de progreso educativo: explica en vivo, paso a paso, qué está
 * haciendo el sistema con la planilla. Al terminar espera una acción
 * explícita del usuario para pasar al detalle, en lugar de saltar solo.
 */
export function ProcesoValidacion({ abierto, registros, alTerminar }: Props) {
  const [paso, setPaso] = useState(0);
  const [completado, setCompletado] = useState(false);

  const total = PASOS_PROCESO.length;
  const porcentaje = completado
    ? 100
    : Math.round((Math.min(paso, total - 1) / (total - 1)) * 100);

  const pasoActual = PASOS_PROCESO[Math.min(paso, total - 1)];
  const nivelActual = useMemo(() => {
    if (!pasoActual?.clave.startsWith("nivel-")) return null;
    return pasoActual.clave.replace("nivel-", "");
  }, [pasoActual]);

  useEffect(() => {
    if (!abierto) {
      setPaso(0);
      setCompletado(false);
      return;
    }
    if (completado) return;
    if (paso >= total) {
      setCompletado(true);
      return;
    }
    const t = setTimeout(() => setPaso((p) => p + 1), PASOS_PROCESO[paso]?.duracion ?? 1500);
    return () => clearTimeout(t);
  }, [abierto, paso, total, completado]);

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy/85 p-3 backdrop-blur-md sm:items-center sm:p-6">
      <div
        className={cn(
          "my-auto flex w-full max-w-3xl flex-col overflow-hidden rounded-sm border border-teal/30 bg-surface shadow-2xl",
          "animate-scale-in",
        )}
      >
        {/* Cabecera */}
        <div className="border-b border-border bg-surface-2 px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal/15 sm:h-10 sm:w-10">
              <ShieldCheck className="h-5 w-5 text-teal" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-teal sm:text-[11px]">
                {completado ? "Análisis completo" : `Paso ${Math.min(paso + 1, total)} de ${total}`}
              </p>
              <h2 className="text-sm font-semibold sm:text-base">
                {completado
                  ? "Resultado listo para revisar"
                  : `Revisando ${registros} registro${registros === 1 ? "" : "s"} nivel por nivel`}
              </h2>
            </div>
            {!completado && (
              <button
                type="button"
                onClick={() => {
                  setPaso(total);
                  setCompletado(true);
                }}
                className="hidden shrink-0 items-center gap-1.5 rounded-sm border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:inline-flex"
              >
                <FastForward className="h-3.5 w-3.5" /> Ir al resultado
              </button>
            )}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-teal transition-all duration-500 ease-out"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
            <span className="font-mono text-xs text-muted-foreground">{porcentaje}%</span>
          </div>
        </div>

        {/* Cuerpo: escáner + lista */}
        <div className="grid gap-0 lg:grid-cols-[1fr_1.25fr]">
          {/* Panel izquierdo: visual del paso activo */}
          <div className="border-b border-border bg-surface p-4 sm:p-6 lg:border-b-0 lg:border-r">
            <div className="flex h-full flex-col items-center justify-center text-center">
              {/* Insignia del nivel o icono del paso */}
              <div
                className={cn(
                  "relative flex h-20 w-20 items-center justify-center rounded-full border-4 transition-all duration-500 sm:h-28 sm:w-28",
                  completado
                    ? "border-estado-valido bg-estado-valido/10"
                    : nivelActual
                      ? "border-teal bg-teal/10 shadow-[0_0_30px_-8px_var(--color-teal)]"
                      : "border-muted bg-muted/30",
                )}
              >
                {completado ? (
                  <FileCheck className="h-9 w-9 text-estado-valido sm:h-11 sm:w-11" />
                ) : nivelActual ? (
                  <span className="font-display text-4xl font-bold text-teal sm:text-5xl">{nivelActual}</span>
                ) : (
                  <span className="text-muted-foreground">{pasoActual?.icono}</span>
                )}

                {/* Anillo pulsante mientras se procesa */}
                {!completado && (
                  <span className="absolute inset-[-6px] rounded-full border-2 border-teal/40 animate-ping" />
                )}
              </div>

              <h3 className="mt-4 text-base font-semibold sm:mt-5 sm:text-lg">
                {completado ? "Validación finalizada" : pasoActual?.titulo}
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {completado
                  ? "Revisamos los seis niveles y guardamos el evento en la bitácora. El siguiente paso muestra cada hallazgo explicado, con la regla que lo generó."
                  : pasoActual?.detalle}
              </p>

              {/* Ejemplo animado de fila escaneada */}
              {!completado && nivelActual && (
                <div className="mt-4 w-full max-w-[16rem] overflow-hidden rounded-sm border border-border bg-surface-2 p-3 sm:mt-5">
                  <div className="flex items-center gap-2">
                    <ScanLine className="h-4 w-4 animate-pulse text-teal" />
                    <span className="truncate font-mono text-[11px] text-muted-foreground">
                      {pasoActual?.ejemplo}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1.5">
                    <div className="h-2 w-full rounded-sm bg-border" />
                    <div className="h-2 w-4/5 rounded-sm bg-border" />
                    <div className="h-2 w-3/5 rounded-sm bg-border" />
                  </div>
                </div>
              )}

              {completado && (
                <button
                  type="button"
                  onClick={alTerminar}
                  className="mt-5 inline-flex items-center gap-2 rounded-sm bg-teal px-5 py-2.5 text-sm font-semibold text-teal-foreground transition-opacity hover:opacity-90"
                >
                  Ver los hallazgos <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Panel derecho: lista de pasos */}
          <div className="max-h-[45vh] overflow-y-auto p-4 sm:p-5 lg:max-h-[460px]">
            <ol className="space-y-2">
              {PASOS_PROCESO.map((p, i) => {
                const hecho = completado || i < paso;
                const activo = i === paso && !completado;
                const esNivel = p.clave.startsWith("nivel-");
                const letraNivel = esNivel ? p.clave.replace("nivel-", "") : null;

                return (
                  <li
                    key={p.clave}
                    className={cn(
                      "flex items-start gap-3 rounded-sm border px-3 py-2.5 transition-all duration-300",
                      activo
                        ? "border-teal/50 bg-teal/10"
                        : hecho
                          ? "border-border bg-transparent"
                          : "border-transparent opacity-45",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                        activo
                          ? "border-teal bg-teal text-teal-foreground"
                          : hecho
                            ? "border-estado-valido bg-estado-valido text-white"
                            : "border-border bg-surface-2 text-muted-foreground",
                      )}
                    >
                      {hecho ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : activo ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : letraNivel ? (
                        letraNivel
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{p.titulo}</span>
                      {(activo || hecho) && (
                        <span className="block text-xs leading-relaxed text-muted-foreground">
                          {p.detalle}
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ol>

            {/* Leyenda de severidades */}
            <div className="mt-5 rounded-sm border border-border bg-surface-2 p-3">
              <p className="text-xs font-medium text-foreground">
                {completado ? "Esto es lo que verá en el detalle:" : "Qué verá después:"}
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                <span className="inline-flex items-center gap-1 rounded-sm border border-estado-error/40 bg-estado-error/10 px-2 py-1 text-estado-error">
                  <XCircle className="h-3 w-3" /> Error bloqueante
                </span>
                <span className="inline-flex items-center gap-1 rounded-sm border border-estado-alerta/50 bg-estado-alerta/10 px-2 py-1 text-estado-alerta">
                  <AlertTriangle className="h-3 w-3" /> Alerta revisable
                </span>
                <span className="inline-flex items-center gap-1 rounded-sm border border-estado-valido/40 bg-estado-valido/10 px-2 py-1 text-estado-valido">
                  <Check className="h-3 w-3" /> Prevalidada
                </span>
              </div>
            </div>

            {completado && (
              <button
                type="button"
                onClick={alTerminar}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-teal px-5 py-2.5 text-sm font-semibold text-teal-foreground transition-opacity hover:opacity-90 lg:hidden"
              >
                Ver los hallazgos <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Pie */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface-2 px-4 py-3 sm:px-6">
          <p className="min-w-0 text-xs text-muted-foreground">
            Todo ocurre en este navegador con datos ficticios. La demo no se conecta a instituciones.
          </p>
          {!completado && (
            <button
              type="button"
              onClick={() => {
                setPaso(total);
                setCompletado(true);
              }}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:hidden"
            >
              <FastForward className="h-3.5 w-3.5" /> Ir al resultado
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
