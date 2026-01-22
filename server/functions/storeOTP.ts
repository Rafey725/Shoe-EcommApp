import { redis } from "./redisClient"

export const storeOTP = async (email: string, hashedOTP: string) => {
    const key = `otp:${email.toLocaleLowerCase()}`

    const value = JSON.stringify({
        otp: hashedOTP,
        attempts: "0"
    })

    await redis.set(key, value, { ex: 300 }) // 5 minutes
}