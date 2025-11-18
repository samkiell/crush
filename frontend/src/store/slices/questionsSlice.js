import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  questions: [],
  currentQuestion: null,
  loading: false,
  error: null,
  filters: {
    subject: '',
    topic: '',
    difficulty: '',
  },
  bookmarks: [],
};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    fetchQuestionsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchQuestionsSuccess: (state, action) => {
      state.questions = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchQuestionsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    addBookmark: (state, action) => {
      if (!state.bookmarks.includes(action.payload)) {
        state.bookmarks.push(action.payload);
      }
    },
    removeBookmark: (state, action) => {
      state.bookmarks = state.bookmarks.filter(id => id !== action.payload);
    },
    loadOfflineQuestions: (state, action) => {
      state.questions = action.payload;
    },
  },
});

export const {
  fetchQuestionsStart,
  fetchQuestionsSuccess,
  fetchQuestionsFailure,
  setCurrentQuestion,
  setFilters,
  addBookmark,
  removeBookmark,
  loadOfflineQuestions,
} = questionsSlice.actions;

export default questionsSlice.reducer;
