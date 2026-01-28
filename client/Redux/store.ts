import { configureStore } from '@reduxjs/toolkit'
import userDataReducer from '@/Redux/userDataSlice'
import isLoadingReducer from '@/Redux/isLoadingSlice'
import recoveryEmailReducer from '@/Redux/recoveryEmailSlice'
import shoesDetailReducer from '@/Redux/shoesDetail'
import allShoesReducer from '@/Redux/allShoes'
import cartReducer from '@/Redux/cart'

export const store = configureStore({
    reducer: {
        userData: userDataReducer,
        isLoading: isLoadingReducer,
        recoveryEmail: recoveryEmailReducer,
        shoesDetail: shoesDetailReducer,
        allShoes: allShoesReducer,
        cart: cartReducer
    },
})

export type RootState = ReturnType<typeof store.getState>;