import { createFileRoute } from "@tanstack/react-router";
import { Nota, Seccion, Sitio } from "@/components/sitio/Sitio";
import { AVISO_DATOS, AVISO_MVP, AVISO_PREVALIDADA } from "@/lib/prevalidacion/seguridad";

export const Route = createFileRoute("/equipo")({
  head: () => ({
    meta: [
      { title: "Equipo del Caso 7 — CSS y empleadores" },
      {
        name: "description",
        content:
          "Créditos y responsabilidades: Pablo Sánchez en backend y arquitectura, Alberto Davis en seguridad y DevOps, Daniel Domínguez en producto, negocio y calidad.",
      },
      { property: "og:title", content: "Equipo del Caso 7" },
      { property: "og:description", content: "Roles, responsabilidades y límites declarados del proyecto." },
    ],
  }),
  component: Equipo,
});

const EQUIPO = [
  {
    nombre: "Pablo Sánchez",
    rol: "Backend en Python y arquitectura técnica",
    iniciales: "PS",
    aportes: [
      "Diseño de las dos APIs lógicas y sus contratos.",
      "Motor de reglas por niveles y modelo de hallazgos explicables.",
      "Contrato de datos CSV versionado y estrategia de versionado de planillas.",
    ],
  },
  {
    nombre: "Alberto Davis",
    rol: "Seguridad y DevOps",
    iniciales: "AD",
    aportes: [
      "Controles de carga: tipo, tamaño, sanitización y mensajes de error seguros.",
      "Identificadores no predecibles, aislamiento por empleador y bitácora de auditoría.",
      "Enfoque de automatización de entornos con Ansible y plan de revisiones con Nikto.",
    ],
  },
  {
    nombre: "Daniel Domínguez",
    rol: "Product Owner, análisis de negocio, Scrum Master y calidad",
    iniciales: "DD",
    aportes: [
      "Definición del alcance del Sprint 1 y priorización del backlog.",
      "Matriz de cumplimiento, redacción prudente de hallazgos y criterios de aceptación.",
      "Casos de prueba del catálogo de reglas y plan de pruebas de carga con JMeter.",
    ],
  },
];

function Equipo() {
  return (
    <Sitio>
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">Equipo</p>
          <h1 className="mt-2 text-3xl font-semibold">Quiénes construyen el Caso 7</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Tres roles complementarios: producto y calidad, arquitectura y backend, seguridad y
            operaciones. El trabajo se organiza por sprints con criterios de aceptación verificables.
          </p>
        </div>
      </div>

      <Seccion eyebrow="Créditos" titulo="Responsabilidades por integrante">
        <div className="grid gap-4 md:grid-cols-3">
          {EQUIPO.map((p) => (
            <article key={p.nombre} className="bisel-superior rounded-sm border border-border bg-surface p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary font-mono text-sm font-semibold text-primary-foreground">
                {p.iniciales}
              </div>
              <h2 className="mt-4 text-lg font-semibold">{p.nombre}</h2>
              <p className="mt-1 text-sm text-teal">{p.rol}</p>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
                {p.aportes.map((a) => (
                  <li key={a} className="flex gap-2">
                    <span aria-hidden className="text-teal">
                      ·
                    </span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Seccion>

      <div className="border-t border-border bg-surface-2">
        <Seccion eyebrow="Transparencia" titulo="Límites declarados del proyecto">
          <div className="grid gap-3 md:grid-cols-3">
            <Nota tono="alerta">{AVISO_PREVALIDADA}</Nota>
            <Nota tono="legal">{AVISO_DATOS}</Nota>
            <Nota tono="legal">{AVISO_MVP}</Nota>
          </div>
        </Seccion>
      </div>
    </Sitio>
  );
}
