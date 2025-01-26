import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlics'; // Path to your user slice

// Configuring the Redux store with the userReducer
export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// Exporting RootState and AppDispatch types for use in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
