import React from "react";

const Square = (props) => {
  const { value, index, gameOver, winnerLine, handleClick } = props;
  const squareClick = () => {
    handleClick(index);
  };
  return (
    <div
      className={
        value || gameOver
          ? winnerLine.includes(index)
            ? "square winner"
            : "square deactivated"
          : "square"
      }
      onClick={squareClick}
    >
      {value}
    </div>
  );
};

export default Square;
