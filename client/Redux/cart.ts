import { createSlice } from "@reduxjs/toolkit";

type CartItem = {
    shoe_name: string,
    price: string,
    shoe_image_url: string,
    amount: number
}

const initialState: { cartItems: CartItem[] } = {
    cartItems: []
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            if (state.cartItems.length === 0) {
                state.cartItems.push({ ...action.payload, amount: 1 })
            } else {
                const alreadyAdded = state.cartItems.some(item => {
                    return item.shoe_name.toLowerCase() === action.payload.shoe_name.toLowerCase()
                })

                if (alreadyAdded) {
                    state.cartItems.forEach(item => {
                        if (item.shoe_name.toLowerCase() === action.payload.shoe_name.toLowerCase()) {
                            item.amount++
                        }
                    })
                }
                else {
                    state.cartItems.push({ ...action.payload, amount: 1 })
                }
            }
        }
    }
})

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;