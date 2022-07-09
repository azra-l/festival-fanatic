import { createSlice } from "@reduxjs/toolkit";
import { REQUEST_STATE } from "../utils";
import { getUpcomingArtistEventsAsync } from "./thunks";

const INITIAL_STATE = {
  festivals: [],
  getEventsStatus: null,
  error: null,
};

const festivalsSlice = createSlice({
  name: "festivals",
  initialState: INITIAL_STATE,
  reducers: {
    saveFestival: (state, action) => {
      const id = action.payload;
      const festival = state.festivals.find((festival) => festival.id === id);
      festival.saved = !festival.saved;
    },
    deleteFestival: (state, action) => {
      const id = action.payload;
      state.festivals = state.festivals.filter(
        (festival) => festival.id !== id
      );
    },
    archiveFestival: (state, action) => {
      const id = action.payload;
      const festival = state.festivals.find((festival) => festival.id === id);
      festival.archived = !festival.archived;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUpcomingArtistEventsAsync.pending, (state) => {
        state.getEventsStatus = REQUEST_STATE.PENDING;
        state.error = null;
      })
      .addCase(getUpcomingArtistEventsAsync.fulfilled, (state, action) => {
        state.getEventsStatus = REQUEST_STATE.FULFILLED;
        state.festivals = action.payload;
      })
      .addCase(getUpcomingArtistEventsAsync.rejected, (state, action) => {
        state.getEventsStatus = REQUEST_STATE.REJECTED;
        state.error = action.error;
      });
  },
});

export const { saveFestival, deleteFestival, archiveFestival } = festivalsSlice.actions;
export default festivalsSlice.reducer;
