import React, { useContext, useState } from "react";
import { useEventListener } from "usehooks-ts";
import { Perf } from "r3f-perf";
import { Debug as RapierDebug } from "@react-three/rapier";

const DEFAULT_DEBUG = false;

const DebugContext = React.createContext<{
  debug: boolean;
}>({ debug: DEFAULT_DEBUG });

interface Props {
  children: React.ReactNode | ((value: { debug: boolean }) => React.ReactNode);
}

const DebugContextProvider = (props: Props) => {
  const { children } = props;
  const [debug, toggleDebug] = useState(DEFAULT_DEBUG);

  const handler = ({ key }: { key: string }) => {
    switch (key) {
      case "d":
        toggleDebug((debug) => !debug);
        break;

      default:
        return;
    }
  };

  useEventListener("keydown", handler);
  const value = { debug };

  return (
    <DebugContext.Provider value={value}>
      {debug && (
        <>
          <RapierDebug />
          <Perf position="top-left" />
          {/*<axesHelper args={[2]} />*/}
          {/*<gridHelper args={[20, 40]} />*/}
        </>
      )}
      {typeof children === "function" ? children(value) : children}
    </DebugContext.Provider>
  );
};

const useDebugContext = () => {
  const context = useContext(DebugContext);

  if (context === undefined) {
    throw new Error(
      "useDebugContext must be used within a DebugContext.Provider"
    );
  }

  return context;
};

export default DebugContext;
export { useDebugContext, DebugContextProvider };
