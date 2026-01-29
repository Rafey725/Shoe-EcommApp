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
                let item = state.cartItems.find(item => {
                    return item.shoe_name.toLowerCase() === action.payload.shoe_name.toLowerCase()
                })
                if (item) {
                    item.amount += 1;
                } else {
                    state.cartItems.push({ ...action.payload, amount: 1 })
                }
            }
        },
        removeFromCart: (state, action) => {
            state.cartItems.forEach((item, idx) => {
                if (item.shoe_name.toLowerCase() === action.payload.shoe_name.toLowerCase()) {
                    if (item.amount === 1) state.cartItems.splice(idx, 1)
                    else item.amount -= 1;
                }
            })
        },
        deleteFromCart: (state, action) => {
            state.cartItems.forEach((item, idx) => {
                if (item.shoe_name.toLowerCase() === action.payload.shoe_name.toLowerCase()) state.cartItems.splice(idx, 1)
            })
        }
    }
})

export const { addToCart, removeFromCart, deleteFromCart } = cartSlice.actions;
export default cartSlice.reducer;