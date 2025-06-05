import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  signupInfo: {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    adress: ''
  },
};

export const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    updateSignupInfo: (state, action) => {
      state.signupInfo = { ...state.signupInfo, ...action.payload };
    },
    resetSignup: () => initialState,
  },
});

export const { updateSignupInfo, resetSignup } = signupSlice.actions;

export default signupSlice.reducer;