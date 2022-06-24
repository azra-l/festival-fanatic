import { createSlice } from '@reduxjs/toolkit';
import { REQUEST_STATE } from '../utils';
import { getUpcomingArtistEventsAsync } from './thunks';

const INITIAL_STATE = {
    // TODO: festivals should be blank in the beginning
    festivals: [],
    getEventsStatus: null,
    error: null
}

const festivalsSlice = createSlice({
    name: 'festivals',
    initialState: INITIAL_STATE,
    reducers: {},
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
    }

});

export default festivalsSlice.reducer;