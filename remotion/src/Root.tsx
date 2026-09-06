import { Composition } from "remotion";
import { MainVideo, DURACION_TOTAL } from "./MainVideo";
import { MovilVideo, DURACION_MOVIL } from "./Movil";

export const RemotionRoot = () => (
  <>
    <Composition
      id="main"
      component={MainVideo}
      durationInFrames={DURACION_TOTAL}
      fps={30}
      width={1280}
      height={720}
    />
    <Composition
      id="movil"
      component={MovilVideo}
      durationInFrames={DURACION_MOVIL}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
