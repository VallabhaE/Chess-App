import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";


export class GameManager {
    private games: Game[];
    private pendingUser:WebSocket | null
    private users: WebSocket[]
    constructor(){
        this.games= [];
        this.pendingUser=null
        this.users = []
    }

    addUser(socket :WebSocket){
        this.users.push(socket)
        this.addHandler(socket)
    }

    removeUser(socket :WebSocket){}

    private addHandler(socket: WebSocket){
        socket.on("message",(data)=>{
            const message = JSON.parse(data.toString())
            if(message.type === INIT_GAME){
                
                if(this.pendingUser){
                    console.log("GAME INITIATED TO PLAYERS")
                    const game = new Game(this.pendingUser,socket)
                    this.pendingUser=null
                    this.games.push(game)
                }else{
                    this.pendingUser = socket;
                }
            }

            if(message.type===MOVE){
                console.log("MOVING ELEMENT ATTEMPTED",message)
                const game = this.games.find((game)=>game.player1===socket || game.player2===socket)

                game?.makeMove(socket,message.move)
            }
        })
    }


}
