import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks
export const fetchPosts = createAsyncThunk(
  'community/fetchPosts',
  async ({ page = 1, limit = 10, sort = 'latest', category = '', search = '', tag = '' }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/community/posts', {
        params: { page, limit, sort, category, search, tag },
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
  async (postData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return rejectWithValue('Authentication required');
      }

      const response = await axios.post('/api/community/posts', postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const fetchComments = createAsyncThunk(
  'community/fetchComments',
  async (arg, { rejectWithValue }) => {
    try {
      const postId = typeof arg === 'object' ? arg.postId : arg;
      const response = await axios.get(`/api/community/posts/${postId}/comments`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const addComment = createAsyncThunk(
  'community/addComment',
  async ({ postId, content, parentComment, attachments }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return rejectWithValue('Authentication required');
      }

      const response = await axios.post(`/api/community/posts/${postId}/comments`, {
        content,
        parentComment,
        attachments,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const toggleReaction = createAsyncThunk(
  'community/toggleReaction',
  async ({ id, targetType, type, targetId }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return rejectWithValue('required');
      }

      const response = await axios.post(`/api/community/posts/${id}/reactions`, {
        targetType,
        type,
        targetId: targetId || id, // Use targetId if provided, otherwise use id
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { id: targetId || id, targetType, type, action: response.data.action };
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

export const reportContent = createAsyncThunk(
  'community/reportContent',
  async ({ targetType, targetId, reason, description }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return rejectWithValue('Authentication required');
      }

      const response = await axios.post('/api/community/reports', {
        targetType,
        targetId,
        reason,
        description,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  'community/deletePost',
  async (postId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) return rejectWithValue('Authentication required');

      await axios.delete(`/api/community/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return postId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  'community/deleteComment',
  async (commentId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) return rejectWithValue('Authentication required');

      await axios.delete(`/api/community/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return commentId;
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
      .addCase(fetchComments.pending, (state, action) => {
        // Don't clear comments during polling to prevent flicker
        if (!action.meta.arg?.isPolling) {
          state.error = null;
        }
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        // Only update if we have data to prevent clearing on empty response
        if (action.payload && Array.isArray(action.payload)) {
          state.comments = action.payload;
        }
      })
      .addCase(fetchComments.rejected, (state, action) => {
        // Don't clear comments on error, just log it
        if (!action.meta.arg?.isPolling) {
          state.error = action.payload;
        }
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
      })
      // Delete Post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(p => p._id !== action.payload);
        if (state.currentPost && state.currentPost._id === action.payload) {
          state.currentPost = null;
        }
      })
      // Delete Comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(c => c._id !== action.payload);
        if (state.currentPost) {
          state.currentPost.commentsCount = Math.max(0, state.currentPost.commentsCount - 1);
        }
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
export const selectActionLoading = (state) => state.community.actionLoading;

export default communitySlice.reducer;
