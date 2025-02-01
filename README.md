# Chess Application

## Options Mentioned in Home Page

1. Play Offline
- utilised chess.js inbuilt methods to make enemy play automatically , so for user point of view it is opposite computer playing
- Logic: immediate next to user moves white,black moves its coin by its inbuilt methods
1. Play Onile
  - Utilised ws module to make real time communications between player 1 to player 2
1. Play 1V1
     - User can play both side black and white also which lets user to play game with his friends
  
1. Added Spectator Mode for watching games live,Join with room code to game only if game is live.

# Tasks
1. add radis for quick communication and reducing db costs
1. Design the system to support up to 1000 players for large-scale play.
1. Deploy the game for public access!
1. Moving backend from TS to Go-Lang
1. Fixed Backend Bugs



# HOW TO RUN



cd /{Come to fe place And type ("./")}
  - npm run dev


cd /{backend1}
  - compile typescript file and get dist file output as Js
  - tsc -b
  - and run node ./dist/index.js

cd /{backend}
  - compile typescript file and get dist file output as Js
  -tsc -b
  - and run node ./dist/index.js
