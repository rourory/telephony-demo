import React, { useEffect, useRef } from "react";
import { loadingController } from "../../../utils/loading-animation-controller";

interface UltraLightLoadingIndicatorProps {
  fontSize?: string;
}

const UltraLightLoadingIndicator: React.FC<UltraLightLoadingIndicatorProps> = ({
  fontSize = "1,5rem",
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = loadingController.subscribe(async (frame) => {
      if (ref.current) {
        ref.current.innerText = frame;
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        userSelect: "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "monospace",
        fontSize,
        whiteSpace: "pre",
      }}
    />
  );
};

export default UltraLightLoadingIndicator;
