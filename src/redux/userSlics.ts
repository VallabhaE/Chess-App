import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

// Defining the type for the state
interface UserState {
  id: any; // This can be updated to the appropriate type (e.g., string or object)
  gameId:any,
  SpectatergameId:any,
  gameMovesUpdated:any
}

// Initial state, defaulting the `id` to `null` (i.e., user is not logged in initially)
const initialState: UserState = {
  // Safely handling cookie data parsing
  id: (() => {
    const cookieData = Cookies.get('id'); // Get the cookie
    if (cookieData) {
      try {
        // Access the cookie, substring, then parse it
        const parsedData = JSON.parse(cookieData.substring(2)); // parse the cookie string after substring
        return parsedData.userId || null; // Safely return userId, or null if not found
      } catch (error) {
        console.error("Failed to parse cookie data:", error); // Log the error if parsing fails
        return null; // Fallback to null if parsing fails
      }
    }
    return null; // Return null if cookie is not found
  })(),
  gameId:null,
  SpectatergameId:null,
  gameMovesUpdated:null
  
};

// Creating the slice using Redux Toolkit's `createSlice` function
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Action to set the user ID from the cookie or a direct assignment
    setUserId: (state, action: PayloadAction<string | null>) => {
      state.id = action.payload;
    },
    setGameId: (state, action: PayloadAction<any | null>) => {
      console.log("CAME HERE",action)
      state.gameId = action.payload;
    },
    setSpectateGameId: (state, action: PayloadAction<any | null>) => {
      console.log("CAME HERE spectatorGameId",action)
      state.SpectatergameId = action.payload;
    },
    setGameBoardUpdate(state, action: PayloadAction<any | null>){
      state.gameMovesUpdated = action.payload;
    }
  },
});

// Export the action and the reducer
export const { setUserId,setGameId,setSpectateGameId,setGameBoardUpdate } = userSlice.actions;
export default userSlice.reducer;
