import { configureStore } from '@reduxjs/toolkit';
import spotifyReducer from './spotify/reducer';
import festivalsReducer from './festivals/reducer';

export const store = configureStore({
  reducer: {
    spotify: spotifyReducer,
    festivals: festivalsReducer
  },
  devTools: true
});