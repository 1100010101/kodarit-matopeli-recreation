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

    const displayRows = rows.map(row => ( <
          div className = "Snake-row" > {
            row.map(tile => < div className = {
                `tile ${tile}`
              }
              />)} < /
              div >
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
                break
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