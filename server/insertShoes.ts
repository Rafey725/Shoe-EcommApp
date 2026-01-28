import { db } from './db';
import { popular_shoes } from './schemas/shoeSchema';

export const insertShoes = async () => {
    return db.insert(popular_shoes).values(
       [
        
       ]

    )
}