import { createSlice } from '@reduxjs/toolkit';
import { dummyFestivals } from "../../utilities/festivalResultData";


const INITIAL_STATE = {
    // TODO: festivals should be blank in the beginning
    festivals: dummyFestivals,
    error: null
}

const festivalsSlice = createSlice({
    name: 'festivals',
    initialState: INITIAL_STATE,
    reducers: {
        saveFestival: (state, action) => {
            const id = action.payload;
            const festival = state.festivals.find(festival => festival.id === id);
            festival.saved = !festival.saved;
        },
        deleteFestival: (state, action) => {
            const id = action.payload;
            state.festivals = state.festivals.filter(festival => festival.id !== id);
        }
    }

});

export const {saveFestival, deleteFestival} = festivalsSlice.actions;
export default festivalsSlice.reducer;