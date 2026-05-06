import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const login = createAsyncThunk('auth/login', async (credentials) => {
  const res = await axios.post(`${API_URL}/auth/login`, credentials);
  localStorage.setItem('token', res.data.token);
  return res.data;
});

export const registerUser = createAsyncThunk('auth/register', async (userData) => {
  const res = await axios.post(`${API_URL}/auth/register`, userData);
  localStorage.setItem('token', res.data.token);
  return res.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    }
  },
 extraReducers: (builder) => {
  builder
    .addCase(login.pending, (state) => {
      state.loading = true;
    })
    .addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.token = action.payload.token;
    })
    .addCase(login.rejected, (state) => {
      state.loading = false;
    })

   
    .addCase(registerUser.pending, (state) => {
      state.loading = true;
    })
    .addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.token = action.payload.token;
    })
    .addCase(registerUser.rejected, (state) => {
      state.loading = false;
    });
}
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;