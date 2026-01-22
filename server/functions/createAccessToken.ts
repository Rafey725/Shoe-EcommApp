import jwt from 'jsonwebtoken'
import type { StringValue } from 'ms'

export default function createAccessToken({ userId, timePeriod='7d' }: { userId: string | number, timePeriod?: StringValue }) {
    return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: timePeriod });
}