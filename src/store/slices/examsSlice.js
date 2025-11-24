import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentExam: null,
  examResults: [],
  timer: 0,
  isExamActive: false,
  answers: {},
  loading: false,
  error: null,
};

const examsSlice = createSlice({
  name: 'exams',
  initialState,
  reducers: {
    startExam: (state, action) => {
      state.currentExam = action.payload;
      state.isExamActive = true;
      state.timer = action.payload.duration * 60; // convert to seconds
      state.answers = {};
    },
    endExam: (state) => {
      state.isExamActive = false;
      state.timer = 0;
    },
    updateTimer: (state) => {
      if (state.timer > 0) {
        state.timer -= 1;
      }
    },
    submitAnswer: (state, action) => {
      const { questionId, answer } = action.payload;
      state.answers[questionId] = answer;
    },
    submitExamStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    submitExamSuccess: (state, action) => {
      state.examResults.push(action.payload);
      state.currentExam = null;
      state.isExamActive = false;
      state.timer = 0;
      state.answers = {};
      state.loading = false;
    },
    submitExamFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchExamResultsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchExamResultsSuccess: (state, action) => {
      state.examResults = action.payload;
      state.loading = false;
    },
    fetchExamResultsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  startExam,
  endExam,
  updateTimer,
  submitAnswer,
  submitExamStart,
  submitExamSuccess,
  submitExamFailure,
  fetchExamResultsStart,
  fetchExamResultsSuccess,
  fetchExamResultsFailure,
} = examsSlice.actions;

export default examsSlice.reducer;
