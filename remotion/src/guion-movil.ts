// Generado automáticamente. No editar a mano.
export type LineaGuion = { texto: string; inicio: number; dur: number };
export type EscenaGuion = { id: string; inicio: number; dur: number; lineas: LineaGuion[] };

export const AUDIO = "audio/movil.mp3";
export const TOTAL = 3033;
export const ESCENAS: EscenaGuion[] = [
  {
    "id": "intro",
    "inicio": 18,
    "dur": 148,
    "lineas": [
      {
        "texto": "Prevalida Planillas, desde el teléfono, de principio a fin.",
        "inicio": 18,
        "dur": 148
      }
    ]
  },
  {
    "id": "apis",
    "inicio": 188,
    "dur": 532,
    "lineas": [
      {
        "texto": "Detrás hay dos interfaces: una recibe y guarda la planilla, la otra la revisa y explica los hallazgos.",
        "inicio": 188,
        "dur": 263
      },
      {
        "texto": "Sus datos van protegidos: el empleador lo fija el servidor, el archivo se limpia al recibirlo y toda acción queda registrada.",
        "inicio": 463,
        "dur": 257
      }
    ]
  },
  {
    "id": "cargar",
    "inicio": 742,
    "dur": 339,
    "lineas": [
      {
        "texto": "Primero elija la planilla del periodo y súbala desde el teléfono.",
        "inicio": 742,
        "dur": 192
      },
      {
        "texto": "La demostración usa datos ficticios de trece trabajadores.",
        "inicio": 946,
        "dur": 135
      }
    ]
  },
  {
    "id": "validando",
    "inicio": 1103,
    "dur": 249,
    "lineas": [
      {
        "texto": "Al enviarla, el motor revisa estructura, identidad, datos laborales, salarios, consistencia e historial.",
        "inicio": 1103,
        "dur": 249
      }
    ]
  },
  {
    "id": "resultado",
    "inicio": 1374,
    "dur": 389,
    "lineas": [
      {
        "texto": "El resultado separa lo que bloquea de lo que solo hay que revisar.",
        "inicio": 1374,
        "dur": 144
      },
      {
        "texto": "Seis errores hay que corregirlos; cinco alertas se confirman con un motivo escrito.",
        "inicio": 1530,
        "dur": 233
      }
    ]
  },
  {
    "id": "corregir",
    "inicio": 1785,
    "dur": 780,
    "lineas": [
      {
        "texto": "Cada error le dice la fila, la columna, el valor que llegó y el valor que se espera.",
        "inicio": 1785,
        "dur": 199
      },
      {
        "texto": "Fila cuatro, número de documento: dice ocho, guion, setecientos cuarenta y dos, guion, ciento dieciocho, y el tipo declarado es pasaporte.",
        "inicio": 1996,
        "dur": 336
      },
      {
        "texto": "Cámbielo a cédula, o escriba el pasaporte real sin guiones, y guarde la fila.",
        "inicio": 2344,
        "dur": 221
      }
    ]
  },
  {
    "id": "reenviar",
    "inicio": 2587,
    "dur": 181,
    "lineas": [
      {
        "texto": "Envíe la corrección como una versión nueva: la anterior se conserva completa.",
        "inicio": 2587,
        "dur": 181
      }
    ]
  },
  {
    "id": "listo",
    "inicio": 2790,
    "dur": 203,
    "lineas": [
      {
        "texto": "Vuelva a validar y, cuando no quede ningún error, la planilla queda prevalidada.",
        "inicio": 2790,
        "dur": 203
      }
    ]
  }
];

export const escena = (id: string): EscenaGuion => {
  const e = ESCENAS.find((x) => x.id === id);
  if (!e) throw new Error("escena desconocida: " + id);
  return e;
};
