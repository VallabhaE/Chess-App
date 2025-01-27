import { WebSocket } from "ws";
import { END_GAME, INIT_GAME, MOVE, REMOVESPECTATPRS, SPECTATE } from "./messages";
import { Game } from "./Game";
import { executeQuery } from "./DbMethods/DbFunctions";
import { getAllGames, insertUserGames } from "./DbMethods/Quarrys";
export class GameManager {
  private games: Game[];
  private pendingUser: any;
  private users: WebSocket[];
  private gameIdCreator:number
  constructor() {
    this.games = [];
    this.pendingUser = null;
    this.users = [];
    executeQuery(getAllGames()).then((res)=>{
      
      this.gameIdCreator = res.length;
      console.log("GAMEID",res.length,this.gameIdCreator)
    }).catch(er=>{
      this.gameIdCreator = 0
    })
  }

  addUser(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  removeUser(socket: WebSocket) {}

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      console.log(message);
      if (message.type === INIT_GAME) {
        if (!message.userName || !message.email) {
          return;
        }
        if (this.pendingUser) {
          if (message.userName === this.pendingUser.userName) {
            return;
          }
          
          if (message.gameId.gameId !== null || message.gameId.color.length>0) {
            console.log("VERIFYNG",message.gameId.gameId);
            for (let game of this.games) {
              if (game.gameId === message.gameId.gameId) {
                console.log(game.gameId, "TEST===TEST", message.gameId.gameId);
                if (game.gameId.color === "black") {
                  game.player2 = socket;
                  console.log("FOUND PREV SOCKET");
                  break;
                } else {
                  game.player1 = socket;
                  console.log("FOUND PREV SOCKET");
                  break;
                }
              }
            }
          } else {
            console.log("GAME INITIATED TO PLAYERS");
            const game = new Game(
              this.pendingUser.socket,
              socket,
              this.gameIdCreator + 1
            );
            this.gameIdCreator++;
            executeQuery(
              insertUserGames(
                this.pendingUser.userName,
                this.pendingUser.email,
                game.gameId,
                "white",
                "ONLINE"
              )
            );
            this.pendingUser = null;
            this.games.push(game);
            executeQuery(
              insertUserGames(
                message.userName,
                message.email,
                game.gameId,
                "black",
                "ONLINE"
              )
            );
          }
        } else {
          if (!message.userName || !message.email) {
            return;
          }
          console.log("V->",message)
          if (message.gameId.gameId !== null || message.gameId.color.length>0) {
            console.log("VERIFYNG",message.gameId.gameId);
            for (let game of this.games) {
              if (message.gameId.gameId===game.gameId) {
                console.log(game.gameId, "TEST===TEST", message.gameId.gameId,"Color",message.gameId.color);
                if (message.gameId.color === "black") {
                  game.player2 = socket;
                  console.log("DONE DUDE ADDING SOCKET IS SUCCESS")
                  break;
                } else {
                  game.player1 = socket;
                  console.log("DONE DUDE ADDING SOCKET IS SUCCESS")
                  break;
                }
              }
            }
          } else {
            this.pendingUser = {
              socket: socket,
              userName: message.userName,
              email: message.email,
            };
          }

          console.log(this.pendingUser,"I AM PENDING USER");
        }
      }

      if (message.type === MOVE) {
        console.log("MOVING ELEMENT ATTEMPTED", message);
        const game = this.games.find(
          (game) => game.player1 === socket || game.player2 === socket
        );

        console.log("CAME HERE");

        game?.makeMove(socket, message.move);
      }

      if (message.type === SPECTATE) {
        let gameFound = false
        for (let Game of this.games) {
          console.log("SEARCHING DATA")
          if (message.gameId.gameId === Game.roomId) {
            console.log("OUTPUT FOUND")
            gameFound = true
            Game.addSpectators(socket);
            break;
          }
        }

        if(gameFound===false){
          socket.send(JSON.stringify({
            type:"SPECTATE",
            allMoves:[]
          }))
        }
      }

      if (message.removeSpectators === REMOVESPECTATPRS) {
        for (let Game of this.games) {
          if (message.gameId === Game.gameId) {
            Game.removeSpectators(socket);
            break;
          }
        }
      }


      if(message.type===END_GAME){
        for (let game of this.games) {
          if (game.gameId === message.gameId.gameId) {
           game.endGame()
           break;

          }
        }
      }
    });
  }
}
