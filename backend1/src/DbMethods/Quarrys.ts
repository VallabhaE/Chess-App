export const insertUserGames = (username:string,email:string,gameId:number,color:string,gameType:string)=>{
    return `insert into UserGames(username,email,GameId,color,gameType) values ('${username}','${email}','${gameId}','${color}','${gameId}');`
}

export const insertMoves = (from:string,to:string,gameId:number)=>{
    return `INSERT INTO GamesList (\`from\`, \`to\`, gameId) VALUES ('${from}', '${to}', ${gameId})`
}