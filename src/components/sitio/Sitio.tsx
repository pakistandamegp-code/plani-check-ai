import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { AVISO_MVP } from "@/lib/prevalidacion/seguridad";
import { cn } from "@/lib/utils";
import logoEquipo from "@/assets/logo-equipo.png";

/** Estilos compartidos: el elemento activo se marca en suave, nunca relleno sólido. */
const ENLACE_BASE =
  "flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm font-medium text-ink-foreground outline-none transition-colors hover:border-teal/70 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-teal/70 data-[status=active]:border-teal data-[status=active]:bg-teal/15 data-[status=active]:text-teal";


const NAV = [
  { to: "/demo", etiqueta: "Demo" },
  { to: "/tutorial", etiqueta: "Videos" },
] as const;

const NAV_MAS = [
  { to: "/reglas", etiqueta: "Reglas de validación" },
  { to: "/normativa", etiqueta: "Cumplimiento" },
  { to: "/arquitectura", etiqueta: "Arquitectura" },
  { to: "/instalar-herramientas", etiqueta: "Instalar herramientas" },
  { to: "/equipo", etiqueta: "Equipo" },
] as const;

const NAV_TODO = [{ to: "/", etiqueta: "Inicio" }, ...NAV, ...NAV_MAS] as const;

const EQUIPO = [
  { nombre: "Pablo Sánchez", rol: "Backend Python y arquitectura técnica", iniciales: "PS" },
  { nombre: "Alberto Davis", rol: "Seguridad y DevOps", iniciales: "AD" },
  {
    nombre: "Daniel Domínguez",
    rol: "Product Owner, análisis de negocio, Scrum Master y calidad",
    iniciales: "DD",
  },
] as const;


export function Marca({ claro = false }: { claro?: boolean }) {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-3">
      <img
        src={logoEquipo}
        alt=""
        width={1024}
        height={1024}
        loading="lazy"
        aria-hidden
        className="h-9 w-9 shrink-0 rounded-md"
      />
      <span className="min-w-0 leading-tight">
        <span
          className={cn(
            "block truncate font-display text-sm font-700 font-semibold tracking-tight",
            claro ? "text-ink-foreground" : "text-foreground",
          )}
        >
          Prevalida Planillas
        </span>
        <span className={cn("block truncate text-[11px]", claro ? "text-ink-foreground/70" : "text-muted-foreground")}>
          Caso 7 · Demostración
        </span>
      </span>
    </Link>
  );
}

export function BarraAviso() {
  return (
    <div className="border-b border-gold/30 bg-gold/15">
      <p className="mx-auto max-w-7xl px-4 py-2 text-center text-[12px] leading-snug text-foreground/80 sm:px-6">
        <strong className="font-semibold">Demostración académica.</strong> Datos ficticios, sin
        conexión institucional y sin cálculo oficial de cuotas.
      </p>
    </div>
  );
}

