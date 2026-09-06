import { createFileRoute } from "@tanstack/react-router";
import { Nota, Seccion, Sitio } from "@/components/sitio/Sitio";
import { MATRIZ_NORMATIVA } from "@/lib/prevalidacion/reglas";
import { AVISO_MVP, AVISO_PREVALIDADA } from "@/lib/prevalidacion/seguridad";

export const Route = createFileRoute("/normativa")({
  head: () => ({
    meta: [
      { title: "Matriz de cumplimiento y marco normativo — Caso 7" },
      {
        name: "description",
        content:
          "Referencias al marco panameño aplicable: Ley 51 de 2005, Ley 81 de 2019, Decreto Ejecutivo 285 de 2021 y Ley 83 de 2012, con su aplicación al producto.",
      },
      { property: "og:title", content: "Matriz de cumplimiento y marco normativo" },
      {
        property: "og:description",
        content: "Norma, tema, aplicación y reglas asociadas, con límites explícitos del MVP.",
      },
    ],
  }),
  component: Normativa,
});

const MARCO = [
  {
    norma: "Ley 51 de 2005, orgánica de la Caja de Seguro Social, y sus modificaciones vigentes",
    proposito:
      "Establece obligaciones de los empleadores respecto de las planillas, la exactitud de la información declarada, la corrección de inconsistencias y las facultades de revisión y fiscalización de la institución.",
    aplicacion:
      "Sustenta el propósito del producto: mejorar la exactitud antes de la presentación formal. La plataforma no ejerce ninguna facultad institucional ni sustituye la revisión oficial.",
    limite:
      "El proyecto no interpreta de forma definitiva la norma ni califica infracciones; toda regla con efectos jurídicos requiere validación del área legal competente.",
  },
  {
    norma: "Ley 81 de 2019, sobre protección de datos personales",
    proposito:
      "Regula el tratamiento de datos personales en la República de Panamá, con principios de licitud, finalidad, proporcionalidad, seguridad y confidencialidad.",
    aplicacion:
      "El MVP aplica minimización, enmascaramiento en listados, aislamiento por empleador y uso exclusivo de datos sintéticos. No se recolectan datos de personas identificadas o identificables.",
    limite:
      "Un despliegue real requeriría análisis de impacto, base de licitud, acuerdos de tratamiento y controles adicionales verificados por el responsable de protección de datos.",
  },
  {
    norma: "Decreto Ejecutivo 285 de 2021",
    proposito: "Desarrolla y reglamenta aspectos del régimen de protección de datos personales.",
    aplicacion:
      "Orienta la definición de responsabilidades, medidas de seguridad y trazabilidad de accesos incorporadas como controles de diseño en la demostración.",
    limite: "Su cumplimiento efectivo solo puede evaluarse sobre una implementación productiva auditada.",
  },
  {
    norma: "Ley 83 de 2012, sobre uso de medios electrónicos en trámites gubernamentales",
    proposito:
      "Habilita y regula la utilización de medios electrónicos para la gestión de trámites ante entidades públicas.",
    aplicacion:
      "Marco de referencia para la interoperabilidad por servicios y el intercambio electrónico de información entre el empleador y la entidad.",
    limite:
      "El MVP no implementa firma electrónica ni constituye un canal oficial de presentación de trámites.",
  },
  {
    norma: "Principios constitucionales y de derecho administrativo aplicables",
    proposito:
      "Legalidad, debido proceso, presunción de buena fe, motivación de los actos y competencia de la autoridad.",
    aplicacion:
      "La plataforma describe hallazgos técnicos y diferencias, permite justificación del administrado y evita atribuir conductas sancionables de forma automática.",
    limite:
      "La calificación de una infracción y sus consecuencias corresponden exclusivamente a la autoridad competente.",
  },
];

function Normativa() {
  return (
    <Sitio>
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">Cumplimiento</p>
          <h1 className="mt-2 text-3xl font-semibold">Marco normativo y matriz de cumplimiento</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Referencias prudentes al marco panameño relevante para el propósito del producto. Se indica
            qué aporta cada norma al diseño y, con la misma claridad, qué queda fuera del alcance de esta
            demostración.
          </p>
        </div>
      </div>

      <Seccion eyebrow="Alcance" titulo="Lo que este documento no afirma">
        <div className="grid gap-3 md:grid-cols-3">
          <Nota tono="alerta">{AVISO_PREVALIDADA}</Nota>
          <Nota tono="alerta">{AVISO_MVP}</Nota>
          <Nota tono="legal">
            No se declara certificación, homologación, cumplimiento legal definitivo, conexión con
            sistemas institucionales ni cálculo oficial de cuotas, recargos o intereses.
          </Nota>
        </div>
      </Seccion>

      <div className="border-y border-border bg-surface-2">
        <Seccion eyebrow="Marco aplicable" titulo="Normas de referencia y su aplicación al producto">
          <div className="grid gap-4">
            {MARCO.map((m) => (
              <article key={m.norma} className="rounded-sm border border-border bg-surface p-6">
                <h3 className="text-base font-semibold">{m.norma}</h3>
                <dl className="mt-4 grid gap-4 text-sm md:grid-cols-3">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">Propósito</dt>
                    <dd className="mt-1 leading-relaxed">{m.proposito}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">Aplicación en el MVP</dt>
                    <dd className="mt-1 leading-relaxed">{m.aplicacion}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">Límite declarado</dt>
                    <dd className="mt-1 leading-relaxed text-muted-foreground">{m.limite}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            Las citas normativas deben contrastarse siempre con el texto oficial vigente publicado por las
            fuentes competentes. Cuando una regla afecte derechos, obligaciones o sanciones, debe validarse
            con el área institucional o legal correspondiente antes de aplicarse.
          </p>
        </Seccion>
      </div>

      <Seccion
        eyebrow="Trazabilidad"
        titulo="Matriz norma → regla implementada"
        descripcion="Relación entre el fundamento documentado y las reglas configuradas en el catálogo del MVP."
      >
        <div className="overflow-x-auto rounded-sm border border-border bg-surface">
          <table className="w-full min-w-[48rem] text-sm">
            <thead className="border-b border-border bg-surface-2 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Norma o referencia</th>
                <th className="px-4 py-3 font-medium">Tema</th>
                <th className="px-4 py-3 font-medium">Aplicación</th>
                <th className="px-4 py-3 font-medium">Reglas asociadas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MATRIZ_NORMATIVA.map((m) => (
                <tr key={m.norma}>
                  <td className="px-4 py-3 text-xs font-medium">{m.norma}</td>
                  <td className="px-4 py-3 text-xs">{m.tema}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{m.aplicacion}</td>
                  <td className="px-4 py-3 font-mono text-[11px]">
                    {m.reglas.length ? m.reglas.join(", ") : "Control transversal"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Seccion>
    </Sitio>
  );
}
