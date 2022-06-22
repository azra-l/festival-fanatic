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

});

export default festivalsSlice.reducer;