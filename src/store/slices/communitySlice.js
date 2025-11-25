import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks
export const fetchPosts = createAsyncThunk(
  'community/fetchPosts',
  async ({ page = 1, limit = 10, sort = 'latest', category = '', search = '' }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/community/posts', {
        params: { page, limit, sort, category, search },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const fetchPostDetails = createAsyncThunk(
  'community/fetchPostDetails',
  async (arg, { rejectWithValue }) => {
    try {
      const id = typeof arg === 'object' ? arg.id : arg;
      const response = await axios.get(`/api/community/posts/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const createPost = createAsyncThunk(
  'community/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/community/posts', postData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const fetchComments = createAsyncThunk(
  'community/fetchComments',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/community/posts/${postId}/comments`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const addComment = createAsyncThunk(
  'community/addComment',
  async ({ postId, content, parentComment }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/community/posts/${postId}/comments`, {
        content,
        parentComment,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const toggleReaction = createAsyncThunk(
  'community/toggleReaction',
  async ({ id, targetType, type }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/community/posts/${id}/reactions`, {
        targetType,
        type,
      });
      return { id, targetType, type, action: response.data.action };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const fetchStats = createAsyncThunk(
  'community/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/community/stats');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const initialState = {
  posts: [],
  currentPost: null,
  comments: [],
  stats: {
    activeUsers: 0,
    discussions: 0,
    topContributors: [],
    trendingTopics: [],
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  },
  loading: false,
  error: null,
  actionLoading: false, // For create/comment/react actions
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    clearCurrentPost: (state) => {
      state.currentPost = null;
      state.comments = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Posts
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        if (!action.meta.arg?.isPolling) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Post Details
    builder
      .addCase(fetchPostDetails.pending, (state, action) => {
        if (!action.meta.arg?.isPolling) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchPostDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Post
    builder
      .addCase(createPost.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });

    // Fetch Comments
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
      });

    // Add Comment
    builder
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
        if (state.currentPost) {
          state.currentPost.commentsCount += 1;
        }
      });

    // Toggle Reaction
    builder
      .addCase(toggleReaction.fulfilled, (state, action) => {
        const { id, targetType, action: reactionAction } = action.payload;
        const change = reactionAction === 'added' ? 1 : -1;

        if (targetType === 'CommunityPost') {
          // Update in posts list
          const post = state.posts.find(p => p._id === id);
          if (post) post.likes += change;
          
          // Update in current post
          if (state.currentPost && state.currentPost._id === id) {
            state.currentPost.likes += change;
          }
        } else if (targetType === 'Comment') {
          const comment = state.comments.find(c => c._id === id);
          if (comment) comment.likes += change;
        }
      });

    // Fetch Stats
    builder
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { clearCurrentPost, clearError } = communitySlice.actions;

// Selectors
export const selectCommunityPosts = (state) => state.community.posts;
export const selectCurrentPost = (state) => state.community.currentPost;
export const selectCommunityComments = (state) => state.community.comments;
export const selectCommunityLoading = (state) => state.community.loading;
export const selectCommunityError = (state) => state.community.error;
export const selectCommunityStats = (state) => state.community.stats;
export const selectCommunityPagination = (state) => state.community.pagination;

export default communitySlice.reducer;