export function Sitio({ children }: { children: ReactNode }) {
  const [abierto, setAbierto] = useState(false);
  const [mas, setMas] = useState(false);
  const cajaMas = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const cerrar = () => {
    setAbierto(false);
    setMas(false);
  };

  /** Cerrar los menús al cambiar de página, para que nada quede "pegado". */
  useEffect(() => {
    setAbierto(false);
    setMas(false);
  }, [pathname]);

  /** Cerrar el desplegable con Escape o al tocar fuera. */
  useEffect(() => {
    if (!mas) return;
    const fuera = (e: MouseEvent) => {
      if (!cajaMas.current?.contains(e.target as Node)) setMas(false);
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMas(false);
    };
    document.addEventListener("pointerdown", fuera);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("pointerdown", fuera);
      document.removeEventListener("keydown", tecla);
    };
  }, [mas]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <BarraAviso />
      <header className="sticky top-0 z-40 border-b-2 border-teal/60 bg-ink text-ink-foreground shadow-[0_4px_18px_rgba(10,15,30,0.45)]">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
          <Marca claro />
          <nav className="hidden items-center gap-2 lg:flex">
            {NAV.map((n, i) => (
              <Link key={n.to} to={n.to} className={ENLACE_BASE}>
                <span className="font-mono text-[10px] font-semibold text-teal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {n.etiqueta}
              </Link>
            ))}
            <div className="relative" ref={cajaMas}>
              <button
                type="button"
                onClick={() => setMas((v) => !v)}
                aria-expanded={mas}
                aria-haspopup="menu"
                className={cn(
                  "flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium text-ink-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-teal/70",
                  mas
                    ? "border-teal bg-teal/15 text-teal"
                    : "border-white/20 bg-white/5 hover:border-teal/70 hover:bg-white/10",
                )}
              >
                <span className="font-mono text-[10px] font-semibold text-teal">03</span>
                El proyecto
                <ChevronDown className={cn("h-4 w-4 transition-transform", mas && "rotate-180")} />
              </button>
              {mas && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-1 w-64 rounded-md border border-white/20 bg-ink p-1.5 shadow-xl"
                >
                  {NAV_MAS.map((n, i) => (
                    <Link
                      key={n.to}
                      to={n.to}
                      role="menuitem"
                      onClick={cerrar}
                      className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm text-ink-foreground/80 outline-none transition-colors hover:bg-white/10 hover:text-ink-foreground focus-visible:bg-white/10 data-[status=active]:bg-teal/15 data-[status=active]:text-teal"
                    >
                      <span className="font-mono text-[10px] font-semibold text-teal">
                        {String(i + 4).padStart(2, "0")}
                      </span>
                      {n.etiqueta}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              to="/demo/cargar"
              className="ml-1 rounded-md bg-teal px-4 py-2 text-sm font-semibold text-teal-foreground outline-none transition-colors hover:bg-teal/85 focus-visible:ring-2 focus-visible:ring-teal/70"
            >
              Probar la demo
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-sm border border-white/20 lg:hidden"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={abierto}
          >
            {abierto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {abierto && (
          <nav className="space-y-2 border-t border-white/10 px-4 py-3 lg:hidden">
            {NAV.map((n, i) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={cerrar}
                className="flex items-center gap-3 rounded-md border border-white/25 bg-white/5 px-3 py-2.5 text-sm font-medium text-ink-foreground data-[status=active]:border-teal data-[status=active]:bg-teal data-[status=active]:text-teal-foreground"
              >
                <span className="font-mono text-[10px] font-semibold text-teal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {n.etiqueta}
              </Link>
            ))}
            <p className="mt-3 px-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-foreground/50">
              El proyecto
            </p>
            {NAV_MAS.map((n, i) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={cerrar}
                className="flex items-center gap-3 rounded-md border border-white/25 bg-white/5 px-3 py-2.5 text-sm text-ink-foreground data-[status=active]:border-teal data-[status=active]:bg-teal data-[status=active]:text-teal-foreground"
              >
                <span className="font-mono text-[10px] font-semibold text-teal">
                  {String(i + 4).padStart(2, "0")}
                </span>
                {n.etiqueta}
              </Link>
            ))}
            <Link
              to="/demo/cargar"
              onClick={cerrar}
              className="mt-3 block rounded-md bg-teal px-3 py-2.5 text-center text-sm font-semibold text-teal-foreground"
            >
              Probar la demo
            </Link>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-16 border-t-2 border-teal/60 bg-ink text-ink-foreground">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Marca claro />
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-foreground/70">{AVISO_MVP}</p>
              <Link
                to="/demo/cargar"
                className="mt-5 inline-block rounded-md bg-teal px-4 py-2.5 text-sm font-semibold text-teal-foreground transition-colors hover:bg-teal/80"
              >
                Probar la demo
              </Link>
            </div>
            <nav aria-label="Secciones del sitio">
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-teal">
                Secciones
              </h3>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1">
                {NAV_TODO.map((n, i) => (
                  <li key={n.to}>
                    <Link
                      to={n.to}
                      className="group flex items-center gap-2.5 rounded-sm px-1 py-1.5 text-sm text-ink-foreground/70 transition-colors hover:text-ink-foreground"
                    >
                      <span className="font-mono text-[10px] font-semibold text-teal/70 transition-colors group-hover:text-teal">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {n.etiqueta}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-teal">
                Equipo del proyecto
              </h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {EQUIPO.map((p) => (
                  <li key={p.nombre} className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-sm border border-white/15 bg-white/5 font-mono text-[11px] font-semibold text-teal"
                    >
                      {p.iniciales}
                    </span>
                    <span className="min-w-0 leading-tight">
                      <span className="block truncate text-sm font-medium text-ink-foreground">{p.nombre}</span>
                      <span className="mt-0.5 block text-xs text-ink-foreground/60">{p.rol}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-ink-foreground/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>
              Proyecto independiente de demostración. No suplanta ni representa a la Caja de Seguro
              Social ni a ninguna entidad pública de la República de Panamá.
            </p>
            <p className="shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-foreground/40">
              Caso 7 · MVP académico
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function Seccion({
  titulo,
  descripcion,
  eyebrow,
  children,
  className,
}: {
  titulo: string;
  descripcion?: string;
  eyebrow?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mx-auto max-w-7xl px-4 py-12 sm:px-6", className)}>
      <div className="max-w-3xl">
        {eyebrow && (
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-teal">{eyebrow}</p>
        )}
        <h2 className="text-2xl font-semibold sm:text-3xl">{titulo}</h2>
        {descripcion && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{descripcion}</p>}
      </div>
      {children && <div className="mt-8">{children}</div>}
    </section>
  );
}

export function Nota({ tono = "info", children }: { tono?: "info" | "alerta" | "legal"; children: ReactNode }) {
  const estilos = {
    info: "border-teal/40 bg-teal/10 text-foreground",
    alerta: "border-estado-alerta/40 bg-estado-alerta/10 text-foreground",
    legal: "border-border bg-surface-2 text-muted-foreground",
  } as const;
  return (
    <div className={cn("rounded-sm border p-4 text-sm leading-relaxed", estilos[tono])}>{children}</div>
  );
}
