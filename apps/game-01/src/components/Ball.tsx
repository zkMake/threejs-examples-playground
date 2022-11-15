import React, { useRef, useEffect } from "react";
import { RigidBody, RigidBodyApi } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const useKeyEffect = (key: string, callback: () => void) => {
  const [subscribeKeys, _] = useKeyboardControls();

  useEffect(() => {
    return subscribeKeys(
      (state: any) => state[key],
      (value) => {
        if (value) {
          callback();
        }
      }
    );
  }, []);
};

export const Ball = () => {
  const ref = useRef<RigidBodyApi>(null);
  const [_, getKeys] = useKeyboardControls();

  const jump = () => {
    if (ref.current) {
      const origin = ref.current.translation();

      if (origin.y < 0.4 && origin.y > 0) {
        ref.current.applyImpulse({ x: 0, y: 0.35, z: 0 });
      }
    }
  };

  const reset = () => {
    if (ref.current) {
      const rotation = new THREE.Quaternion();
      rotation.setFromEuler(new THREE.Euler(0, 0, 0));
      ref.current.setRotation(rotation);

      ref.current.setTranslation({ x: 1, y: 1, z: 1 });
      ref.current.setLinvel({ x: 0, y: 0, z: 0 });
      ref.current.setAngvel({ x: 0, y: 0, z: 0 });
    }
  };

  useKeyEffect("reset", reset);
  useKeyEffect("jump", jump);

  useFrame((state, delta) => {
    if (ref.current) {
      const ballLocation = ref.current.translation();
      if (ballLocation.y < -7) {
        reset();
      }

      const { forward, backward, left, right } = getKeys();
      const impulse = { x: 0, y: 0, z: 0 };
      const torqueImpulse = { x: 0, y: 0, z: 0 };
      const impulseStrength = 0.15 * delta;
      const torqueImpulseStrength = 0.15 * delta;

      if (backward) {
        impulse.z = impulseStrength;
        torqueImpulse.x += torqueImpulseStrength;
      }

      if (forward) {
        impulse.z = -impulseStrength;
        torqueImpulse.x -= torqueImpulseStrength;
      }

      if (right) {
        impulse.x = impulseStrength;
        torqueImpulse.z -= torqueImpulseStrength;
      }

      if (left) {
        impulse.x = -impulseStrength;
        torqueImpulse.z += torqueImpulseStrength;
      }

      ref.current.applyImpulse(impulse);
      ref.current.applyTorqueImpulse(torqueImpulse);
    }
  });

  return (
    <RigidBody
      ref={ref}
      name="ball"
      colliders="ball"
      linearDamping={0.75}
      angularDamping={0.75}
      restitution={0.5}
      friction={1}
      mass={0.1}
      position={[1, 0.75, 1]}
    >
      <mesh castShadow={true}>
        <icosahedronGeometry args={[0.22, 1]} />
        <meshStandardMaterial
          flatShading={true}
          transparent={true}
          opacity={0.9}
          color="mediumpurple"
        />
      </mesh>
    </RigidBody>
  );
};

export default Ball;
