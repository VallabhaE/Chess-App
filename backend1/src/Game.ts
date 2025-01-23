import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";
export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  public board: Chess;
  private startTime: Date;
  private totalMoves:number = 0
  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startTime = new Date();
    this.player1.send(JSON.stringify({
        type:INIT_GAME,
        payload:{
            color:"white"
        }
    }))

    this.player2.send(JSON.stringify({
        type:INIT_GAME,
        payload:{
            color:"black"
        }
    }))
  }

  makeMove(
    socket: WebSocket,
    move: {
      from: string;
      to: string;
    }
  ) {
    console.log("ENTERED GAME LOGIC",move)
    //validate here
    //is it this user move
    // is this move valid
    console.log(this.totalMoves%2,"-->Socket:",socket===this.player1?"Player1":"Player2",this.totalMoves)
    if (this.totalMoves % 2 === 0 && socket !== this.player1) {
      return;
    }

    if (this.totalMoves % 2 === 1 && socket !== this.player2) {
      return;
    }

    console.log("Early Return not happened")
    try {
      console.log("MOVING PAWN ATTEMPTED")
      this.board.move(move);
    } catch (e) {
      console.log(e)
      return
    }

    //update the board
    //push the move

    if(this.board.isGameOver()){
        this.player1.emit(JSON.stringify({
            type:GAME_OVER,
            payload:this.board.turn()==="w"?"black":"white"
        }))

        this.player2.emit(JSON.stringify({
            type:GAME_OVER,
            payload:this.board.turn()==="w"?"black":"white"
        }))

        return
    }

    console.log("GAME OVER NOT HAPPENED")
    if(this.totalMoves%2===0){
        this.player2.send(JSON.stringify({
            type:MOVE,
            payload:move
        }))
    }else{
        this.player1.send(JSON.stringify({
            type:MOVE,
            payload:move
        }))
    }

    this.totalMoves++;
  }
}
