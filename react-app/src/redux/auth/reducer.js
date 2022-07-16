import { createSlice } from "@reduxjs/toolkit";
import { REQUEST_STATE } from "../utils";
import { checkAuthAsync, } from "./thunks";

const INITIAL_STATE = {
    isAuthenticated: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState: INITIAL_STATE,
    reducers: {

        // archiveFestival: (state, action) => {
        //     const id = action.payload;
        //     const festival = state.festivals.find((festival) => festival.id === id);
        //     festival.archived = !festival.archived;
        // },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuthAsync.pending, (state) => {
                state.getAuthStatus = REQUEST_STATE.PENDING;
                state.error = null;
            })
            .addCase(checkAuthAsync.fulfilled, (state, action) => {
                state.getAuthStatus = REQUEST_STATE.FULFILLED;
                state.isAuthenticated = action.payload;
            })
            .addCase(checkAuthAsync.rejected, (state, action) => {
                state.getAuthStatus = REQUEST_STATE.REJECTED;
                state.error = action.error;
            })

    },
});

export const { saveFestival, deleteFestival, archiveFestival } =
    authSlice.actions;
export default authSlice.reducer;
