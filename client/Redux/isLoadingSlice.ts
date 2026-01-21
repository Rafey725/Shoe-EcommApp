import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: false
}

const isLoadingSlice = createSlice({
    name: 'isLoading',
    initialState,
    reducers: {
        setIsLoadingTrue: (state) => {
            state.value = true
        },
        setIsLoadingFalse: (state) => {
            state.value = false
        }
    }
})

export const { setIsLoadingTrue, setIsLoadingFalse } = isLoadingSlice.actions;
export default isLoadingSlice.reducer;