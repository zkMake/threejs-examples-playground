import React from "react";

import styles from "./Help.module.scss";

export const Help = () => {
  return (
    <div className={styles.help}>
      <div>arrows: move</div>
      <div>space: jump</div>
      <div>r: reset</div>
      <div>d: debug</div>
    </div>
  );
};

export default Help;
