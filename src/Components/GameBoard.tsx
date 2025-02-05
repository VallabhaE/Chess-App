import { ReactElement, useEffect, useState } from "react";
// Pawn Initialization - BLACK
import BlackCamel from "../assets/Icons/bb.png";
import BlackKing from "../assets/Icons/bk.png";
import BlackHorse from "../assets/Icons/bn.png";
import BlackPawn from "../assets/Icons/bp.png";
import BlackQueen from "../assets/Icons/bq.png";
import BlackElephant from "../assets/Icons/br.png";
// Pawn Initialization - WHITE
import WhiteElephant from "../assets/Icons/wr.png";
import WhiteQueen from "../assets/Icons/wq.png";
import WhitePawn from "../assets/Icons/wp.png";
import WhiteCamel from "../assets/Icons/wb.png";
import WhiteKing from "../assets/Icons/wk.png";
import WhiteHorse from "../assets/Icons/wn.png";
import { useSelector } from "react-redux";

let status: boolean;

const Chessboard = ({
  gameIdforSpectator,
  option,
  chess,
  gameState,
  setMove,
  move,
  sendFunctions,
  gameBegins,
  color,
  GameStarted,
  gameData
}: any) => {

  
  const [board, setBoard] = useState(chess.board());
  const [state, setState] = useState("");
  const Moves = useSelector((state: RootState) => state.user.gameMovesUpdated);
  const [spectating,setSpectating] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState("");
  const [AvailableMoves,setAvailableMoves] = useState([])
  useEffect(()=>{
    if(gameIdforSpectator!==null){
      setSpectating(true)
    }else{
      setSpectating(false)
    }
  },[gameIdforSpectator])
  console.log(option,"OPTION us")
  if(gameState!==null){
    setBoard(gameState)
  }


  useEffect(()=>{
    if(Moves===null){
      return
    }
    setBoard(Moves)
  },[Moves])
  useEffect(()=>{
    if(gameData===undefined){
      return
    }
    for(let move of gameData){
      chess.move({from:move.from,to:move.to})
      setBoard(chess.board());
    }
  },[gameData])
  // Handle a click event to update the move
  function handleClick(position: string, col: string): void {
    if (!GameStarted) {
      return;
    }
    // if (option==="ONLINE" && col !== undefined && col !== color[0] ) {
    //   return;
    // }
    if (move.from.length === 0) {
      setMove((prev: any) => ({
        ...prev,
        from: position,
      }));
      console.log("AVAILABLE MOVES:->")
    } else {
      setMove((prev: any) => ({
        ...prev,
        to: position,
      }));
    }
  }

  useEffect(() => {
    if (sendFunctions.updatedNextMove !== null) {
      const moveData = sendFunctions.updatedNextMove;
      try {
        const result = chess.move(moveData); // Perform the move on the chessboard

        if (result) {
          // If the move was valid, update the board and send a response back
          setBoard(chess.board()); // Update the board state
          setMove({ from: "", to: "" }); // Clear the move state
        } else {
          console.error("Invalid move:", moveData);
        }
      } catch (error) {
        console.error("Error executing move:", error);
      }
    }
  }, [sendFunctions.updatedNextMove, chess, sendFunctions, option]);

  // Function to handle the game-over state
  function checkGameStatus() {
    if (chess.isGameOver()) {
      setIsGameOver(true);
      const winnerColor = chess.turn() === "w" ? "Black" : "White";
      setWinner(`${winnerColor} wins!`);
    }
  }

  useEffect(() => {
    if (move.from.length > 0 && move.to.length > 0) {
      try {
        const data = chess.move(move);
        if (option === "ONLINE") {
          sendFunctions.sendMessage(
            JSON.stringify({
              type: "MOVE",
              move: move,
            })
          );
        }else if(option === "OFFLINE"){
          const moves = chess.moves()
          const move = moves[Math.floor(Math.random() * moves.length)]
          chess.move(move)

        }
      } catch {
        console.log("Invalid Move");
        setMove({
          from: "",
          to: "",
        });
      }
      setBoard(chess.board());
      checkGameStatus(); // Check the game status after each move

      setMove({
        from: "",
        to: "",
      });
    }
  }, [move]);

  // Convert column number to letter (for example: 0 -> 'a', 1 -> 'b')
  function numToChar(num: number): string {
    return String.fromCharCode(97 + num);
  }

  // Decide which image to show based on the piece type and color
  function DecideImage(pieceType: string, strat: string): ReactElement | null {
    switch (pieceType.toUpperCase()) {
      case "B": // Bishop
        return <img src={strat === "b" ? BlackCamel : WhiteCamel} alt="Bishop" />;
      case "K": // King
        return <img src={strat === "b" ? BlackKing : WhiteKing} alt="King" />;
      case "Q": // Queen
        return <img src={strat === "b" ? BlackQueen : WhiteQueen} alt="Queen" />;
      case "R": // Rook
        return <img src={strat === "b" ? BlackElephant : WhiteElephant} alt="Rook" />;
      case "N": // Knight
        return <img src={strat === "b" ? BlackHorse : WhiteHorse} alt="Knight" />;
      case "P": // Pawn
        return <img src={strat === "b" ? BlackPawn : WhitePawn} alt="Pawn" />;
      default:
        return null; // Return null for empty squares or unsupported piece types
    }
  }

  return (
    <div>
      {isGameOver ? (
        <div className="game-over-message">
          <h2>{winner}</h2>
        </div>
      ) : (
        <div className="grid grid-cols-8 gap-0 w-[900px] h-[500px]">
          {board.map((row, rowIndex) =>
            row.map((square, colIndex) => {
              const isWhiteSquare = (rowIndex + colIndex) % 2 === 0; // Determine if the square is white or black
              const position = `${numToChar(colIndex)}${8 - rowIndex}`;

              const isSelected = move.from === position;

              return (
                <div
                  onClick={() => handleClick(position, square?.color)}
                  key={position}
                  className={`relative w-full pb-full ${
                    isWhiteSquare ? "bg-orange-600" : "bg-gray-600"
                  } ${isSelected ? "border-2 border-black" : ""}`}
                  style={{ aspectRatio: "1" }} // Set the aspect ratio to 1 (square)
                >
                  {square ? (
                    <span
                      className={`absolute inset-0 flex items-center justify-center text-xl ${
                        square.color === "w" ? "text-white" : "text-black"
                      }`}
                    >
                      {DecideImage(square.type.toUpperCase(), square.color) ? (
                        DecideImage(square.type.toUpperCase(), square.color)
                      ) : (
                        square.type.toUpperCase()
                      )}
                    </span>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      )}

<button disabled={spectating} onClick={()=>setGameStarted((prev)=>!prev)}>{GameStarted && !spectating?"Start":!spectating?"Stop":"spectate Mode"} Game</button>
    </div>
//Testing Purpose
    
  );
};

export default Chessboard;
