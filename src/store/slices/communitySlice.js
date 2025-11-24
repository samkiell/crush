import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  currentPost: null,
  comments: [],
  loading: false,
  error: null,
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    fetchPostsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPostsSuccess: (state, action) => {
      state.posts = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchPostsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
    fetchCommentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCommentsSuccess: (state, action) => {
      state.comments = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchCommentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createPostStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createPostSuccess: (state, action) => {
      state.posts.unshift(action.payload);
      state.loading = false;
      state.error = null;
    },
    createPostFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addComment: (state, action) => {
      state.comments.push(action.payload);
    },
  },
});

export const {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
  setCurrentPost,
  fetchCommentsStart,
  fetchCommentsSuccess,
  fetchCommentsFailure,
  createPostStart,
  createPostSuccess,
  createPostFailure,
  addComment,
} = communitySlice.actions;

export default communitySlice.reducer;
