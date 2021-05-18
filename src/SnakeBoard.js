import React, {useState, useEffect} from "react";
import {useInterval, range} from "./utils";
import "./SnakeBoard.css";

const SnakeBoard = ({points, setPoints}) => {
  const [height, setHeight] = useState(parseInt(localStorage.getItem('snake-board-size')) || 10)
  const [width, setWidth] = useState(parseInt(localStorage.getItem('snake-board-size') || 10))
  const getInitialRows = () => {
    var initialRows = [];
    for (var i = 0; i < height; i++) {
      initialRows[i] = [];
      for (var j = 0; j < width; j++) {
        initialRows[i][j] = "blank";
    }
  }
  return initialRows;
}
  const getObstacles = () => [
    {name: "tyhjä", location: []},
    {
      name: "keski",
      location: range(width * 0.6).map(y => ({
        x: Math.round(height / 2),
        y: y + Math.ceil(width * 0.2)
      }))
    },
    {
      name: "reunat",
      location: [
        ...range(width).map(x => ({x, y: 0})),
        ...range(width).map(x => ({x, y: height - 1})),
        ...range(height).map(y => ({x: 0, y})),
        ...range(height).map(y => ({x: height - 1, y}))
      ]
    },
    {
      name: "oma",
      location: [
        ...range(width).map(x => ({x, y: 0})),
        ...range(width).map(x => ({x, y: height - 2})),
        ...range(width).map(x => ({x, y: height - 1})),
        ...range(height).map(y => ({x: 0, y})),
        ...range(height).map(y => ({x: 1, y})),
        ...range(width).map(x => ({x, y: 1})),
        ...range(height).map(y => ({x: height - 2, y})),
        ...range(height).map(y => ({x: height - 1, y}))
      ]
    }
  ];

  const randomObstacle = () =>
    getObstacles()[Math.floor(Math.random() * getObstacles().length)];

  const randomPosition = () => {
    const position = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height)
    };
    if (
      obstacle.location.some(({x, y}) => position.x === x && position.y === y)
    ) {
      return randomPosition();
    }
    return position;
  };

  const [obstacle, setObstacle] = useState(randomObstacle());
  const [rows, setRows] = useState(getInitialRows);
  const [snake, setSnake] = useState([
    {
      x: 2,
      y: 2
    }
  ]);
  const [direction, setDirection] = useState("right");
  const [food, setFood] = useState(randomPosition);
  const [intervalId, setIntervalId] = useState();
  const [isGameOver, setisGameOver] = useState(false);
  const [startGame, setStartGame] = useState(false)
  const [error, setError] = useState(null)

  useEffect(
    () => {
    if (width >= 10 && width <= 100 && height >= 10 && height <= 100) {
      setObstacle(randomObstacle())
      setRows(getInitialRows())
      setFood(randomPosition())
    }
  }, [width, height])

  const changeDirectionWithKeys = e => {
    const {keyCode} = e;
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
  };
  document.addEventListener("keydown", changeDirectionWithKeys);
  const displayRows = rows.map((row, i) => (
    <div className="Snake-row" key={i}>
      {" "}
      {row.map((tile, j) => (
        <div className={`tile ${tile}`} key={`${i}-${j}`} />
      ))}{" "}
    </div>
  ));

  const displaySnake = () => {
    const newRows = getInitialRows();
    snake.forEach(tile => {
      newRows[tile.x][tile.y] = "snake";
    });
    newRows[food.x][food.y] = "food";
    obstacle.location.forEach(tile => {
      newRows[tile.x][tile.y] = "obstacle";
    });
    setRows(newRows);
  };

  const checkGameOver = () => {
    const head = snake[0];
    const body = snake.slice(1, -1);
    const hitSnake = body.find(b => b.x === head.x && b.y === head.y);
    const hitWall = obstacle.location.some(
      ({x, y}) => head.x === x && head.y === y
    );
    return hitSnake || hitWall;
  };

  const moveSnake = () => {
    if (!startGame) return;
    const newSnake = [];
    switch (direction) {
      case "right":
        newSnake.push({
          x: snake[0].x,
          y: (snake[0].y + 1) % width
        });
        break;
      case "left":
        newSnake.push({
          x: snake[0].x,
          y: (snake[0].y - 1 + width) % width
        });
        break;
      case "top":
        newSnake.push({
          x: (snake[0].x - 1 + height) % height,
          y: snake[0].y
        });
        break;
      case "bottom":
        newSnake.push({
          x: (snake[0].x + 1) % height,
          y: snake[0].y
        });
        break;
      default:
        break;
    }

    if (checkGameOver()) {
      setisGameOver(true);
      clearInterval(intervalId);
      const pointsList = JSON.parse(localStorage.getItem("snake-points")) || [];
      const name = prompt("Peli päättyi! Anna nimimerkkisi:");
      pointsList.push({name, points});
      localStorage.setItem("snake-points", JSON.stringify(pointsList));
      window.dispatchEvent(new Event("storage"));
    }
    // Lisätään madolle jaka askeleella uusi pala
    //joka poistetaan jos amto ei saa tällä askeleella ruokaa
    snake.forEach(tile => {
      newSnake.push(tile);
    });
    //Tarkistetaan saako mato ruuan kiinni
    const madonPaa = snake[0];
    if (madonPaa.x === food.x && madonPaa.y === food.y) {
      setFood(randomPosition);
      setPoints(points + 1);
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
    displaySnake();
  };

  useInterval(moveSnake, 200, setIntervalId);
  return (
    <div className="Snake-board">
      {!startGame && (
        <>
        <div>Pelilaudan koko on nyt {width} ruutua.</div>
        <div>Aseta halutessasi uusi pelilaudan koko:</div>
        <input
        className="Board-size"
        placeholder="Koko 10-100"
        type="number"
        onChange={
          (e) => {
            const size = parseInt(e.target.value)
            if (size <= 100 && size >= 10) {
              console.log("OK", size);
              setWidth(size)
              setHeight(size)
              localStorage.setItem("snake-board-size", size);
              setError(null)
            } else {
              console.error("Kokeile jotain toista lukua", size);
              setError(
                `Pelilaudan koko on liian ${size > 100 ? "suuri" : "pieni"}`
              )
            }
          }
        }
        />
        {error && <div className="Error">{error}</div>}
        <button className="Start-game" onClick={setStartGame}>Aloita peli
        </button>
        </>
      )}
      {" "}
      {startGame && displayRows}
      {isGameOver && <div className="Game-over"> Game over! </div>}{" "}
    </div>
  );
};

export default SnakeBoard;
