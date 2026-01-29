import express from 'express'
import { popular_shoes } from '../schemas/shoeSchema'
import { db } from '../db'
import { supabaseAdmin } from '../supabaseClient'
import { createSignedUrl } from '../functions/createSignedUrl'

const router = express.Router()

router.get('/popular_shoes', async (req, res) => {
    try {
        const shoesResult = await db
            .select()
            .from(popular_shoes);

        const shoesWtihImages = await Promise.all(
            shoesResult.map(async (shoe) => {
                const signedUrl = await createSignedUrl(shoe.shoe_image_path)

                return {
                    id: shoe.id,
                    shoe_name: shoe.shoe_name,
                    badge: shoe.badge,
                    price: shoe.price,
                    description: shoe.description,
                    shoe_image_url: signedUrl,
                    scale: shoe.scale
                }
            })
        )

        return res.status(200).json({ message: 'Fetched the shoes successfully', shoes: shoesWtihImages })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Failed to load the shoe images' })
    }
})

export default router