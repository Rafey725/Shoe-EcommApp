import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    detail: {
        badge: '',
        shoeName: '',
        price: '',
        desc: '',
        shoeImage: require('@/assets/Popular-Shoes/nike-air-max.png')
    }
}

const shoesDetail = createSlice({
    name: 'shoesDetail',
    initialState,
    reducers: {
        setShoesDetail: (state, action) => {
            state.detail = action.payload
        }
    }
})

export const { setShoesDetail } = shoesDetail.actions;
export default shoesDetail.reducer;