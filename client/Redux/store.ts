import { configureStore } from '@reduxjs/toolkit'
import userDataReducer from '@/Redux/userDataSlice'
import isLoadingReducer from '@/Redux/isLoadingSlice'

export const store = configureStore({
    reducer: {
        userData: userDataReducer,
        isLoading: isLoadingReducer
    },
})

export type RootState = ReturnType<typeof store.getState>;
