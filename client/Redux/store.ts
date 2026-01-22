import { configureStore } from '@reduxjs/toolkit'
import userDataReducer from '@/Redux/userDataSlice'
import isLoadingReducer from '@/Redux/isLoadingSlice'
import recoveryEmailReducer from '@/Redux/recoveryEmailSlice'

export const store = configureStore({
    reducer: {
        userData: userDataReducer,
        isLoading: isLoadingReducer,
        recoveryEmail: recoveryEmailReducer
    },
})

export type RootState = ReturnType<typeof store.getState>;
