import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: {
    totalQuestions: 0,
    completedExams: 0,
    averageScore: 0,
    weakTopics: [],
  },
  progress: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    fetchDashboardStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDashboardSuccess: (state, action) => {
      state.stats = action.payload.stats;
      state.progress = action.payload.progress;
      state.loading = false;
      state.error = null;
    },
    fetchDashboardFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateProgress: (state, action) => {
      state.progress = action.payload;
    },
  },
});

export const {
  fetchDashboardStart,
  fetchDashboardSuccess,
  fetchDashboardFailure,
  updateProgress,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;

