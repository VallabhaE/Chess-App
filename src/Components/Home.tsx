import background from "../assets/chessBackground.jpg";
import { useNavigate } from 'react-router';

const Home = ({option,setOption}) => {
    const navigate = useNavigate()
    
    function handleClick() :void{
        navigate("/game")
        console.log("Function Clicked")
    }
  return (
    <div
      className="h-[100vh] w-screen bg-cover bg-center flex relative"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Overlay to darken the background */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Main content area */}
      <div className="z-10 flex flex-col justify-center items-center text-center text-white px-4">
        <div className="font-extrabold text-3xl sm:text-4xl lg:text-5xl text-red-500 mb-6">
          Welcome to the World's #1 Chess Playing Platform
        </div>
        <div className="font-medium text-xl sm:text-2xl text-red-300 mb-8">
          Please Click Start To Enter Queue
        </div>

        {/* Button */}
        <div   className="flex justify-center flex-col gap-11">
          <div onClick={()=>{
            setOption("OFFLINE")
            handleClick()
            }} className="border-4 border-red-600 h-20 w-96 rounded-xl bg-red-900 hover:bg-red-700 hover:scale-105 transition duration-300 ease-in-out flex items-center justify-center font-semibold text-3xl text-white cursor-pointer">
            Play Offline
          </div>



          <div onClick={()=>{
            setOption("ONLINE")
            handleClick()
            }} className="border-4 border-red-600 h-20 w-96 rounded-xl bg-red-900 hover:bg-red-700 hover:scale-105 transition duration-300 ease-in-out flex items-center justify-center font-semibold text-3xl text-white cursor-pointer">
            Play Online
          </div>

          
          <div onClick={()=>{
            setOption("1V1")
            handleClick()
            }} className="border-4 border-red-600 h-20 w-96 rounded-xl bg-red-900 hover:bg-red-700 hover:scale-105 transition duration-300 ease-in-out flex items-center justify-center font-semibold text-3xl text-white cursor-pointer">
            Play 1V1
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Home;
