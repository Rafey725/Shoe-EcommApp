import { bigserial, real, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const popular_shoes = pgTable('popular_shoes', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    shoe_name: text('shoe_name').notNull(),
    badge: text('badge'),
    price: text('price').notNull(),
    description: text('description'),
    shoe_image_path: text('shoe_image_path').notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    scale: real('scale').default(1)
})