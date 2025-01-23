import { useState } from 'react'
import './App.css'
import Home from './Components/Home'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from './Components/Game';

function App() {
  const [option, setOption] = useState(null)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home option={option} setOption={setOption} />} />
        <Route path='/game' element={<Game option={option} setOption={setOption}/>} />
      </Routes>
    </ BrowserRouter>
  )
}

export default App
