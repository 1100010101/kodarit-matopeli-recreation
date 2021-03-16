import React, {
  useState
} from "react";
import {
  useInterval
} from "./utils";
import "./SnakeBoard.css";

const SnakeBoard = () => {
  const height = 10;
  const width = 10;
  var initialRows = [];
  for (var i = 0; i < height; i++) {
    initialRows[i] = [];
    for (var j = 0; j < width; j++) {
      initialRows[i][j] = "blank";
    }
  }

  const [rows, setRows] = useState(initialRows);
  const [snake, setSnake] = useState([{
    x: 0,
    y: 0
  }]);
  const [direction, setDirection] = useState("right");

  const changeDirectionWithKeys = (e) => {
    const {
      keyCode
    } = e;
    switch (keyCode) {
      case 37:
        setDirection("left");
        break;
      case 38:
        setDirection("top");
        break;
      case 39:
        setDirection("right");
        break;
      case 40:
        setDirection("bottom");
        break;
    }
  }
  document.addEventListener("keydown", changeDirectionWithKeys);
  const displayRows = rows.map((row, i) => ( <
    div className = "Snake-row"
    key = {
      i
    } > {
      row.map((tile, j) => ( <
        div className = {
          `tile ${tile}`
        }
        key = {
          `${i}-${j}`
        }
        />
      ))
    } <
    /div>
  ));


  const displaySnake = () => {
    const newRows = initialRows;
    snake.forEach(tile => {
      newRows[tile.x][tile.y] = "snake";
    });
    setRows(newRows);
  };

  const moveSnake = () => {
    const newSnake = [];
    switch (direction) {
      case 'right':
        newSnake.push({
          x: snake[0].x,
          y: (snake[0].y + 1) % width
        });
        break;
      case 'left':
        newSnake.push({
          x: snake[0].x,
          y: (snake[0].y - 1 + width) % width
        });
        break;
      case 'top':
        newSnake.push({
          x: (snake[0].x - 1 + height) % height,
          y: snake[0].y
        });
        break;
      case 'bottom':
        newSnake.push({
          x: (snake[0].x + 1) % height,
          y: (snake[0].y)
        });
        break;
      default:
        break;
    }
    setSnake(newSnake);
    displaySnake();
  };

  useInterval(moveSnake, 250);
  return <div className = "Snake-board" > {
    displayRows
  } < /div>;
};

export default SnakeBoard;