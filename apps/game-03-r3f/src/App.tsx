import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { Camera, Plane } from "./components";

const App = () => {
  return (
    <Canvas shadows={true}>
      <Plane />
      <OrbitControls enableDamping={true} makeDefault={true} />
      <directionalLight position={[4, 10, 2]} castShadow={true} />
      <ambientLight intensity={0.3} />
      <axesHelper args={[2]} />
      <gridHelper args={[20, 40]} />
      <Camera />
    </Canvas>
  );
};

export default App;
