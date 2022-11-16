import React from "react";
import * as THREE from "three";

const getPlaneGeometry = () => {
  return new THREE.SphereGeometry(1, 16, 16);
};

const geometry = getPlaneGeometry();

const material = new THREE.MeshStandardMaterial({
  color: 0x00aa00,
  flatShading: true,
  // wireframe: true,
});

export const Plane = () => {
  return <mesh geometry={geometry} material={material} />;
};

export default Plane;
