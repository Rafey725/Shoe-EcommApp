import {
    pgTable,
    bigint,
    integer,
    timestamp,
    uniqueIndex,
    index,
    bigserial,
} from "drizzle-orm/pg-core";

import { users } from "./userSchema";
import { popular_shoes } from "./shoeSchema";

export const cart_items = pgTable("cart_items", {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    userId: bigint("user_id", { mode: "number" }).notNull().references(() => users.id, { onDelete: "cascade" }),
    productId: bigint("product_id", { mode: "number" }).notNull().references(() => popular_shoes.id, { onDelete: "restrict" }),
    quantity: integer("quantity").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const cartItemsUserIdx = index("cart_items_user_id_idx").on(
    cart_items.userId
);

export const cartItemsUserProductUnique = uniqueIndex(
    "cart_user_product_unique"
).on(cart_items.userId, cart_items.productId);
