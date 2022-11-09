import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import { Camera } from "./components/Camera";

const geometry = new THREE.CylinderGeometry(
  0.5, // radiusTop
  0.5, // radiusBottom
  50, // height
  18, // radialSegments
  1, // heightSegments
  true, // openEnded
  0, // thetaStart
  Math.PI // thetaLength
);

const material = new THREE.MeshStandardMaterial({
  color: 0x00aa00,
  flatShading: true,
  side: THREE.DoubleSide, // change to THREE.BackSide
  // wireframe: true,
});

const sphereGeometry = new THREE.IcosahedronGeometry(0.1, 2);
const sphereMaterial = new THREE.MeshStandardMaterial({
  flatShading: true,
  color: "mediumpurple",
});

const App = () => {
  return (
    <Canvas shadows={true}>
      <mesh
        geometry={geometry}
        material={material}
        rotation={[0, 0, -Math.PI / 2]}
        position={[20, 0.5, 0]}
      />
      <OrbitControls enableDamping={true} makeDefault={true} />
      <directionalLight position={[4, 10, 2]} castShadow={true} />
      <ambientLight intensity={0.3} />
      <axesHelper args={[2]} />
      <gridHelper args={[20, 40]} />
      <mesh
        geometry={sphereGeometry}
        material={sphereMaterial}
        position={[-3, 0.2, 0]}
      />

      <Camera />
    </Canvas>
  );
};

export default App;
