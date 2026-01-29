import express, { Request, Response } from "express";
import { db } from "../db";
import { cart_items, cartItemsUserProductUnique } from "../schemas/cartSchema";
import { and, eq, lte, sql } from "drizzle-orm";
import { authMiddleware } from "../middlewares/authMiddleware";
import { popular_shoes } from "../schemas/shoeSchema";
import { createSignedUrl } from "../functions/createSignedUrl";

const router = express.Router()

interface myRequest extends Request {
    user: {
        id: number
    }
}

router.get('/items', authMiddleware, async (req: myRequest, res: Response) => {
    const cartItems = await db
        .select({
            productId: cart_items.productId,
            quantity: cart_items.quantity,
            shoe_name: popular_shoes.shoe_name,
            price: popular_shoes.price,
            shoe_image_path: popular_shoes.shoe_image_path
        })
        .from(cart_items)
        .innerJoin(
            popular_shoes,
            eq(cart_items.productId, popular_shoes.id)
        )
        .where(eq(cart_items.userId, req.user.id));

    const response = await Promise.all(cartItems.map(async (cartItem) => ({
        ...cartItem,
        shoe_image_path: await createSignedUrl(cartItem.shoe_image_path)
    })))

    return res.status(200).json({ message: 'Cart items are successfully fetched', cartItems: response })
})

router.post('/addToCart', authMiddleware, async (req: myRequest, res) => {
    const productId = req.body.product_id
    await db
        .insert(cart_items)
        .values({
            userId: req.user.id,
            productId: productId,
            quantity: 1
        })
        .onConflictDoUpdate({
            target: [cart_items.userId, cart_items.productId],
            set: {
                quantity: sql`${cart_items.quantity}+1`
            }
        });
    res.status(200).json({ message: 'Item is successfully added to the cart' })
})

router.post('/removeFromCart', authMiddleware, async (req: myRequest, res) => {
    const productId = req.body.productId;
    // Decrease the item's quantity
    await db
        .update(cart_items)
        .set({ quantity: sql`${cart_items.quantity}-1` })
        .where(
            and(
                eq(cart_items.userId, req.user.id),
                eq(cart_items.productId, productId)
            )
        )

    // Remove the item if quantity is 0
    await db
        .delete(cart_items)
        .where(
            and(
                eq(cart_items.userId, req.user.id),
                eq(cart_items.productId, productId),
                lte(cart_items.quantity, 0)
            )
        );
    res.status(200).json({ message: 'The item is successfully decreamented' })
})

export default router;