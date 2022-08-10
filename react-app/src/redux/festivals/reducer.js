import { createSlice } from "@reduxjs/toolkit";
import { REQUEST_STATE } from "../utils";
import { getUpcomingArtistEventsAsync, updateFestivalAsync, getSelectedArtistsAsync, addSelectedArtistAsync, deleteSelectedArtistAsync } from "./thunks";

const INITIAL_STATE = {
  festivals: [],
  selectedArtists: [],
  getEventsStatus: null,
  updateFestival: REQUEST_STATE.IDLE,
  error: null,
};

const festivalsSlice = createSlice({
  name: "festivals",
  initialState: INITIAL_STATE,
  reducers: {
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
      })
      .addCase(updateFestivalAsync.pending, (state) => {
        state.updateFestival = REQUEST_STATE.PENDING;
        state.error = null;
      })
      .addCase(updateFestivalAsync.fulfilled, (state, action) => {
        state.updateFestival = REQUEST_STATE.FULFILLED;
        const {_id, userAction} = action.payload;
        if(userAction === 'save' || userAction === 'unsave'){
          const festival = state.festivals.find((festival) => festival._id === _id);
          festival.saved = !festival.saved;
        };
        if(userAction === 'archive' || userAction === 'unarchive'){
          const festival = state.festivals.find((festival) => festival._id === _id);
          festival.archived = !festival.archived;
        };

      })
      .addCase(updateFestivalAsync.rejected, (state, action) => {
        state.updateFestival = REQUEST_STATE.REJECTED;
        state.error = action.error;
      })
      .addCase(getSelectedArtistsAsync.pending, (state) => {
        state.getEventsStatus = REQUEST_STATE.PENDING;
        state.error = null;
      })
      .addCase(getSelectedArtistsAsync.fulfilled, (state, action) => {
        state.getEventsStatus = REQUEST_STATE.FULFILLED;
        state.selectedArtists= action.payload;
      })
      .addCase(getSelectedArtistsAsync.rejected, (state, action) => {
        state.getEventsStatus = REQUEST_STATE.REJECTED;
        state.error = action.error;
      })
      .addCase(addSelectedArtistAsync.pending, (state) => {
        state.getEventsStatus = REQUEST_STATE.PENDING;
        state.error = null;
      })
      .addCase(addSelectedArtistAsync.fulfilled, (state, action) => {
        state.getEventsStatus = REQUEST_STATE.FULFILLED;
        state.selectedArtists= action.payload;
      })
      .addCase(addSelectedArtistAsync.rejected, (state, action) => {
        state.getEventsStatus = REQUEST_STATE.REJECTED;
        state.error = action.error;
      })
      .addCase(deleteSelectedArtistAsync.pending, (state) => {
        state.getEventsStatus = REQUEST_STATE.PENDING;
        state.error = null;
      })
      .addCase(deleteSelectedArtistAsync.fulfilled, (state, action) => {
        state.getEventsStatus = REQUEST_STATE.FULFILLED;
        state.selectedArtists= action.payload;
      })
      .addCase(deleteSelectedArtistAsync.rejected, (state, action) => {
        state.getEventsStatus = REQUEST_STATE.REJECTED;
        state.error = action.error;
      })
  },
});

export const { saveFestival, deleteFestival, archiveFestival } =
  festivalsSlice.actions;
export default festivalsSlice.reducer;
