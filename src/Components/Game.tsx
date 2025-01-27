import { useEffect, useState } from "react";
import GameBoard from "./GameBoard";
import GameInitiliser from "./GameInitiliser";
import { Chess } from "chess.js";
import { useNavigate } from "react-router";
import { BACKEDN_URL_HTTP, BACKEND_URL } from "./constents";
import axios from "axios";
import { useSelector } from "react-redux";

let chess: Chess | null = new Chess();
let socket: WebSocket;

const Game = ({ option, setOption, setGameData, gameData,reJoin,setReJoin }) => {
  const navigate = useNavigate();
  const [color, setColor] = useState(null);
  const [sendFunctions, setFunc] = useState({
    sendMessage: null as ((message: string) => void) | null,
    updatedNextMove: null as any,
  });

  const userId = useSelector((state: RootState) => state.user.id);
  const gameId = useSelector((state: RootState) => state.user.gameId);
  const [initilised,setInitilised] = useState(false)
  const [GameStarted,setGameStarted] = useState(false)

useEffect(()=>{
  console.log(gameId,"MODIFIED")
},[gameId])

  useEffect(() => {
    console.log(option)
    
    if (option === null) {
      navigate("/");
      return;
    }else if(!GameStarted){
      console.log("BUG WTF")
      return
    } else if (option === "ONLINE") {
      if(reJoin.gameId==='' || socket===null){
        console.log("WHY SOCKEY NULL")
        return
      }
      console.log("SOCKET INITILIZATIOn")
      // Set up WebSocket connection for online play
      socket = new WebSocket(BACKEND_URL);
      socket.onmessage = function (event) {
        
        if (event.data) {
          const message = JSON.parse(event.data);
          console.log(message, "Direct Data");
          console.log(message.payload, "Direct PayLoad");

          if (message.type === "MOVE") {
            setFunc((prev) => {
              const updated = {
                ...prev,
                updatedNextMove: message.payload,
              };
              return updated;
            });

            console.log(sendFunctions);
          } else if (message.type === "INIT_GAME") {
            console.log(message, "Message form Game Outside");
            color === null && setColor(message.payload.color);
          }
        }
      };

      function sendMessage(message: string) {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(message);
        } else {
          console.log("Socket is not open yet");
        }
      }

      socket.onopen = function () {
        console.log("SENDING DATA HERE:", {
          gameId:reJoin.gameId,
          color:reJoin.color
        },)
        setFunc(() => ({
          sendMessage: sendMessage, // Set sendMessage function
          updatedNextMove: null,
        }));
        socket.send(
          JSON.stringify({
            type: "INIT_GAME",
            userName: userId.username,
            email: userId.email,
            gameId: {
              gameId:reJoin.gameId,
              color:reJoin.color
            },
          })
        ); // Send game initialization
      };

      socket.onerror = function () {
        console.error("WebSocket Error");
      };

      socket.onclose = function () {
        console.log("WebSocket connection closed");
      };
    } else {
      // Offline Play
      console.log(option, "Selected Option");
    }
  }, [navigate, option,reJoin,GameStarted]);

  const [gameState, setGameState] = useState();
  const [move, setMove] = useState({
    from: "",
    to: "",
  });

  const [gameBegins, setGameBegins] = useState(false);

  return (
    <div className="flex flex-col gap-52">
      <GameBoard
      GameStarted={GameStarted}
        gameBegins={gameBegins}
        option={option}
        sendFunctions={sendFunctions}
        chess={chess}
        setMove={setMove}
        move={move}
        gameState={gameState}
        color={color}
        gameData={gameData}
      />
      {/* <GameInitiliser setMove={setMove} setGameBegins={setGameBegins} /> */}
      <button
  onClick={() => setGameStarted((prev) => !prev)}
  className="px-8 py-4 text-lg font-semibold text-white rounded-lg transition-all duration-300
    bg-gradient-to-r from-blue-500 to-green-400 
    hover:from-green-400 hover:to-blue-500 
    focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50 
    transform hover:scale-105 active:scale-95 
    shadow-lg hover:shadow-xl absolute right-0 top-1/2 transform -translate-y-1/2 mr-8"
>
  {!GameStarted ? "START" : "STOP"}
</button>

    </div>
  );
};

export default Game;
