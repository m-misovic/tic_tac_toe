import React from "react";
import Square from "./Square";

const Board = (props) => {
  const { squares, gameOver, winnerLine, handleClick } = props;
  return (
    <div className="board">
      {squares.map((value, index) => {
        return (
          <Square
            handleClick={handleClick}
            gameOver={gameOver}
            winnerLine={winnerLine}
            value={value}
            index={index}
            key={index}
          />
        );
      })}
    </div>
  );
};

export default Board;
