import { createAsyncThunk } from "@reduxjs/toolkit";
import FestivalsService from "./service";

export const actionTypes = {
  GET_EVENTS: "festivals/getUpcomingArtistEvents",
  UPDATE_FESTIVAL: "festivals/updateFestival",
};

export const getUpcomingArtistEventsAsync = createAsyncThunk(
  actionTypes.GET_EVENTS,
  async (id) => {
    return await FestivalsService.getUpcomingArtistEvents(id);
  }
);

export const updateFestivalAsync = createAsyncThunk(
  actionTypes.UPDATE_FESTIVAL,
  async ({ user, festival }) => {
    return await FestivalsService.updateFestival({ user, festival });
  }
);
