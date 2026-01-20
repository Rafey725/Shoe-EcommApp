import { configureStore } from '@reduxjs/toolkit'
import userDataReducer from '@/Redux/userDataSlice'

export const store = configureStore({
    reducer: {
        userData: userDataReducer
    },
})

export type RootState = ReturnType<typeof store.getState>;
