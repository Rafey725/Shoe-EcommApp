import jwt from 'jsonwebtoken'

export default function createAccessToken(userId: string | number) {
    return jwt.sign({  userId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
}