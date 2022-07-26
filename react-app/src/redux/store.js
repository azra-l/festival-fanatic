import { configureStore } from '@reduxjs/toolkit';
import festivalsReducer from './festivals/reducer';
import authReducer from './auth/reducer';

export const store = configureStore({
  reducer: {
    festivals: festivalsReducer,
    auth: authReducer
  },
  devTools: true
});