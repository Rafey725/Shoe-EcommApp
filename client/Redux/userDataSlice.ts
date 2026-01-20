import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: '',
    email: ''
}

const userDataSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        setUserData: (state, action) => {
            state.name = action.payload.name;
            state.email = action.payload.email;
        }
    }
})

export const { setUserData } = userDataSlice.actions;
export default userDataSlice.reducer;