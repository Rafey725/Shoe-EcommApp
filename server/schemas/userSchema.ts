import { bigserial, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    email: text('email').unique().notNull(),
    password_hash: text('password_hash'),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    auth_provider: text('auth_provider').notNull().default('email'),
    provider_user_id: text('provider_user_id'),
    profile_url: text('profile_url')
})