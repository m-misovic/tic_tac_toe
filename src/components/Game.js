import React, { Component } from "react";
import Board from "./Board";
import io from "socket.io-client";

export default class Game extends Component {
  constructor() {
    super();
    this.state = {
      squares: Array(9).fill(null),
      currentSymbol: "X",
      gameOver: false,
      gameStatus: null,
      winnerLine: [],
    };
  }

  componentDidMount() {
    this.socket = io("http://localhost:4000/");
    this.socket.on("newMove", (data) => {
      this.setState({
        squares: data.squares,
        currentSymbol: data.currentSymbol,
      });
    });
    this.socket.on("restart", (data) => {
      this.setState({
        squares: data.squares,
        currentSymbol: data.currentSymbol,
        gameOver: data.gameOver,
        gameStatus: data.gameStatus,
        winnerLine: data.winnerLine,
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.squares !== this.state.squares) {
      this.checkGameStatus(this.state.squares);
    }
  }

  handleSquareClick = (index) => {
    if (!this.state.gameOver && !this.state.squares[index]) {
      const updatedSquares = [...this.state.squares];
      updatedSquares[index] = this.state.currentSymbol;
      this.socket.emit("newMove", {
        squares: updatedSquares,
        currentSymbol: this.state.currentSymbol === "X" ? "O" : "X",
      });
    }
  };

  checkGameStatus = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    const boardFilled = squares.every((item) => item);
    const combs = lines.map((line) => line.map((index) => squares[index]));

    for (const comb of combs) {
      if (comb[0] && comb.every((symbol) => symbol === comb[0])) {
        this.setState({
          gameOver: true,
          gameStatus: "Player " + comb[0] + " won the game",
          winnerLine: lines[combs.indexOf(comb)],
        });
      } else if (
        boardFilled &&
        combs.every((comb) => !comb.every((symbol) => symbol === comb[0]))
      ) {
        this.setState({
          gameOver: true,
          gameStatus: "The game is a draw",
        });
        return;
      }
    }
  };

  restartGame = () => {
    this.socket.emit("restart", {
      squares: Array(9).fill(null),
      currentSymbol: "X",
      gameOver: false,
      gameStatus: null,
      winnerLine: [],
    });
  };

  render() {
    return (
      <div className="game">
        <div className="status">
          {this.state.gameOver
            ? this.state.gameStatus
            : "Player " + this.state.currentSymbol + " is on the move"}
        </div>
        <Board
          squares={this.state.squares}
          gameOver={this.state.gameOver}
          winnerLine={this.state.winnerLine}
          handleClick={this.handleSquareClick}
        ></Board>
        <div
          className={this.state.gameOver ? "restart active" : "restart"}
          onClick={this.restartGame}
        >
          New game
        </div>
      </div>
    );
  }
}
