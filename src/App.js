import './App.css'
import SnakeBoard from './SnakeBoard'
import Points from "./points";

function App() {
  return ( <
    div className = "App" >
    <
    header className = "App-header" >
    Matopeli <
    /header> <
    Points points = {
      1
    }
    /> <
    SnakeBoard / >
    <
    /div>
  );
}

export default App;