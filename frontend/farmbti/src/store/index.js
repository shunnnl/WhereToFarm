import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import signupReducer from './signupSlice';

export const store = configureStore({
  reducer: { 
    auth:authReducer
  },
});

export default store;