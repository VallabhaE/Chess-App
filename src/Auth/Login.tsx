import axios from "axios";
import React, { useState } from "react";
import { BACKEDN_URL_HTTP } from "../Components/constents"; // Ensure this is imported correctly
import { useDispatch } from "react-redux";
import { setUserId } from "../redux/userSlics";

const Login = () => {
    const dispatch = useDispatch();

  const [boxState, setBoxState] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "", // Fixed the typo from "conformPassword" to "confirmPassword"
  });

  const handleInputChange = (event) => {
    const inputId = event.target.id; // Accessing the 'id' of the input element
    setUserData((prev) => {
      const updated = { ...prev, [inputId]: event.target.value };
      return updated;
    });
  };

  const handleSubmit = async () => {
    
    if (boxState) {
      // SignUp Route
      if (
        !userData.username ||
        !userData.email ||
        !userData.password ||
        !userData.confirmPassword
      ) {
        return; // Show an error or feedback to the user here
      }

      if (userData.password !== userData.confirmPassword) {
        return; // Handle mismatch password and confirm password error
      }

      // Send data to backend for SignUp
      const signupData = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
      };
      try {
        const response = await axios.post(
          BACKEDN_URL_HTTP + "signup",
          signupData
        ); // Ensure this is the correct endpoint
        
      } catch (error) {
        console.error("Error during sign up:", error);
      }

      setBoxState(false)
    } else {
      // Login Route
      
      if (!userData.email || !userData.password) {
        return; // Handle empty username/password error
      }

      const loginData = {
        email: userData.email,
        password: userData.password,
      };
      try {
        const response = await axios.post(
          BACKEDN_URL_HTTP + "login",
          loginData,{ withCredentials: true }
        ); // Ensure this is the correct endpoint
        dispatch(setUserId(response.data))
      } catch (error) {
        console.error("Error during login:", error);
      }
    }
  };

  return (
    <div className="flex justify-center items-center transition-all duration-300">
      <div className="p-8 bg-red-900 bg-opacity-70 rounded-xl flex flex-col items-center text-white">
        <div className="text-4xl font-bold text-red-400 mb-4">
          {boxState ? "SIGNUP" : "LOGIN"}
        </div>

        {/* Username */}
        {boxState && (
          <div className="flex flex-col items-start mb-4">
            <label htmlFor="username" className="text-lg font-semibold">
              USERNAME
            </label>
            <input
              onChange={handleInputChange}
              type="text"
              id="username"
              value={userData.username}
              className="w-72 p-3 mt-2 rounded-lg bg-white text-black transition-all duration-300"
            />
          </div>
        )}

        {/* Conditionally Rendered Email Field */}

        <div className="flex flex-col items-start mb-4 transition-opacity duration-500 opacity-100">
          <label htmlFor="email" className="text-lg font-semibold">
            EMAIL
          </label>
          <input
            onChange={handleInputChange}
            type="email"
            id="email"
            value={userData.email}
            className="w-72 p-3 mt-2 rounded-lg bg-white text-black transition-all duration-300"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col items-start mb-6">
          <label htmlFor="password" className="text-lg font-semibold">
            PASSWORD
          </label>
          <input
            onChange={handleInputChange}
            type="password"
            id="password"
            value={userData.password}
            className="w-72 p-3 mt-2 rounded-lg bg-white text-black transition-all duration-300"
          />
        </div>

        {/* Conditionally Rendered Confirm Password Field */}
        {boxState && (
          <div className="flex flex-col items-start mb-4 transition-opacity duration-500 opacity-100">
            <label htmlFor="confirmPassword" className="text-lg font-semibold">
              CONFIRM PASSWORD
            </label>
            <input
              onChange={handleInputChange}
              type="password"
              id="confirmPassword"
              value={userData.confirmPassword}
              className="w-72 p-3 mt-2 rounded-lg bg-white text-black transition-all duration-300"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit} // Added the click handler here
          className="w-72 py-3 bg-red-600 hover:bg-red-500 rounded-lg text-white font-semibold transition duration-300"
        >
          {boxState ? "Sign Up" : "Log In"}
        </button>

        {/* Toggle Button */}
        <p
          onClick={() => setBoxState((prev) => !prev)}
          className="cursor-pointer mt-4"
        >
          {boxState ? "Already have an account?" : "No Account Created?"}
        </p>
      </div>
    </div>
  );
};

export default Login;
