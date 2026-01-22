import { redis } from "./redisClient"

export const getHashedOTP = async (email: string) => {
    const key = `otp:${email.toLocaleLowerCase()}`
    const rawData = await redis.get<string>(key)
    if (!rawData) return null;

    const data = JSON.parse(rawData) as { otp: string, attempts: number | string }
    return data.otp
}