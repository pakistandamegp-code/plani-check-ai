import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { C } from "../theme";

export const Fondo: React.FC = () => {
  const frame = useCurrentFrame();
  const deriva = interpolate(frame, [0, 705], [0, -60]);
  const brillo = interpolate(frame % 300, [0, 150, 300], [0.35, 0.6, 0.35]);

  return (
    <AbsoluteFill style={{ background: `linear-gradient(145deg, ${C.ink} 0%, ${C.ink2} 60%, #131a27 100%)` }}>
      <AbsoluteFill
        style={{
          opacity: 0.5,
          backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          transform: `translate(${deriva}px, ${deriva / 2}px)`,
          maskImage: "radial-gradient(circle at 30% 20%, black 0%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(circle at 30% 20%, black 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -180,
          top: -140,
          width: 640,
          height: 640,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.teal}33 0%, transparent 65%)`,
          opacity: brillo,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -160,
          bottom: -220,
          width: 560,
          height: 560,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.gold}22 0%, transparent 65%)`,
          opacity: brillo * 0.8,
        }}
      />
    </AbsoluteFill>
  );
};
