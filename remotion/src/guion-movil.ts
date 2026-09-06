// Generado automáticamente. No editar a mano.
export type LineaGuion = { texto: string; inicio: number; dur: number };
export type EscenaGuion = { id: string; inicio: number; dur: number; lineas: LineaGuion[] };

export const AUDIO = "audio/movil.mp3";
export const TOTAL = 5229;
export const ESCENAS: EscenaGuion[] = [
  {
    "id": "intro",
    "inicio": 18,
    "dur": 305,
    "lineas": [
      {
        "texto": "Prevalida Planillas, desde el teléfono, de principio a fin.",
        "inicio": 18,
        "dur": 149
      },
      {
        "texto": "Vamos a recorrer la aplicación tal como se ve en la pantalla, paso por paso.",
        "inicio": 179,
        "dur": 144
      }
    ]
  },
  {
    "id": "sesion",
    "inicio": 345,
    "dur": 369,
    "lineas": [
      {
        "texto": "Paso uno: abrir la sesión de trabajo.",
        "inicio": 345,
        "dur": 119
      },
      {
        "texto": "La aplicación muestra su rol y el empleador, que lo fija el servidor y no se puede cambiar desde el teléfono.",
        "inicio": 476,
        "dur": 238
      }
    ]
  },
  {
    "id": "cargar",
    "inicio": 736,
    "dur": 315,
    "lineas": [
      {
        "texto": "Paso dos: elija el periodo y suba la planilla desde el teléfono.",
        "inicio": 736,
        "dur": 189
      },
      {
        "texto": "La demostración usa datos ficticios de trece trabajadores.",
        "inicio": 937,
        "dur": 114
      }
    ]
  },
  {
    "id": "validando",
    "inicio": 1073,
    "dur": 940,
    "lineas": [
      {
        "texto": "Paso tres: al enviarla, la pantalla muestra el análisis en vivo.",
        "inicio": 1073,
        "dur": 168
      },
      {
        "texto": "Primero la recepción segura y la limpieza de celdas.",
        "inicio": 1253,
        "dur": 144
      },
      {
        "texto": "Luego los seis niveles de reglas, uno por uno: estructura del archivo, identidad del trabajador, datos laborales, salarios y viáticos, consistencia interna e historial del empleador.",
        "inicio": 1409,
        "dur": 415
      },
      {
        "texto": "Al terminar, el evento queda anotado en la bitácora y aparece el resultado.",
        "inicio": 1836,
        "dur": 177
      }
    ]
  },
  {
    "id": "resultado",
    "inicio": 2035,
    "dur": 429,
    "lineas": [
      {
        "texto": "Paso cuatro: el resultado separa lo que bloquea de lo que solo hay que revisar.",
        "inicio": 2035,
        "dur": 210
      },
      {
        "texto": "Seis errores hay que corregirlos; cinco alertas se confirman con un motivo escrito.",
        "inicio": 2257,
        "dur": 207
      }
    ]
  },
  {
    "id": "corregir",
    "inicio": 2486,
    "dur": 778,
    "lineas": [
      {
        "texto": "Toque un hallazgo y verá la fila, la columna, el valor que llegó y el valor que se espera.",
        "inicio": 2486,
        "dur": 195
      },
      {
        "texto": "Fila cuatro, número de documento: dice ocho, guion, setecientos cuarenta y dos, guion, ciento dieciocho, y el tipo declarado es pasaporte.",
        "inicio": 2693,
        "dur": 350
      },
      {
        "texto": "Cámbielo a cédula, o escriba el pasaporte real sin guiones, y guarde la fila.",
        "inicio": 3055,
        "dur": 209
      }
    ]
  },
  {
    "id": "reenviar",
    "inicio": 3286,
    "dur": 207,
    "lineas": [
      {
        "texto": "Paso cinco: envíe la corrección como una versión nueva. La anterior se conserva completa.",
        "inicio": 3286,
        "dur": 207
      }
    ]
  },
  {
    "id": "listo",
    "inicio": 3515,
    "dur": 197,
    "lineas": [
      {
        "texto": "Vuelva a validar y, cuando no quede ningún error, la planilla queda prevalidada.",
        "inicio": 3515,
        "dur": 197
      }
    ]
  },
  {
    "id": "ataques",
    "inicio": 3734,
    "dur": 503,
    "lineas": [
      {
        "texto": "Falta lo más importante: cómo protegemos sus datos.",
        "inicio": 3734,
        "dur": 132
      },
      {
        "texto": "Alguien podría pedir la planilla de otra empresa, subir un archivo con fórmulas escondidas, repetir un envío para duplicarlo, o intentar adivinar identificadores.",
        "inicio": 3878,
        "dur": 359
      }
    ]
  },
  {
    "id": "defensas",
    "inicio": 4259,
    "dur": 930,
    "lineas": [
      {
        "texto": "Por eso el empleador lo fija el servidor, cada celda se limpia al recibirla, y solo se acepta texto separado por comas con límite de tamaño.",
        "inicio": 4259,
        "dur": 323
      },
      {
        "texto": "La llave de idempotencia evita duplicados, los identificadores son de ciento veintiocho bits, ninguna versión se sobrescribe y toda acción queda en la bitácora.",
        "inicio": 4594,
        "dur": 366
      },
      {
        "texto": "Prevalida Planillas: su planilla revisada y sus datos protegidos, desde el teléfono.",
        "inicio": 4972,
        "dur": 217
      }
    ]
  }
];

export const escena = (id: string): EscenaGuion => {
  const e = ESCENAS.find((x) => x.id === id);
  if (!e) throw new Error("escena desconocida: " + id);
  return e;
};
