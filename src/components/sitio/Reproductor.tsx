import { useCallback, useEffect, useRef, useState } from "react";
import {
  Gauge,
  Loader2,
  Maximize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils";

function formato(seg: number) {
  if (!Number.isFinite(seg)) return "0:00";
  const m = Math.floor(seg / 60);
  const s = Math.floor(seg % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

const VELOCIDADES = [0.5, 1, 1.25, 1.5, 2];

export function Reproductor({
  src,
  titulo,
  vertical = false,
}: {
  src: string;
  titulo: string;
  vertical?: boolean;
}) {
  const contRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLVideoElement>(null);
  const barraRef = useRef<HTMLDivElement>(null);
  const ocultarTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const [reproduciendo, setReproduciendo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [buffer, setBuffer] = useState(0);
  const [tiempo, setTiempo] = useState(0);
  const [duracion, setDuracion] = useState(0);
  const [mudo, setMudo] = useState(false);
  const [volumen, setVolumen] = useState(1);
  const [velocidad, setVelocidad] = useState(1);
  const [tocado, setTocado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [controlesVisibles, setControlesVisibles] = useState(true);
  const [arrastrando, setArrastrando] = useState(false);

  const video = () => ref.current;

  const alternar = useCallback(() => {
    const v = video();
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  }, []);

  const saltarSegundos = useCallback((delta: number) => {
    const v = video();
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(v.duration || 0, v.currentTime + delta));
  }, []);

  const buscarEnBarra = useCallback(
    (clientX: number) => {
      const v = video();
      const barra = barraRef.current;
      if (!v || !barra || !v.duration) return;
      const rect = barra.getBoundingClientRect();
      const fraccion = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      v.currentTime = fraccion * v.duration;
    },
    [],
  );

  const pantallaCompleta = useCallback(() => {
    const el = contRef.current;
    if (document.fullscreenElement) void document.exitFullscreen();
    else if (el?.requestFullscreen) void el.requestFullscreen();
  }, []);

  // Mostrar controles y programar su ocultamiento
  const mover = useCallback(() => {
    setControlesVisibles(true);
    if (ocultarTimer.current) clearTimeout(ocultarTimer.current);
    ocultarTimer.current = setTimeout(() => {
      if (video() && !video()!.paused) setControlesVisibles(false);
    }, 2600);
  }, []);

  useEffect(() => {
    mover();
    return () => {
      if (ocultarTimer.current) clearTimeout(ocultarTimer.current);
    };
  }, [mover]);

  // Arrastre de la barra de progreso
  useEffect(() => {
    if (!arrastrando) return;
    const alMover = (e: PointerEvent) => buscarEnBarra(e.clientX);
    const alSoltar = () => setArrastrando(false);
    window.addEventListener("pointermove", alMover);
    window.addEventListener("pointerup", alSoltar);
    return () => {
      window.removeEventListener("pointermove", alMover);
      window.removeEventListener("pointerup", alSoltar);
    };
  }, [arrastrando, buscarEnBarra]);

  // Atajos de teclado cuando el cursor está sobre el reproductor
  const alTeclar = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "k") {
      e.preventDefault();
      alternar();
    } else if (e.key === "ArrowRight") saltarSegundos(10);
    else if (e.key === "ArrowLeft") saltarSegundos(-10);
    else if (e.key === "m") alternarMudo();
    else if (e.key === "f") pantallaCompleta();
  };

  const alternarMudo = () => {
    const v = video();
    if (!v) return;
    v.muted = !v.muted;
    setMudo(v.muted);
  };

  const cambiarVolumen = (valor: number) => {
    const v = video();
    if (!v) return;
    v.volume = valor;
    v.muted = valor === 0;
    setVolumen(valor);
    setMudo(valor === 0);
  };

  const cambiarVelocidad = () => {
    const v = video();
    if (!v) return;
    const siguiente = VELOCIDADES[(VELOCIDADES.indexOf(velocidad) + 1) % VELOCIDADES.length] ?? 1;
    v.playbackRate = siguiente;
    setVelocidad(siguiente);
  };

  const mostrarControles = !tocado || controlesVisibles || !reproduciendo;

  return (
    <div
      ref={contRef}
      tabIndex={0}
      role="group"
      aria-label={`Reproductor de video: ${titulo}`}
      onKeyDown={alTeclar}
      onMouseMove={mover}
      onMouseLeave={() => reproduciendo && setControlesVisibles(false)}
      className={cn(
        "group @container relative select-none overflow-hidden rounded-lg border border-border bg-ink text-ink-foreground shadow-md outline-none",
        vertical ? "aspect-[9/16]" : "aspect-video",
        !mostrarControles && "cursor-none",
      )}
    >
      <video
        ref={ref}
        className="h-full w-full"
        src={src}
        preload="metadata"
        playsInline
        onClick={alternar}
        onDoubleClick={pantallaCompleta}
        onPlay={() => {
          setReproduciendo(true);
          setTocado(true);
        }}
        onPause={() => setReproduciendo(false)}
        onEnded={() => {
          setReproduciendo(false);
          setControlesVisibles(true);
        }}
        onWaiting={() => setCargando(true)}
        onPlaying={() => setCargando(false)}
        onCanPlay={() => setCargando(false)}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          setTiempo(v.currentTime);
          setProgreso(v.duration ? (v.currentTime / v.duration) * 100 : 0);
        }}
        onProgress={(e) => {
          const v = e.currentTarget;
          if (v.buffered.length && v.duration) {
            setBuffer((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
          }
        }}
        onLoadedMetadata={(e) => setDuracion(e.currentTarget.duration)}
      >
        Su navegador no puede reproducir el video.
      </video>

      {/* Indicador de carga */}
      {cargando && tocado && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <Loader2 className="h-10 w-10 animate-spin text-ink-foreground/80" />
        </div>
      )}

      {/* Botón inicial */}
      {!tocado && (
        <button
          type="button"
          onClick={alternar}
          aria-label={`Reproducir: ${titulo}`}
          className="absolute inset-0 grid place-items-center bg-ink/60 transition-colors hover:bg-ink/50"
        >
          <span className="grid h-16 w-16 place-items-center rounded-full bg-teal text-teal-foreground shadow-lg transition-transform hover:scale-105">
            <Play className="ml-1 h-7 w-7" />
          </span>
          <span className="sr-only">{titulo}</span>
        </button>
      )}

      {/* Controles */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/95 via-ink/60 to-transparent px-3 pb-3 pt-12 transition-opacity duration-300",
          mostrarControles ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        {/* Barra de progreso */}
        <div
          ref={barraRef}
          role="slider"
          aria-label="Posición del video"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progreso)}
          aria-valuetext={`${formato(tiempo)} de ${formato(duracion)}`}
          onPointerDown={(e) => {
            setArrastrando(true);
            buscarEnBarra(e.clientX);
          }}
          className="group/barra relative flex h-4 w-full cursor-pointer items-center"
        >
          <div className="relative h-1 w-full overflow-visible rounded-full bg-white/25 transition-all group-hover/barra:h-1.5">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white/30"
              style={{ width: `${buffer}%` }}
            />
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-teal"
              style={{ width: `${progreso}%` }}
            />
            <div
              className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal shadow transition-transform group-hover/barra:scale-110"
              style={{ left: `${progreso}%` }}
            />
          </div>
        </div>

        {/* Fila de botones: se adapta al ancho del propio reproductor */}
        <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1">
          <div className="flex min-w-0 items-center gap-1.5">
            <button
              type="button"
              onClick={alternar}
              aria-label={reproduciendo ? "Pausar" : "Reproducir"}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-sm text-ink-foreground transition-colors hover:bg-white/15"
            >
              {reproduciendo ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => saltarSegundos(-10)}
              aria-label="Retroceder 10 segundos"
              className="hidden h-9 w-9 shrink-0 place-items-center rounded-sm text-ink-foreground transition-colors hover:bg-white/15 @md:grid"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => saltarSegundos(10)}
              aria-label="Adelantar 10 segundos"
              className="hidden h-9 w-9 shrink-0 place-items-center rounded-sm text-ink-foreground transition-colors hover:bg-white/15 @md:grid"
            >
              <RotateCw className="h-4 w-4" />
            </button>

            <span className="ml-1 truncate font-mono text-xs text-ink-foreground/80">
              {formato(tiempo)} <span className="text-ink-foreground/50">/ {formato(duracion)}</span>
            </span>
            <span className="ml-2 hidden truncate text-xs text-ink-foreground/60 @xl:inline">{titulo}</span>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <div className="flex items-center">
              <button
                type="button"
                aria-label={mudo ? "Activar sonido" : "Silenciar"}
                onClick={alternarMudo}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-sm text-ink-foreground transition-colors hover:bg-white/15"
              >
                {mudo ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={mudo ? 0 : volumen}
                onChange={(e) => cambiarVolumen(Number(e.target.value))}
                aria-label="Volumen"
                className="hidden h-1 w-16 cursor-pointer accent-teal @lg:block"
              />
            </div>
            <button
              type="button"
              onClick={cambiarVelocidad}
              aria-label={`Velocidad de reproducción: ${velocidad}x. Pulse para cambiar.`}
              className="flex h-9 shrink-0 items-center gap-1 rounded-sm px-2 font-mono text-xs text-ink-foreground transition-colors hover:bg-white/15"
            >
              <Gauge className="h-4 w-4" />
              {velocidad}x
            </button>
            <button
              type="button"
              aria-label="Pantalla completa"
              onClick={pantallaCompleta}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-sm text-ink-foreground transition-colors hover:bg-white/15"
            >
              <Maximize className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
