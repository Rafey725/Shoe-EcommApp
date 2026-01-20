import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
const pool = new Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: Number(process.env.DB_PORT),
    max: 10,
    connectionTimeoutMillis: 2000,
    idleTimeoutMillis: 30_000
});

pool.on("connect", (client) => {
    client.query(`SET statement_timeout = '3000ms'`).catch(() => { });
});

export const db = drizzle(pool)