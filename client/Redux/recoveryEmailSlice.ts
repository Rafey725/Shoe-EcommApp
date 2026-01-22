import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    recoveryEmail: ''
}

const recoveryEmailSlice = createSlice({
    name: 'recoveryEmail',
    initialState,
    reducers: {
        setRecoveryEmail: (state, action) => {
            state.recoveryEmail = action.payload
        },
        removeRecoveryEmail: (state) => {
            state.recoveryEmail = ''
        }
    }
})

export const { setRecoveryEmail, removeRecoveryEmail } = recoveryEmailSlice.actions;
export default recoveryEmailSlice.reducer;