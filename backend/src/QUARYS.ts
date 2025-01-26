export const insertUser = (username: string, email: string, password: string): string => {
    // Escape single quotes in the inputs to prevent SQL injection
    const escape = (value: string) => value.replace(/'/g, "''");
  
    return `INSERT INTO users (username, email, password) VALUES ('${escape(username)}', '${escape(email)}', '${escape(password)}');`;
  };
  
  

  export const userData = (email:string) =>{
    const escape = (value: string) => value.replace(/'/g, "''");
    return `select * from users where email="${email}";`
  }


  export const getUserlatestGameId = (username:string)=>{
    return `select * from UserGames where username="${username}"order by id desc limit 1;`
  }


  

  export const getGameListFromStartTime = (gameId: number, desc: boolean, limit1: boolean) => {
   
    const orderByDesc = desc ? "DESC" : "ASC";  // Set the order direction based on the `desc` boolean
    const limit = limit1 ? "LIMIT 1" : "";     // Add LIMIT 1 only if `limit1` is true
  
    return `SELECT id, \`from\`, \`to\`, CONVERT_TZ(moveTime, '+00:00', '+05:30') AS moveTime_IST, gameId
            FROM GamesList 
            WHERE gameId=${gameId} 
            ORDER BY id ${orderByDesc} 
            ${limit};`;
  };
  
  export const getMovesFromGameId = (gameId:number) =>{
    return `SELECT * from GamesList where gameId=${gameId} order by id;`
  }