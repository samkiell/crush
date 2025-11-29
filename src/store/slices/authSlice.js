import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

// Cookie configuration
const TOKEN_COOKIE_NAME = 'auth_token';
const COOKIE_OPTIONS = {
  expires: 30, // 30 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
};

// Helper functions for token management
const saveToken = (token) => {
  Cookies.set(TOKEN_COOKIE_NAME, token, COOKIE_OPTIONS);
};

const getToken = () => {
  return Cookies.get(TOKEN_COOKIE_NAME);
};

const removeToken = () => {
  Cookies.remove(TOKEN_COOKIE_NAME);
};

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Server error';
      return rejectWithValue(message);
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      const { token, ...user } = response.data;
      
      // Save token to cookie
      saveToken(token);
      
      return { user, token };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Server error';
      return rejectWithValue(message);
    }
  }
);

// Async thunk to load user from stored token
export const loadUserFromToken = createAsyncThunk(
  'auth/loadFromToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      // Optionally verify token with backend
      // For now, we'll just return the token
      // You can add a /api/auth/verify endpoint later
      
      return { token };
    } catch (error) {
      removeToken();
      return rejectWithValue('Invalid token');
    }
  }
// Async thunk for updating user profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put('/api/users/profile', userData, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Server error';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous actions
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      removeToken();
    },
  },
  extraReducers: (builder) => {
    // Register user lifecycle
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        // Don't auto-login on registration, just clear loading
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Login user lifecycle
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Load user from token lifecycle
    builder
      .addCase(loadUserFromToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUserFromToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loadUserFromToken.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      })
      // Update profile lifecycle
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        state.loading = false;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});



export const { clearError, setUser, logout } = authSlice.actions;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;

export default authSlice.reducer;
