import { useEffect, useState } from 'react';
import GameBoard from './GameBoard';
import GameInitiliser from './GameInitiliser';
import { Chess } from "chess.js";
import { useNavigate } from 'react-router';
import { BACKEND_URL } from './constents';

let chess: Chess | null = new Chess();
let socket: WebSocket;

const Game = ({ option, setOption }) => {
  const navigate = useNavigate();
  const [color,setColor] = useState(null);
  const [sendFunctions, setFunc] = useState({
    sendMessage: null as ((message: string) => void) | null,
    updatedNextMove: null as any,
  });

  useEffect(() => {
    if (option === null) {
      navigate("/");
    } else if (option === "ONLINE") {
      // Set up WebSocket connection for online play
      socket = new WebSocket(BACKEND_URL);

      socket.onmessage = function (event) {
       
        if (event.data) {
          const message = JSON.parse(event.data);
          console.log(message,"Direct Data")
          console.log(message.payload,"Direct PayLoad")

          if (message.type === "MOVE") {
            setFunc((prev) => {
              const updated = {
                ...prev,
                updatedNextMove: message.payload,
              };
              return updated;
            });
          
        
        console.log(sendFunctions)
    }else if(message.type==="INIT_GAME"){
      console.log(message,"Message form Game Outside")
            color===null && setColor(message.payload.color)
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
        setFunc(() => ({
          sendMessage: sendMessage, // Set sendMessage function
          updatedNextMove: null,
        }));
        socket.send(JSON.stringify({ type: "INIT_GAME" })); // Send game initialization
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
  }, [option, navigate]);

  const [gameState, setGameState] = useState();
  const [move, setMove] = useState({
    from: "",
    to: "",
  });

  const [gameBegins, setGameBegins] = useState(false);

  return (
    <div className="flex">
      <GameBoard
        gameBegins={gameBegins}
        option={option}
        sendFunctions={sendFunctions}
        chess={chess}
        setMove={setMove}
        move={move}
        gameState={gameState}
        color={color}
      />
      <GameInitiliser setMove={setMove} setGameBegins={setGameBegins} />
    </div>
  );
};

export default Game;
