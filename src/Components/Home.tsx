import background from "../assets/chessBackground.jpg";
import { useNavigate } from 'react-router';
import Login from "../Auth/Login";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import { BACKEDN_URL_HTTP } from "./constents";
import { useDispatch } from "react-redux";
import { setGameId } from "../redux/userSlics";

const Home = ({option, setOption,setGameData,gameData,reJoin,setReJoin}) => {
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.user.id);
  const [clicked,setclickedState] = useState(false);
const dispatch = useDispatch()
  const handleData = async ()=>{
    try{
      const data = await axios.get(BACKEDN_URL_HTTP+"getOnlineMatchs",{
        withCredentials: true, // This ensures cookies are sent with the request
      })
       console.log({
        gameId:data.data.gameId,
        color:data.data.color
      },"CHECK ME PLEASE SIR")
      dispatch(setGameId({
        gameId:data.data.gameId,
        color:data.data.color
      }))
      setReJoin({
        gameId:data.data.gameId,
        color:data.data.color
      })
      setGameData(data.data.gameData)
    }catch(e){
      console.log(e)
    }
  }
  useEffect(()=>{
    console.log("UPdated")
  ,[userId]})
  function handleClick() {
    if(userId===null) {
      setclickedState(true)
      return;
    }
    handleData()
    navigate("/game");
    console.log("Function Clicked");
  }

  return (
    <div style={{ backgroundImage: `url(${background})` }} className="w-screen bg-cover bg-center flex relative align-middle h-screen">
      
      {/* Overlay to darken the background */}
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

      {/* Main content area */}
      <div className="z-20 flex flex-col justify-center items-center text-center text-white px-4 relative">
        <div className="font-extrabold text-3xl sm:text-4xl lg:text-5xl text-red-500 mb-6">
          Welcome to the World's #1 Chess Playing Platform
        </div>
        <div className="font-medium text-xl sm:text-2xl text-red-300 mb-8">
          Please Click Start To Enter Queue
        </div>

        {/* Buttons */}
        <div className="flex justify-center flex-col gap-11">
          <div onClick={() => {
            setOption("OFFLINE");
            handleClick();
          }} className="border-4 border-red-600 h-20 w-96 rounded-xl bg-red-900 hover:bg-red-700 hover:scale-105 transition duration-300 ease-in-out flex items-center justify-center font-semibold text-3xl text-white cursor-pointer">
            Play Offline
          </div>

          <div onClick={() => {
            setOption("ONLINE");
            handleClick();
          }} className="border-4 border-red-600 h-20 w-96 rounded-xl bg-red-900 hover:bg-red-700 hover:scale-105 transition duration-300 ease-in-out flex items-center justify-center font-semibold text-3xl text-white cursor-pointer">
            Play Online
          </div>

          <div onClick={() => {
            setOption("1V1");
            handleClick();
          }} className="border-4 border-red-600 h-20 w-96 rounded-xl bg-red-900 hover:bg-red-700 hover:scale-105 transition duration-300 ease-in-out flex items-center justify-center font-semibold text-3xl text-white cursor-pointer">
            Play 1V1
          </div>

          {clicked && <div  className=" border-red-600 rounded-xl animate-bounce w-fit  bg-red-900 hover:bg-red-700 hover:scale-105 transition duration-300 ease-in-out flex items-center justify-center font-semibold text-3xl text-white cursor-pointer">
            { "PLEASE LOGIN"}
          </div>}
        </div>
      </div>

      {/* Login Component */}
      <div className="self-center z-30">
        {!userId ? <Login />:(
          <div className="text-5xl font-bold text-red-500">
            Welcome to Our Chess Game <br /> <h1 className="flex justify-center text-9xl">{userId.username}</h1>
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;
