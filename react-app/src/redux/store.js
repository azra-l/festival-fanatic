import { configureStore } from '@reduxjs/toolkit';
import spotifyReducer from './spotify/reducer';
import festivalsReducer from './festivals/reducer';
import authReducer from './auth/reducer';

export const store = configureStore({
  reducer: {
    spotify: spotifyReducer,
    festivals: festivalsReducer,
    auth: authReducer
  },
  devTools: true
});