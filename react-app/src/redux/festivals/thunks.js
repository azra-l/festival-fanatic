import { createAsyncThunk } from "@reduxjs/toolkit";
import FestivalsService from "./service";

export const actionTypes = {
  GET_EVENTS: "festivals/getUpcomingArtistEvents",
  UPDATE_FESTIVAL: "festivals/updateFestival",
  GET_SELECTED_ARTISTS: "festivals/getSelectedArtists",
  ADD_SELECTED_ARTISTS: "festivals/addSelectedArtists",
  DELETE_SELECTED_ARTISTS: "festivals/deleteSelectedArtists",
};

export const getUpcomingArtistEventsAsync = createAsyncThunk(
  actionTypes.GET_EVENTS,
  async (id) => {
    return await FestivalsService.getUpcomingArtistEvents(id);
  }
);

export const updateFestivalAsync = createAsyncThunk(
  actionTypes.UPDATE_FESTIVAL,
  async ({ _id, action }) => {
    return await FestivalsService.updateFestival({ _id, action });
  }
);

export const getSelectedArtistsAsync = createAsyncThunk(
  actionTypes.GET_SELECTED_ARTISTS,
  async () => {
    return await FestivalsService.getSelectedArtists();
  }
);

export const addSelectedArtistAsync = createAsyncThunk(
  actionTypes.ADD_SELECTED_ARTISTS,
  async (value) => {
    return await FestivalsService.addSelectedArtist(value);
  }
);

export const deleteSelectedArtistAsync = createAsyncThunk(
  actionTypes.DELETE_SELECTED_ARTISTS,
  async (id) => {
    return await FestivalsService.deleteSelectedArtistAsync(id);
  }
)
