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
        }
    }

});

export const {saveFestival} = festivalsSlice.actions;
export default festivalsSlice.reducer;