import React from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { useControls } from "leva";

export const Camera = () => {
  const { fov, position } = useControls({
    fov: { value: 35, min: 0, max: 180 },
    position: { value: [4, 4, 4], min: -10, max: 10, step: 0.01 },
  });

  return <PerspectiveCamera makeDefault={true} fov={fov} position={position} />;
};

export default Camera;
