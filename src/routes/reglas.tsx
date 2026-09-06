import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Nota, Seccion, Sitio } from "@/components/sitio/Sitio";
import { CASOS_PRUEBA, DICCIONARIO, NIVELES, REGLAS } from "@/lib/prevalidacion/reglas";

export const Route = createFileRoute("/reglas")({
  head: () => ({
    meta: [
      { title: "Catálogo de reglas y diccionario de datos — Caso 7" },
      {
        name: "description",
        content:
          "Reglas de validación por nivel con condición, fuente, fundamento, severidad y vigencia, más el diccionario de campos del CSV.",
      },
      { property: "og:title", content: "Catálogo de reglas y diccionario de datos" },
      {
        property: "og:description",
        content: "Reglas explicables por nivel, diccionario de datos y casos de prueba del Sprint 1.",
      },
    ],
  }),
  component: Reglas,
});

function Reglas() {
  const [nivel, setNivel] = useState<string>("TODOS");
  const lista = REGLAS.filter((r) => nivel === "TODOS" || r.nivel === nivel);

  return (
    <Sitio>
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">Especificación</p>
          <h1 className="mt-2 text-3xl font-semibold">Catálogo de reglas y diccionario de datos</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Cada regla declara su código, versión, campos evaluados, condición, fuente, fundamento,
            resultado, acción esperada y vigencia. Una regla que depende de una fuente no disponible se
            declara limitada o pendiente, en lugar de simular una verificación que la plataforma no puede
            realizar.
          </p>
        </div>
      </div>

      <Seccion eyebrow="Niveles" titulo="Organización del motor de validación">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {NIVELES.map((n) => (
            <div key={n.nivel} className="rounded-sm border border-border bg-surface p-5">
              <span className="font-mono text-xs font-semibold text-teal">NIVEL {n.nivel}</span>
              <h3 className="mt-1 text-base font-semibold">{n.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{n.objetivo}</p>
            </div>
          ))}
        </div>
      </Seccion>

      <Seccion eyebrow="Catálogo" titulo="Reglas configuradas en el MVP">
        <div className="mb-5 flex flex-wrap gap-2">
          {["TODOS", ...NIVELES.map((n) => n.nivel)].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setNivel(n)}
              className={`rounded-sm border px-3 py-1.5 font-mono text-xs transition-colors ${
                nivel === n ? "border-teal bg-teal/10 text-teal" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {n === "TODOS" ? "TODOS" : `NIVEL ${n}`}
            </button>
          ))}
        </div>

        <div className="grid gap-3">
          {lista.map((r) => (
            <article key={r.codigo} className="rounded-sm border border-border bg-surface p-5">
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-muted-foreground">
                    {r.codigo} · v{r.version} · Nivel {r.nivel} · vigente desde {r.vigenciaDesde}
                  </p>
                  <h3 className="mt-1 text-base font-semibold">{r.nombre}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{r.condicion}</p>
                </div>
                <span
                  className={`inline-flex shrink-0 items-center rounded-sm border px-2 py-0.5 font-mono text-[11px] ${
                    r.resultado === "ERROR"
                      ? "border-estado-error/40 bg-estado-error/10 text-estado-error"
                      : r.resultado === "ALERTA"
                        ? "border-estado-alerta/50 bg-estado-alerta/10 text-estado-alerta"
                        : "border-estado-valido/40 bg-estado-valido/10 text-estado-valido"
                  }`}
                >
                  {r.resultado === "ERROR" ? "ERROR BLOQUEANTE" : r.resultado}
                </span>
              </div>
              <dl className="mt-4 grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <dt className="text-muted-foreground">Campos</dt>
                  <dd className="mt-0.5 font-mono">{r.campos.join(", ")}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Fuente</dt>
                  <dd className="mt-0.5">{r.fuente}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Fundamento</dt>
                  <dd className="mt-0.5">{r.fundamento}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Estado de la regla</dt>
                  <dd className="mt-0.5">{r.estadoRegla}</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-muted-foreground">Acción esperada: {r.accion}</p>
            </article>
          ))}
        </div>
      </Seccion>

      <div className="border-y border-border bg-surface-2">
        <Seccion
          eyebrow="Diccionario"
          titulo="Campos del contrato de datos CSV"
          descripcion="Estructura versionada planilla-css-v1.0. Codificación UTF-8, una fila por trabajador, fechas AAAA-MM-DD y montos decimales en balboas."
        >
          <div className="overflow-x-auto rounded-sm border border-border bg-surface">
            <table className="w-full min-w-[44rem] text-sm">
              <thead className="border-b border-border bg-surface-2 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Campo</th>
                  <th className="px-4 py-3 font-medium">Grupo</th>
                  <th className="px-4 py-3 font-medium">Tipo</th>
                  <th className="px-4 py-3 font-medium">Obligatorio</th>
                  <th className="px-4 py-3 font-medium">Tratamiento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {DICCIONARIO.map((d) => (
                  <tr key={d.campo}>
                    <td className="px-4 py-3 font-mono text-xs">{d.campo}</td>
                    <td className="px-4 py-3 text-xs">{d.grupo}</td>
                    <td className="px-4 py-3 text-xs">{d.tipo}</td>
                    <td className="px-4 py-3 text-xs">{d.obligatorio ? "Sí" : "Condicional"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{d.tratamiento}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            <Nota tono="legal">
              El archivo de referencia institucional documenta 25 rubros. Este MVP implementa un
              subconjunto representativo (salario, horas extra, décimo tercer mes, comisiones,
              bonificaciones, viáticos, prima de producción y gastos de representación) y documenta los
              demás como ampliaciones pendientes, sin inventar umbrales sin respaldo.
            </Nota>
          </div>
        </Seccion>
      </div>

      <Seccion
        eyebrow="Verificación"
        titulo="Casos de prueba preparados"
        descripcion="Cada regla prioritaria cuenta con un caso comprobable antes de considerarse cerrada."
      >
        <div className="overflow-x-auto rounded-sm border border-border bg-surface">
          <table className="w-full min-w-[40rem] text-sm">
            <thead className="border-b border-border bg-surface-2 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Caso</th>
                <th className="px-4 py-3 font-medium">Condición</th>
                <th className="px-4 py-3 font-medium">Resultado esperado</th>
                <th className="px-4 py-3 font-medium">Regla / control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {CASOS_PRUEBA.map((c) => (
                <tr key={c.caso}>
                  <td className="px-4 py-3 font-mono text-xs">{c.caso}</td>
                  <td className="px-4 py-3 text-xs">{c.condicion}</td>
                  <td className="px-4 py-3 text-xs">{c.esperado}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.regla}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Seccion>
    </Sitio>
  );
}
