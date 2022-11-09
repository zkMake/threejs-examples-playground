import React from "react";
import { Sky } from "@react-three/drei";

import Board from "./Board";
import Ball from "./Ball";
import Lights from "./Lights";

export const Stage = () => {
  return (
    <>
      <Sky
        distance={450_000}
        sunPosition={[0, 1, 0]}
        inclination={0}
        azimuth={0.25}
      />
      <Lights />
      <Board />
      <Ball />
    </>
  );
};

export default Stage;
