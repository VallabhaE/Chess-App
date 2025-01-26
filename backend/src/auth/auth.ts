import { executeQuery } from "../DBMethods";
import { getGameListFromStartTime, getUserlatestGameId, userData } from "../QUARYS";

export default async function CheckUser(req: any, res: any, next: any) {
  const { email, password } = req.body;

  try {
    // Wait for the result of executeQuery
    const result = await executeQuery(userData(email));

    // If result is empty or undefined, handle this scenario
    if (!result || result.length === 0) {
      // Handle user not found scenario
      res.clearCookie('id');
      return res.redirect("/login");
    }

    // Assuming user is found
    res.user = { ...result[0], password: "***" };

    // Proceed to the next middleware
    next();
  } catch (err) {
    // If an error occurs, clear cookie and redirect
    res.clearCookie('id');
    res.redirect("/login");
  }
}


export async function CheckUserForRoutes(req: any, res: any, next: any) {
  console.log(req.cookies)
    const userDetails = req.cookies.id.userId;
    if(userDetails.spectate!==undefined){
      res.beforeTime = {
        gameId: userDetails.gameId,
        valid: true
      };
      next()
    }
  
    // Initiating the first async query to get the latest game ID
    executeQuery(getUserlatestGameId(userDetails.username)).then((result) => {
      const latest_gameId_of_User = result[0].GameId;
  
      // Initiating the second async query to get the game details
      
      executeQuery(getGameListFromStartTime(latest_gameId_of_User,true,true)).then((gameIDstartCol) => {
        
        const moveTimeString = gameIDstartCol[0].moveTime_IST;
        // Parse moveTimeString assuming it's in UTC (ISO 8601 format)
        const moveTimeDate = new Date(moveTimeString);
  
        // Adjusting by adding 5 minutes (in UTC)
        moveTimeDate.setUTCMinutes(moveTimeDate.getUTCMinutes() + 5);  
  
        const currentTime = new Date(); // Current time in the server's local timezone
  
        // To compare currentTime with moveTimeDate, we need to ensure both are in the same timezone (UTC)
        const currentTimeUTC = new Date(currentTime.toUTCString()); // Convert current time to UTC
        console.log(currentTimeUTC.getHours(), currentTimeUTC.getMinutes());
  
        if (currentTime < moveTimeDate) {
          // Current time is before the adjusted time
          console.log("We are before the adjusted time.");
          res.beforeTime = {
            gameId: gameIDstartCol[0].gameId,
            valid: true,
            color:result[0].color
          };
          console.log(result[0].color, "Data", res.beforeTime);
          next()
        } else {
          // Current time is after the adjusted time
          console.log("We are after the adjusted time.");
          res.beforeTime = {
            gameId: null,
            valid: false
          };
          console.log("I AM HERE TEST!@#")
          next();
        }
  
        // Ensure next() is called here, after both queries have finished
        
      }).catch(err => {
        // Handle errors in the second query
        console.error("Error fetching game list:", err);
        next(err);  // Optionally pass error to next middleware
      });
    }).catch(err => {
      // Handle errors in the first query
      console.error("Error fetching user game ID:", err);
      next(err);  // Optionally pass error to next middleware
    });
  }
  