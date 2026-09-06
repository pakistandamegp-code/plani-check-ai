import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { usePrevalidacion } from "@/lib/prevalidacion/store";
import { AVISO_DATOS, AVISO_PREVALIDADA } from "@/lib/prevalidacion/seguridad";
import type { EstadoPlanilla, Severidad } from "@/lib/prevalidacion/tipos";

const SUB_NAV = [
  { to: "/demo", etiqueta: "Inicio" },
  { to: "/demo/cargar", etiqueta: "1 · Cargar" },
  { to: "/demo/planillas", etiqueta: "2 · Resultados" },
] as const;

const SUB_NAV_MAS = [
  { to: "/demo/errores", etiqueta: "Errores explicados" },
  { to: "/demo/referencia", etiqueta: "Rangos y referencia" },
  { to: "/demo/auditoria", etiqueta: "Historial y auditoría" },
] as const;

const PASOS_GUIA = [
  { etiqueta: "Cargar la planilla", rutas: ["/demo/cargar"] },
  { etiqueta: "Ver los hallazgos", rutas: ["/demo/planillas"] },
  { etiqueta: "Corregir y revalidar", rutas: ["/demo/errores", "/demo/auditoria"] },
] as const;

export function Detalles({
  titulo,
  children,
  nota,
}: {
  titulo: string;
  children: React.ReactNode;
  nota?: string;
}) {
  return (
    <details className="group rounded-sm border border-border bg-surface-2">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-3.5 text-sm font-semibold">
        <span className="min-w-0">
          {titulo}
          {nota && <span className="ml-2 font-normal text-muted-foreground">{nota}</span>}
        </span>
        <span className="shrink-0 font-mono text-xs text-teal group-open:hidden">mostrar</span>
        <span className="hidden shrink-0 font-mono text-xs text-teal group-open:inline">ocultar</span>
      </summary>
      <div className="space-y-4 border-t border-border p-5">{children}</div>
    </details>
  );
}

function GuiaPasos({ pathname }: { pathname: string }) {
  const actual = PASOS_GUIA.findIndex((p) => p.rutas.some((r) => pathname.startsWith(r)));
  if (actual < 0) return null;
  return (
    <ol className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs">
      {PASOS_GUIA.map((p, i) => (
        <li key={p.etiqueta} className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-sm border px-2.5 py-1 font-medium",
              i === actual
                ? "border-teal bg-teal/10 text-foreground"
                : i < actual
                  ? "border-estado-valido/40 bg-estado-valido/10 text-estado-valido"
                  : "border-border text-muted-foreground",
            )}
          >
            <span className="font-mono">{i + 1}</span>
            {p.etiqueta}
          </span>
          {i < PASOS_GUIA.length - 1 && <span className="text-muted-foreground">→</span>}
        </li>
      ))}
    </ol>
  );
}

export function EtiquetaEstado({ estado }: { estado: EstadoPlanilla }) {
  const mapa: Record<EstadoPlanilla, { texto: string; clase: string }> = {
    RECIBIDA: { texto: "RECIBIDA", clase: "border-estado-neutro/40 bg-estado-neutro/10 text-estado-neutro" },
    EN_VALIDACION: { texto: "EN VALIDACIÓN", clase: "border-teal/40 bg-teal/10 text-teal" },
    CON_ERRORES: { texto: "CON ERRORES", clase: "border-estado-error/40 bg-estado-error/10 text-estado-error" },
    EN_REVISION: { texto: "EN REVISIÓN", clase: "border-estado-alerta/50 bg-estado-alerta/10 text-estado-alerta" },
    PREVALIDADA: { texto: "PREVALIDADA", clase: "border-estado-valido/40 bg-estado-valido/10 text-estado-valido" },
  };
  const e = mapa[estado];
  return (
    <span className={cn("inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-[11px] font-medium", e.clase)}>
      {e.texto}
    </span>
  );
}

export function EtiquetaSeveridad({ severidad, justificada }: { severidad: Severidad; justificada?: boolean }) {
  if (justificada) {
    return (
      <span className="inline-flex items-center rounded-sm border border-estado-valido/40 bg-estado-valido/10 px-2 py-0.5 font-mono text-[11px] text-estado-valido">
        CONFIRMADA
      </span>
    );
  }
  const mapa: Record<Severidad, { texto: string; clase: string }> = {
    VALIDO: { texto: "VÁLIDO", clase: "border-estado-valido/40 bg-estado-valido/10 text-estado-valido" },
    ALERTA: { texto: "ALERTA", clase: "border-estado-alerta/50 bg-estado-alerta/10 text-estado-alerta" },
    ERROR: { texto: "ERROR BLOQUEANTE", clase: "border-estado-error/40 bg-estado-error/10 text-estado-error" },
    FALLA_TECNICA: { texto: "FALLA TÉCNICA", clase: "border-estado-neutro/40 bg-estado-neutro/10 text-estado-neutro" },
  };
  const s = mapa[severidad];
  return (
    <span className={cn("inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-[11px] font-medium", s.clase)}>
      {s.texto}
    </span>
  );
}

