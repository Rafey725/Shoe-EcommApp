import jwt from 'jsonwebtoken'
import type { StringValue } from 'ms'

export default function createAccessToken(userId: string | number) {
    return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
}