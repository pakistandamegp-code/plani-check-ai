// Generado automáticamente. No editar a mano.
export type LineaGuion = { texto: string; inicio: number; dur: number };
export type EscenaGuion = { id: string; inicio: number; dur: number; lineas: LineaGuion[] };

export const AUDIO = "audio/tutorial.mp3";
export const TOTAL = 7575;
export const ESCENAS: EscenaGuion[] = [
  {
    "id": "intro",
    "inicio": 18,
    "dur": 495,
    "lineas": [
      {
        "texto": "Prevalida Planillas: la plataforma que revisa una planilla antes de presentarla.",
        "inicio": 18,
        "dur": 207
      },
      {
        "texto": "Funciona con dos interfaces de programación, y en este video verá las dos, cómo se protegen y cómo se corrige un dato mal puesto.",
        "inicio": 237,
        "dur": 276
      }
    ]
  },
  {
    "id": "apis",
    "inicio": 535,
    "dur": 1055,
    "lineas": [
      {
        "texto": "La primera es la interfaz de recepción y gestión: abre la sesión, fija el empleador, recibe el archivo, guarda cada versión y anota todo en la bitácora.",
        "inicio": 535,
        "dur": 346
      },
      {
        "texto": "La segunda es la interfaz de validación y resultados: ejecuta las reglas de los niveles A a F, entrega los hallazgos explicados y calcula el estado de la planilla.",
        "inicio": 893,
        "dur": 386
      },
      {
        "texto": "La primera nunca juzga los datos y la segunda nunca los modifica: cada una tiene una sola responsabilidad.",
        "inicio": 1291,
        "dur": 299
      }
    ]
  },
  {
    "id": "seguridad",
    "inicio": 1612,
    "dur": 1159,
    "lineas": [
      {
        "texto": "Las dos interfaces están protegidas con cinco controles.",
        "inicio": 1612,
        "dur": 152
      },
      {
        "texto": "El empleador lo fija el servidor según la sesión, así nadie puede pedir la planilla de otra empresa.",
        "inicio": 1776,
        "dur": 228
      },
      {
        "texto": "El archivo se acepta solo como texto separado por comas, con límite de tamaño, y cada celda se limpia de fórmulas y de código antes de guardarse.",
        "inicio": 2016,
        "dur": 310
      },
      {
        "texto": "Cada envío lleva una llave de idempotencia, los identificadores son de ciento veintiocho bits, y toda acción queda registrada con actor, fecha y resultado.",
        "inicio": 2338,
        "dur": 433
      }
    ]
  },
  {
    "id": "paso1",
    "inicio": 2793,
    "dur": 558,
    "lineas": [
      {
        "texto": "Paso uno: abra la sesión de trabajo.",
        "inicio": 2793,
        "dur": 104
      },
      {
        "texto": "El sistema devuelve el identificador de la sesión, su rol y el empleador que le corresponde.",
        "inicio": 2909,
        "dur": 217
      },
      {
        "texto": "Guarde ese identificador. El empleador lo fija el servidor, nunca quien envía la planilla.",
        "inicio": 3138,
        "dur": 213
      }
    ]
  },
  {
    "id": "paso2",
    "inicio": 3373,
    "dur": 595,
    "lineas": [
      {
        "texto": "Paso dos: envíe la planilla en un archivo de valores separados por comas.",
        "inicio": 3373,
        "dur": 155
      },
      {
        "texto": "El sistema responde con la solicitud, la planilla y la versión uno en estado recibida.",
        "inicio": 3540,
        "dur": 206
      },
      {
        "texto": "Use la plantilla oficial sin renombrar columnas y conserve el identificador de la planilla.",
        "inicio": 3758,
        "dur": 210
      }
    ]
  },
  {
    "id": "paso3",
    "inicio": 3990,
    "dur": 689,
    "lineas": [
      {
        "texto": "Paso tres: ejecute la validación con las reglas de los niveles A a F.",
        "inicio": 3990,
        "dur": 216
      },
      {
        "texto": "El resumen muestra seis errores bloqueantes, cinco alertas y dos registros válidos.",
        "inicio": 4218,
        "dur": 233
      },
      {
        "texto": "Si el estado dice con errores, la planilla todavía no se puede dar por prevalidada.",
        "inicio": 4463,
        "dur": 216
      }
    ]
  },
  {
    "id": "paso4",
    "inicio": 4701,
    "dur": 604,
    "lineas": [
      {
        "texto": "Paso cuatro: lea los hallazgos, uno por uno.",
        "inicio": 4701,
        "dur": 141
      },
      {
        "texto": "Cada hallazgo indica la fila, el dato revisado, el valor recibido y la regla aplicada.",
        "inicio": 4854,
        "dur": 233
      },
      {
        "texto": "Un error se corrige. Una alerta se puede confirmar con una justificación escrita.",
        "inicio": 5099,
        "dur": 206
      }
    ]
  },
  {
    "id": "correccion",
    "inicio": 5327,
    "dur": 1222,
    "lineas": [
      {
        "texto": "Veamos exactamente qué dato está mal y cómo se arregla.",
        "inicio": 5327,
        "dur": 152
      },
      {
        "texto": "En la fila cuatro, la columna número de documento dice ocho, guion, setecientos cuarenta y dos, guion, ciento dieciocho, pero el tipo declarado es pasaporte.",
        "inicio": 5491,
        "dur": 360
      },
      {
        "texto": "Se corrige de una de dos maneras: cambie el tipo a cédula, o escriba el número de pasaporte real, con letras y números y sin guiones.",
        "inicio": 5863,
        "dur": 321
      },
      {
        "texto": "En la fila dos, los viáticos de cuatrocientos veinte balboas pasan el veinticinco por ciento del sueldo: eso no es un error, es una alerta, y se confirma escribiendo el motivo.",
        "inicio": 6196,
        "dur": 353
      }
    ]
  },
  {
    "id": "paso5",
    "inicio": 6571,
    "dur": 516,
    "lineas": [
      {
        "texto": "Paso cinco: corrija los datos y cree una nueva versión de la planilla.",
        "inicio": 6571,
        "dur": 162
      },
      {
        "texto": "La versión anterior nunca se sobrescribe, y la nueva queda lista para revalidarse.",
        "inicio": 6745,
        "dur": 198
      },
      {
        "texto": "Repita el paso tres hasta que la planilla quede prevalidada.",
        "inicio": 6955,
        "dur": 132
      }
    ]
  },
  {
    "id": "cierre",
    "inicio": 7109,
    "dur": 426,
    "lineas": [
      {
        "texto": "Corrija, revalide y repita hasta llegar al estado prevalidada.",
        "inicio": 7109,
        "dur": 184
      },
      {
        "texto": "Dos interfaces, cinco controles de seguridad y cada error explicado con el paso exacto para arreglarlo.",
        "inicio": 7305,
        "dur": 230
      }
    ]
  }
];

export const escena = (id: string): EscenaGuion => {
  const e = ESCENAS.find((x) => x.id === id);
  if (!e) throw new Error("escena desconocida: " + id);
  return e;
};
