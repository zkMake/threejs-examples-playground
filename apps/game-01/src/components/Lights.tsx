import React, { useRef } from "react";
import { useHelper } from "@react-three/drei";
import { DirectionalLightHelper, DirectionalLight } from "three";

import { useDebugContext } from "../DebugContext";

export const Lights = () => {
  const { debug } = useDebugContext();
  const lightRef = useRef<DirectionalLight>(null);
  useHelper(debug && lightRef, DirectionalLightHelper);

  return (
    <>
      <directionalLight
        ref={lightRef}
        position={[4, 10, 2]}
        castShadow={true}
      />
      <ambientLight intensity={0.3} />
    </>
  );
};

export default Lights;
