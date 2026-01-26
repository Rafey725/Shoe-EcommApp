import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: '',
    email: '',
    profile_url: ''
}

const userDataSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        setUserData: (state, action) => {
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.profile_url = action.payload.profile_url;
        }
    }
})

export const { setUserData } = userDataSlice.actions;
export default userDataSlice.reducer;