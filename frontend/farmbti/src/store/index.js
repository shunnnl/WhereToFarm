import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import signupReducer from './slices/signupSlice';

export const store = configureStore({
  reducer: { 
    auth:authReducer
  },
});

export default store;