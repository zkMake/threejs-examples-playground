import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import { Camera } from "./components/Camera";

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
  color: 0x00aa00,
  flatShading: true,
  // wireframe: true,
});

const App = () => {
  return (
    <Canvas shadows={true}>
      <mesh geometry={geometry} material={material} />
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