export function SelectorSesion() {
  const { usuario, usuarios, cambiarUsuario } = usePrevalidacion();
  return (
    <div className="grid gap-3 rounded-sm border border-border bg-surface p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
      <div className="min-w-0">
        <label htmlFor="sesion-demo" className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Sesión de demostración (rol y empleador)
        </label>
        <select
          id="sesion-demo"
          value={usuario.id}
          onChange={(e) => cambiarUsuario(e.target.value)}
          className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm"
        >
          {usuarios.map((u) => (
            <option key={u.id} value={u.id}>
              {u.rol} — {u.nombre}
            </option>
          ))}
        </select>
      </div>
      <p className="text-xs text-muted-foreground sm:max-w-[16rem] sm:text-right">
        El acceso se limita al empleador de la sesión. Los intentos cruzados quedan en la bitácora.
      </p>
    </div>
  );
}

export function AvisoLegalDemo() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded-sm border border-gold/40 bg-gold/10 p-4 text-xs leading-relaxed text-foreground/80">
        {AVISO_PREVALIDADA}
      </div>
      <div className="rounded-sm border border-border bg-surface-2 p-4 text-xs leading-relaxed text-muted-foreground">
        {AVISO_DATOS}
      </div>
    </div>
  );
}

const PASOS_DEMO = [
  {
    titulo: "Cargue una planilla",
    texto:
      "En «Cargar planilla» descargue la plantilla o use el archivo de ejemplo. Se revisa el tipo, el tamaño y las columnas antes de procesar.",
    enlace: { to: "/demo/cargar", etiqueta: "Ir a cargar planilla" },
  },
  {
    titulo: "Revise los hallazgos",
    texto:
      "Cada fila con problema muestra la regla aplicada, el campo afectado, el fundamento y la acción sugerida. Los errores bloquean; las alertas se pueden confirmar con una justificación.",
    enlace: { to: "/demo/planillas", etiqueta: "Ver planillas" },
  },
  {
    titulo: "Corrija y vuelva a validar",
    texto:
      "Edite los valores señalados, genere una nueva versión y compare el resultado. Todo el recorrido queda registrado en el historial.",
    enlace: { to: "/demo/auditoria", etiqueta: "Ver historial" },
  },
] as const;

export function ComoUsarLaDemo() {
  return (
    <section className="rounded-sm border border-border bg-surface p-6">
      <h2 className="text-base font-semibold">Cómo usar esta demostración</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Tres pasos, con datos ficticios. Puede empezar sin preparar ningún archivo.
      </p>
      <ol className="mt-5 grid gap-4 md:grid-cols-3">
        {PASOS_DEMO.map((p, i) => (
          <li key={p.titulo} className="rounded-sm border border-border bg-surface-2 p-4">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-sm bg-teal/15 font-mono text-xs font-semibold text-teal">
              {i + 1}
            </span>
            <h3 className="mt-3 text-sm font-semibold">{p.titulo}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{p.texto}</p>
            <Link to={p.enlace.to} className="mt-3 inline-block text-xs font-semibold text-teal hover:underline">
              {p.enlace.etiqueta} →
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function EncabezadoDemo({ titulo, descripcion }: { titulo: string; descripcion: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="border-b border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">Aplicación de demostración</p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">{titulo}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{descripcion}</p>
        <nav className="mt-6 flex flex-wrap items-center gap-1">
          {SUB_NAV.map((n) => {
            const activo = n.to === "/demo" ? pathname === "/demo" : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "shrink-0 rounded-t-sm border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                  activo
                    ? "border-teal text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {n.etiqueta}
              </Link>
            );
          })}
          <details className="relative shrink-0">
            <summary className="cursor-pointer list-none px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground">
              Más ▾
            </summary>
            <div className="absolute right-0 z-20 mt-1 w-64 rounded-sm border border-border bg-surface p-1 shadow-lg">
              {SUB_NAV_MAS.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="block rounded-sm px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  {n.etiqueta}
                </Link>
              ))}
            </div>
          </details>
        </nav>
        <GuiaPasos pathname={pathname} />
      </div>
    </div>
  );
}

export function Tarjeta({
  titulo,
  valor,
  detalle,
  tono = "neutro",
}: {
  titulo: string;
  valor: string | number;
  detalle?: string;
  tono?: "neutro" | "error" | "alerta" | "valido";
}) {
  const tonos = {
    neutro: "text-foreground",
    error: "text-estado-error",
    alerta: "text-estado-alerta",
    valido: "text-estado-valido",
  } as const;
  return (
    <div className="bisel-superior rounded-sm border border-border bg-surface p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{titulo}</p>
      <p className={cn("mt-2 font-display text-3xl font-semibold", tonos[tono])}>{valor}</p>
      {detalle && <p className="mt-1 text-xs text-muted-foreground">{detalle}</p>}
    </div>
  );
}
