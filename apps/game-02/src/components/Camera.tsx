import React from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { useControls } from "leva";

export const Camera = () => {
  const { fov, rotation, position } = useControls({
    fov: { value: 35, min: 0, max: 180 },
    rotation: { value: [0, 0, 0], min: -Math.PI, max: Math.PI, step: 0.01 },
    position: { value: [-5, 0.1, 0], min: -10, max: 10, step: 0.01 },
  });

  return (
    <PerspectiveCamera
      makeDefault={true}
      fov={fov}
      position={position}
      rotation={rotation}
    />
  );
};

export default Camera;
