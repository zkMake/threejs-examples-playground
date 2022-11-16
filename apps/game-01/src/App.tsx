import React from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";

import { Stage, Help, KeyboardVisualizer } from "./components";
import { DebugContextProvider } from "./DebugContext";
import { AppContextProvider } from "./AppContext";

const KEYBOARD_VISUALIZER = true;

const App = () => {
  return (
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp"] },
        { name: "backward", keys: ["ArrowDown"] },
        { name: "left", keys: ["ArrowLeft"] },
        { name: "right", keys: ["ArrowRight"] },
        { name: "jump", keys: ["Space"] },
        { name: "reset", keys: ["r"] },
      ]}
    >
      <Canvas
        shadows={true}
        orthographic={true}
        legacy={false}
        camera={{
          zoom: 120,
          position: [1, 0.5, 1],
          near: -100,
          far: 100,
        }}
      >
        <AppContextProvider>
          <Physics>
            <DebugContextProvider>
              <Stage />
            </DebugContextProvider>
          </Physics>
        </AppContextProvider>
      </Canvas>
      <Help />
      {KEYBOARD_VISUALIZER && <KeyboardVisualizer />}
    </KeyboardControls>
  );
};

export default App;
