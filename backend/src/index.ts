import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import { getMap, setMap } from "./SessionData/session"; // Assuming you have these functions to manage session data
import { v4 as uuidv4 } from "uuid";
import CheckUser, { CheckUserForRoutes } from "./auth/auth";
import { getMovesFromGameId, insertUser } from "./QUARYS";
import { executeQuery } from "./DBMethods";
import { Request } from "express";
import cors from "cors";

const app = express();
app.use(cors<Request>({
  credentials: true,
  origin: 'http://localhost:5173', // Replace with the actual frontend domain
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "XYZ123!@#tsc",
    saveUninitialized: true,
    resave: false,
  })
);

app.post("/login", CheckUser, function (req, res) {
  const sessionId = uuidv4();
  const cookieId = req.cookies.id?.id;

  if (!cookieId || getMap(cookieId) === undefined) {
    setMap(sessionId, req.session.id);
    res.cookie("id", { id: sessionId, userId: res.user }).send(res.user);
    
  } else {
    console.log(req.cookies.id?.id, ":", getMap(req.cookies.id?.id));
    res.cookie("id", { id: cookieId, userId: res.user }).send(res.user);
   
  }
 
});

app.post("/signup", function (req, res) {
  const { username, email, password, conformPassword } = req.body;
  if (!username || !email || !password || !!conformPassword) {
    res.status(401).json("INVALID DATA ENTRY");
  }
  if (password !== conformPassword) {
    res.status(401).json("INVALID DATA ENTRY");
  }
  try {
    let quarry: string = insertUser(username, email, password);
    executeQuery(quarry);
    res.status(200)
  } catch (e) {
    console.log(e);
    res.status(401).json("DATA ENTRY TO DATABASE FAILED PLEASE CHECK AGAIN");
  }
});

app.get("/getOnlineMatchs", CheckUserForRoutes, function (req, res) {
  if (!res.beforeTime.valid) {
    res.status(200).send(res.beforeTime);
    return;
  }

  executeQuery(getMovesFromGameId(res.beforeTime.gameId)).then((result) => {
    const update = {
      ...res.beforeTime,
      gameData:result
    }
    res.beforeTime = update
    res.status(200).send(res.beforeTime);
    return
  }).catch((err)=>{
    console.log(err)
    res.status(200).send([]);
  });

  return;
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
