import { createSlice } from "@reduxjs/toolkit";
import { REQUEST_STATE } from "../utils";
import { getUpcomingArtistEventsAsync } from "./thunks";

const INITIAL_STATE = {
  // TODO: festivals should be blank in the beginning
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

export const { saveFestival } = festivalsSlice.actions;
export default festivalsSlice.reducer;
