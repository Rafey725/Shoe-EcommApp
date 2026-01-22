import crypto from 'crypto'
import bcrypt from 'bcrypt'

export default async function generateOTP(length = 6) {
    // Generate a random integer between 10^(length-1) and 10^length - 1
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    const otp = crypto.randomInt(min, max + 1);
    const hashedOTP = await bcrypt.hash(JSON.stringify(otp), 12)
    return { OTP: otp, hashedOTP: hashedOTP }
}