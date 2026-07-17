import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  platforms: ['Instagram', 'LinkedIn', 'Facebook', 'Twitter'],
  selectedPlatform: 'Instagram'
};

const platformsSlice = createSlice({
  name: 'platforms',
  initialState,
  reducers: {
    addPlatform: (state, action) => {
      if (!state.platforms.includes(action.payload)) {
        state.platforms.push(action.payload);
      }
    },
    removePlatform: (state, action) => {
      state.platforms = state.platforms.filter((platform) => platform !== action.payload);
      if (state.selectedPlatform === action.payload) {
        state.selectedPlatform = state.platforms[0] || '';
      }
    },
    selectPlatform: (state, action) => {
      state.selectedPlatform = action.payload;
    }
  }
});

export const { addPlatform, removePlatform, selectPlatform } = platformsSlice.actions;
export default platformsSlice.reducer;
