import React from "react";

import Block from "./Block";

export const Board = () => {
  return (
    <>
      {/* Center */}
      <Block gridPosition={[1, 1]} color="orange" type="column" />
      <Block gridPosition={[1, 0]} color="purple" />
      <Block gridPosition={[1, -1]} color="teal" />
      <Block gridPosition={[0, -1]} color="hotpink" />
      <Block gridPosition={[-1, -1]} color="teal" />
      <Block gridPosition={[-1, 0]} color="purple" />
      <Block gridPosition={[-1, 1]} color="teal" />
      <Block gridPosition={[0, 1]} color="hotpink" />

      {/* Top right */}
      <Block gridPosition={[1, -3]} color="hotpink" type="column" />
      <Block gridPosition={[1, -4]} color="teal" />
      <Block gridPosition={[0, -4]} color="purple" />
      <Block gridPosition={[-1, -4]} color="teal" />
      <Block gridPosition={[-1, -3]} color="hotpink" />

      {/* Bottom left */}
      <Block gridPosition={[-1, 4]} color="teal" type="column" />
      <Block gridPosition={[-1, 3]} color="hotpink" />
      <Block gridPosition={[1, 3]} color="hotpink" />
      <Block gridPosition={[1, 4]} color="teal" />
      <Block gridPosition={[0, 4]} color="purple" />
    </>
  );
};

export default Board;
