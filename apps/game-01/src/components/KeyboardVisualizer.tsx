import React, { useEffect, useState } from "react";
import { useKeyboardControls } from "@react-three/drei";
import clsx from "clsx";

import styles from "./KeyboardVisualizer.module.scss";

const useKeyEffect = (key: string) => {
  const [subscribeKeys, _] = useKeyboardControls();
  const [keyState, setKeyState] = useState(false);

  useEffect(() => {
    return subscribeKeys(
      (state: any) => state[key],
      (value) => {
        if (value) {
          setKeyState(true);
        } else {
          setKeyState(false);
        }
      }
    );
  }, []);

  return keyState;
};

const KeyboardVisualizer = () => {
  const forward = useKeyEffect("forward");
  const backward = useKeyEffect("backward");
  const left = useKeyEffect("left");
  const right = useKeyEffect("right");
  const jump = useKeyEffect("jump");

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <div className={clsx(styles.key, { [styles.active]: forward })}>↑</div>
      </div>
      <div className={styles.row}>
        <div className={clsx(styles.key, { [styles.active]: left })}>←</div>
        <div className={clsx(styles.key, { [styles.active]: backward })}>↓</div>
        <div className={clsx(styles.key, { [styles.active]: right })}>→</div>
      </div>
      <div className={styles.row}>
        <div
          className={clsx(styles.key, styles.fullWidth, {
            [styles.active]: jump,
          })}
        >
          space
        </div>
      </div>
    </div>
  );
};

export { KeyboardVisualizer };
export default KeyboardVisualizer;
