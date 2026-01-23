import jwt from 'jsonwebtoken';

export default function createResetToken(email: string) {
    return jwt.sign({ email }, process.env.JWT_SECRET as string, { expiresIn: '10m' })
}