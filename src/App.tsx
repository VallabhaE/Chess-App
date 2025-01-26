import { useState } from 'react'
import './App.css'
import Home from './Components/Home'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from './Components/Game';
import { Provider } from 'react-redux';
import { store } from './redux/store';
function App() {
  const [option, setOption] = useState(null)
  const [gameData,setGameData] = useState([]);
  const [reJoin,setReJoin] = useState({
    gameId:null,
    color:""
  })

  console.log("CHANGED HERE",reJoin)
  return (
    <BrowserRouter>
    <Provider store={store}>
      <Routes>
        <Route path='/' element={<Home option={option} setOption={setOption} gameData={gameData} setGameData={setGameData} reJoin={reJoin} setReJoin={setReJoin}/>} />
        <Route path='/game' element={<Game option={option} setOption={setOption} gameData={gameData} setGameData={setGameData} reJoin={reJoin} setReJoin={setReJoin}/>} />
      </Routes>
      </Provider>
    </ BrowserRouter>
  )
}

export default App
