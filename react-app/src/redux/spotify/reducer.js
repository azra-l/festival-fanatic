import { createSlice } from '@reduxjs/toolkit';
// import { REQUEST_STATE } from '../utils';
import { spotifyUserTopItems } from '../../utilities/spotify-user-top-items';

const INITIAL_STATE = {
    // TODO: spotifyTopArtists should be blank in the beginning
    spotifyTopArtists: spotifyUserTopItems,
    // getSpotifyTopArtists: REQUEST_STATE.IDLE,
    // addUser: REQUEST_STATE.IDLE,
    error: null
}

const spotifySlice = createSlice({
    name: 'spotify',
    initialState: INITIAL_STATE,
    // reducers: {
    //     getSpotifyTopArtistsAsync: (state, action) => {
    //         state.spotifyTopArtists.push(action.payload)
    //     }
    // },
    // extraReducers: (builder) => {
    //     // TODO: Finish making the requests to Spotify
    //     builder
    //         .addCase(getSpotifyTopArtistsAsync.pending, (state) => {
    //             state.getUsers = REQUEST_STATE.PENDING;
    //             state.error = null;
    //         })
    //         .addCase(getSpotifyTopArtistsAsync.fulfilled, (state, action) => {
    //             state.getUsers = REQUEST_STATE.FULFILLED;
    //             state.spotifyTopArtists = action.payload;
    //         })
    //         .addCase(getSpotifyTopArtistsAsync.rejected, (state, action) => {
    //             state.getUsers = REQUEST_STATE.REJECTED;
    //             state.error = action.error;
    //         })
    // }
});

// export const { addSpotifyTopArtists } = spotifySlice.actions;

export default spotifySlice.reducer;