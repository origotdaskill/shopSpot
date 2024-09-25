import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state
const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

// Async thunks for authentication actions
export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData) => {
    const response = await axios.post(
      "https://shopspot-mgbu.onrender.com/api/auth/register",
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData) => {
    const response = await axios.post(
      "https://shopspot-mgbu.onrender.com/api/auth/login",
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

export const logoutUser = createAsyncThunk("/auth/logout", async () => {
  const response = await axios.post(
    "https://shopspot-mgbu.onrender.com/api/auth/logout",
    {},
    {
      withCredentials: true,
    }
  );
  return response.data;
});

// Check auth status, and retrieve user from localStorage if available
export const checkAuth = createAsyncThunk("/auth/checkauth", async () => {
  // Retrieve user data and token from localStorage
  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("authToken");

  if (storedUser && token) {
    return {
      success: true,
      user: JSON.parse(storedUser),
    };
  }

  // If no local storage data, check with API
  const response = await axios.get(
    "https://shopspot-mgbu.onrender.com/api/auth/check-auth",
    {
      withCredentials: true,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    }
  );

  return response.data;
});

// Redux slice for auth
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;

        // Save user and token in localStorage
        if (action.payload.success) {
          localStorage.setItem("user", JSON.stringify(action.payload.user));
          localStorage.setItem("authToken", action.payload.token);
        }
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;

        // Save user and token in localStorage if not already saved
        if (action.payload.success && !localStorage.getItem("user")) {
          localStorage.setItem("user", JSON.stringify(action.payload.user));
          localStorage.setItem("authToken", action.payload.token);
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;

        // Remove user and token from localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
