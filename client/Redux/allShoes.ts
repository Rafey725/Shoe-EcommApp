import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allShoes: []
}

const allShoes = createSlice({
    name: 'allShoes',
    initialState,
    reducers: {
        setShoes: (state, action) => {
            state.allShoes = action.payload
        }
    }
})

export const { setShoes } = allShoes.actions;
export default allShoes.reducer;