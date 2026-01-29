import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";

interface myRequest extends Request {
    user: {
        id: number
    }
}

export const authMiddleware = (req: myRequest, res: Response, next: NextFunction) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) return res.status(401).json({ message: 'No token provided' })
    const token = req.headers.authorization.split(' ')[1]

    if (!process.env.JWT_SECRET) return res.status(500).json({ message: 'Server error' })
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: number, iat?: number, exp?: number }

    if (!decoded.userId) return res.status(401).json({ message: 'INVALID_TOKEN' })
    req.user = {
        id: decoded.userId
    }
    next()
}