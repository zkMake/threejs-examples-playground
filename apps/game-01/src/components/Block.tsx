import React from "react";
import { MeshProps } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

THREE.ColorManagement.legacyMode = false;

const BLOCK_SCALE = 0.99;
const COLUMN_HEIGHT = 2;
const COLUMN_OFFSET = 0.05;

const boxGeometry = new THREE.BoxGeometry();
const orangeMaterial = new THREE.MeshStandardMaterial({ color: "orange" });
const hotpinkMaterial = new THREE.MeshStandardMaterial({ color: "hotpink" });
const tealMaterial = new THREE.MeshStandardMaterial({ color: "teal" });
const purpleMaterial = new THREE.MeshStandardMaterial({ color: "purple" });

type Props = {
  gridPosition: [number, number];
  color: "orange" | "hotpink" | "teal" | "purple";
  type?: "column" | "tile";
} & MeshProps;

const getMaterialForColor = (color: Props["color"]) => {
  const colorToMaterialMap = {
    orange: orangeMaterial,
    hotpink: hotpinkMaterial,
    teal: tealMaterial,
    purple: purpleMaterial,
  };

  return colorToMaterialMap[color];
};

const getPositionForBlock = (
  gridPosition: Props["gridPosition"],
  type: Props["type"] = "tile"
): [number, number, number] => {
  const [x, y] = gridPosition;

  return [x, type === "tile" ? 0 : -COLUMN_HEIGHT / 2 + COLUMN_OFFSET, y];
};

export const Block = (props: Props) => {
  const { gridPosition, color, type = "tile" } = props;
  const position = getPositionForBlock(gridPosition, type);
  const scale: [number, number, number] =
    type === "tile"
      ? [BLOCK_SCALE, 0.1, BLOCK_SCALE]
      : [BLOCK_SCALE, COLUMN_HEIGHT, BLOCK_SCALE];

  return (
    <RigidBody type="fixed">
      <mesh
        castShadow={true}
        receiveShadow={true}
        geometry={boxGeometry}
        material={getMaterialForColor(color)}
        position={position}
        scale={scale}
      />
    </RigidBody>
  );
};

export default Block;
