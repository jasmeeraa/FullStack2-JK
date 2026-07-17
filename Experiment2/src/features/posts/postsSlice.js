import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  drafts: [],
  loading: false,
  error: null
};

export const fetchSamplePosts = createAsyncThunk(
  'posts/fetchSamplePosts',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return [
        {
          id: 1,
          title: 'Launch Day Tip',
          content: 'Share a quick behind-the-scenes update with your audience.',
          platform: 'Instagram'
        },
        {
          id: 2,
          title: 'Community Highlight',
          content: 'Celebrate a customer success story to build trust.',
          platform: 'LinkedIn'
        }
      ];
    } catch (error) {
      return rejectWithValue('Could not load sample posts.');
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: (state, action) => {
      state.posts.push(action.payload);
    },
    updatePost: (state, action) => {
      const index = state.posts.findIndex((post) => post.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
    addDraft: (state, action) => {
      state.drafts.push(action.payload);
    },
    publishDraft: (state, action) => {
      const draft = state.drafts.find((item) => item.id === action.payload);
      if (draft) {
        state.posts.push(draft);
        state.drafts = state.drafts.filter((item) => item.id !== action.payload);
      }
    },
    clearDrafts: (state) => {
      state.drafts = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSamplePosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSamplePosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchSamplePosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch posts.';
      });
  }
});

export const {
  addPost,
  updatePost,
  deletePost,
  addDraft,
  publishDraft,
  clearDrafts
} = postsSlice.actions;

export default postsSlice.reducer;
