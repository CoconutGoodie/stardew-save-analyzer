import { useEffect, useRef, useState } from "react";

export const FpsDebugger = (props: { scanInterval?: number }) => {
  const isRunning = useRef(false);
  const [fps, setFps] = useState(-1);

  useEffect(() => {
    const times: number[] = [];
    let fps = -1;

    function refreshLoop() {
      window.requestAnimationFrame(() => {
        const now = performance.now();
        while (times.length > 0 && times[0] <= now - 1000) {
          times.shift();
        }
        times.push(now);
        fps = times.length;
        if (isRunning.current) refreshLoop();
      });
    }

    const scanInterval = setInterval(
      () => setFps(fps),
      props.scanInterval ?? 1_000
    );

    isRunning.current = true;
    refreshLoop();

    return () => {
      clearInterval(scanInterval);
    };
  }, [props.scanInterval]);

  return (
    <h1
      style={{
        margin: 0,
        padding: "0 10px",
        position: "fixed",
        top: 0,
        left: 0,
        background: "#fff",
        color: "#000",
        zIndex: 99999999999,
      }}
    >
      FPS: {fps >= 0 ? fps : "-"}
    </h1>
  );
};
