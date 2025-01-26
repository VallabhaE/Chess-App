import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";
import { executeQuery } from "./DbMethods/DbFunctions";
import { insertMoves } from "./DbMethods/Quarrys";
export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  public board: Chess;
  private startTime: Date;
  private totalMoves:number = 0
  public gameId:number;
  // public player1Name:string
  // public player2Name:string
  // public player1Email:string
  // public player2Email:string
  public Spectators:(WebSocket)[];
  constructor(player1: WebSocket, player2: WebSocket,GameId:number) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startTime = new Date();
    this.gameId = GameId;
    this.Spectators = []
    // this.player1Email = info.player1Email
    // this.player1Name = info.player1Name
    // this.player2Email = info.player2Email
    // this.player2Name = info.player2Name

    this.player1.send(JSON.stringify({
        type:INIT_GAME,
        payload:{
            color:"white",
            gameId:this.gameId
        }
    }))

    this.player2.send(JSON.stringify({
        type:INIT_GAME,
        payload:{
            color:"black"
        }
    }))
  }
  addSpectators(spectator:WebSocket):void{
    this.Spectators.push(spectator)
    return;
  }
  endGame(){
    this.gameId=-1
  }
  removeSpectators(spectator: WebSocket): void {
    // Iterate over the array of spectators
    const index = this.Spectators.indexOf(spectator);
    
    // If the spectator is found in the array
    if (index !== -1) {
      // Remove the spectator using splice
      this.Spectators.splice(index, 1);
    }
  }
  
  async makeMove(
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
    await executeQuery(insertMoves(move.from,move.to,this.gameId))
    console.log("Insertion happend",move.from,move.to,this.gameId)
    for(let spectator of this.Spectators){
      spectator.send(JSON.stringify({
        ...move,
        type:"SPECTATE"
      }))
    }


    

  }
}
