import { createAsyncThunk } from '@reduxjs/toolkit';
import FestivalsService from './service';

export const actionTypes = {
    GET_EVENTS: 'festivals/getUpcomingArtistEvents',
};

export const getUpcomingArtistEventsAsync = createAsyncThunk(
    actionTypes.GET_EVENTS,
    async (artistName) => {
        return await FestivalsService.getUpcomingArtistEvents(artistName);
    }
);
