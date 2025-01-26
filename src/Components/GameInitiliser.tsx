import React, { useState } from 'react'

function GameInitiliser({setMove,setGameBegins}) {
  
  return (
    <div className='flex flex-col justify-center ml-60 mt-60 '>
        <div
        onClick={()=>setGameBegins((prev)=>!prev)}
        className='cursor-pointer rounded-xl p-6 border w-96 bg-blue-200 h-fit'>
        StartGame
        </div>
        <div onClick={()=>setMove({
            from:"",
            to:""

    })} className='cursor-pointer rounded-xl p-6 border w-96 bg-blue-200 h-fit'>
        Unselect SelectedCol
        </div>
    </div>
  )
}

export default GameInitiliser