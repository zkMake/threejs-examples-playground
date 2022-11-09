import React, { useContext, useState } from "react";
import { useEventListener } from "usehooks-ts";
import { OrbitControls } from "@react-three/drei";

const AppContext = React.createContext<{
  orbitControls: boolean;
}>({ orbitControls: false });

interface Props {
  children:
    | React.ReactNode
    | ((value: { orbitControls: boolean }) => React.ReactNode);
}

const AppContextProvider = (props: Props) => {
  const { children } = props;
  const [orbitControls, toggleOrbitControls] = useState(false);

  const handler = ({ key }: { key: string }) => {
    switch (key) {
      case "o":
        toggleOrbitControls((orbitControls) => !orbitControls);
        break;

      default:
        return;
    }
  };

  useEventListener("keydown", handler);
  const value = { orbitControls };

  return (
    <AppContext.Provider value={value}>
      {orbitControls && (
        <OrbitControls enableDamping={true} makeDefault={true} />
      )}
      {typeof children === "function" ? children(value) : children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppContext.Provider");
  }

  return context;
};

export default AppContext;
export { useAppContext, AppContextProvider };
