// Generado automáticamente. No editar a mano.
export type LineaGuion = { texto: string; inicio: number; dur: number };
export type EscenaGuion = { id: string; inicio: number; dur: number; lineas: LineaGuion[] };

export const AUDIO = "audio/tutorial.mp3";
export const TOTAL = 9535;
export const ESCENAS: EscenaGuion[] = [
  {
    "id": "intro",
    "inicio": 18,
    "dur": 486,
    "lineas": [
      {
        "texto": "Prevalida Planillas: la plataforma que revisa una planilla antes de presentarla.",
        "inicio": 18,
        "dur": 180
      },
      {
        "texto": "Funciona con dos interfaces de programación, y en este video verá las dos, cómo se protegen y cómo se corrige un dato mal puesto.",
        "inicio": 210,
        "dur": 294
      }
    ]
  },
  {
    "id": "apis",
    "inicio": 526,
    "dur": 1007,
    "lineas": [
      {
        "texto": "La primera es la interfaz de recepción y gestión: abre la sesión, fija el empleador, recibe el archivo, guarda cada versión y anota todo en la bitácora.",
        "inicio": 526,
        "dur": 356
      },
      {
        "texto": "La segunda es la interfaz de validación y resultados: ejecuta las reglas de los niveles A a F, entrega los hallazgos explicados y calcula el estado de la planilla.",
        "inicio": 894,
        "dur": 382
      },
      {
        "texto": "La primera nunca juzga los datos y la segunda nunca los modifica: cada una tiene una sola responsabilidad.",
        "inicio": 1288,
        "dur": 245
      }
    ]
  },
  {
    "id": "seguridad",
    "inicio": 1555,
    "dur": 1097,
    "lineas": [
      {
        "texto": "Las dos interfaces están protegidas con cinco controles.",
        "inicio": 1555,
        "dur": 140
      },
      {
        "texto": "El empleador lo fija el servidor según la sesión, así nadie puede pedir la planilla de otra empresa.",
        "inicio": 1707,
        "dur": 230
      },
      {
        "texto": "El archivo se acepta solo como texto separado por comas, con límite de tamaño, y cada celda se limpia de fórmulas y de código antes de guardarse.",
        "inicio": 1949,
        "dur": 335
      },
      {
        "texto": "Cada envío lleva una llave de idempotencia, los identificadores son de ciento veintiocho bits, y toda acción queda registrada con actor, fecha y resultado.",
        "inicio": 2296,
        "dur": 356
      }
    ]
  },
  {
    "id": "paso1",
    "inicio": 2674,
    "dur": 577,
    "lineas": [
      {
        "texto": "Paso uno: abra la sesión de trabajo.",
        "inicio": 2674,
        "dur": 95
      },
      {
        "texto": "El sistema devuelve el identificador de la sesión, su rol y el empleador que le corresponde.",
        "inicio": 2781,
        "dur": 220
      },
      {
        "texto": "Guarde ese identificador. El empleador lo fija el servidor, nunca quien envía la planilla.",
        "inicio": 3013,
        "dur": 238
      }
    ]
  },
  {
    "id": "paso2",
    "inicio": 3273,
    "dur": 622,
    "lineas": [
      {
        "texto": "Paso dos: envíe la planilla en un archivo de valores separados por comas.",
        "inicio": 3273,
        "dur": 179
      },
      {
        "texto": "El sistema responde con la solicitud, la planilla y la versión uno en estado recibida.",
        "inicio": 3464,
        "dur": 212
      },
      {
        "texto": "Use la plantilla oficial sin renombrar columnas y conserve el identificador de la planilla.",
        "inicio": 3688,
        "dur": 207
      }
    ]
  },
  {
    "id": "paso3",
    "inicio": 3917,
    "dur": 587,
    "lineas": [
      {
        "texto": "Paso tres: ejecute la validación con las reglas de los niveles A a F.",
        "inicio": 3917,
        "dur": 167
      },
      {
        "texto": "El resumen muestra seis errores bloqueantes, cinco alertas y dos registros válidos.",
        "inicio": 4096,
        "dur": 216
      },
      {
        "texto": "Si el estado dice con errores, la planilla todavía no se puede dar por prevalidada.",
        "inicio": 4324,
        "dur": 180
      }
    ]
  },
  {
    "id": "paso4",
    "inicio": 4526,
    "dur": 544,
    "lineas": [
      {
        "texto": "Paso cuatro: lea los hallazgos, uno por uno.",
        "inicio": 4526,
        "dur": 117
      },
      {
        "texto": "Cada hallazgo indica la fila, el dato revisado, el valor recibido y la regla aplicada.",
        "inicio": 4655,
        "dur": 217
      },
      {
        "texto": "Un error se corrige. Una alerta se puede confirmar con una justificación escrita.",
        "inicio": 4884,
        "dur": 186
      }
    ]
  },
  {
    "id": "correccion",
    "inicio": 5092,
    "dur": 1263,
    "lineas": [
      {
        "texto": "Veamos exactamente qué dato está mal y cómo se arregla.",
        "inicio": 5092,
        "dur": 134
      },
      {
        "texto": "En la fila cuatro, la columna número de documento dice ocho, guion, setecientos cuarenta y dos, guion, ciento dieciocho, pero el tipo declarado es pasaporte.",
        "inicio": 5238,
        "dur": 378
      },
      {
        "texto": "Se corrige de una de dos maneras: cambie el tipo a cédula, o escriba el número de pasaporte real, con letras y números y sin guiones.",
        "inicio": 5628,
        "dur": 338
      },
      {
        "texto": "En la fila dos, los viáticos de cuatrocientos veinte balboas pasan el veinticinco por ciento del sueldo: eso no es un error, es una alerta, y se confirma escribiendo el motivo.",
        "inicio": 5978,
        "dur": 377
      }
    ]
  },
  {
    "id": "paso5",
    "inicio": 6377,
    "dur": 523,
    "lineas": [
      {
        "texto": "Paso cinco: corrija los datos y cree una nueva versión de la planilla.",
        "inicio": 6377,
        "dur": 156
      },
      {
        "texto": "La versión anterior nunca se sobrescribe, y la nueva queda lista para revalidarse.",
        "inicio": 6545,
        "dur": 191
      },
      {
        "texto": "Repita el paso tres hasta que la planilla quede prevalidada.",
        "inicio": 6748,
        "dur": 152
      }
    ]
  },
  {
    "id": "ataques",
    "inicio": 6922,
    "dur": 737,
    "lineas": [
      {
        "texto": "Antes de cerrar, veamos de qué nos estamos defendiendo.",
        "inicio": 6922,
        "dur": 137
      },
      {
        "texto": "Un atacante podría pedir la planilla de otra empresa, subir un archivo con fórmulas escondidas, o repetir el mismo envío para duplicar registros.",
        "inicio": 7071,
        "dur": 300
      },
      {
        "texto": "También podría intentar adivinar identificadores, alterar una versión ya presentada, o saturar el sistema con cargas enormes.",
        "inicio": 7383,
        "dur": 276
      }
    ]
  },
  {
    "id": "defensas",
    "inicio": 7681,
    "dur": 1110,
    "lineas": [
      {
        "texto": "Contra cada intento hay una defensa concreta.",
        "inicio": 7681,
        "dur": 107
      },
      {
        "texto": "El empleador sale de la sesión del servidor, el archivo se acepta solo como texto separado por comas con límite de tamaño, y cada celda se limpia antes de guardarse.",
        "inicio": 7800,
        "dur": 359
      },
      {
        "texto": "La llave de idempotencia impide duplicar un envío, los identificadores de ciento veintiocho bits no se pueden adivinar, y ninguna versión se sobrescribe.",
        "inicio": 8171,
        "dur": 348
      },
      {
        "texto": "Y si algo pasara, la bitácora guarda actor, fecha, acción y resultado, así se puede reconstruir todo lo ocurrido.",
        "inicio": 8531,
        "dur": 260
      }
    ]
  },
  {
    "id": "cierre",
    "inicio": 8813,
    "dur": 682,
    "lineas": [
      {
        "texto": "Corrija, revalide y repita hasta llegar al estado prevalidada.",
        "inicio": 8813,
        "dur": 159
      },
      {
        "texto": "Dos interfaces, seis niveles de reglas, cinco controles de seguridad y cada error explicado con el paso exacto para arreglarlo.",
        "inicio": 8984,
        "dur": 289
      },
      {
        "texto": "Sus datos protegidos de punta a punta, en línea con la ley ochenta y uno de dos mil diecinueve.",
        "inicio": 9285,
        "dur": 210
      }
    ]
  }
];

export const escena = (id: string): EscenaGuion => {
  const e = ESCENAS.find((x) => x.id === id);
  if (!e) throw new Error("escena desconocida: " + id);
  return e;
};
