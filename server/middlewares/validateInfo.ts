import type { Request, Response, NextFunction } from "express"

export const validataInfo = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.name || !req.body.email || !req.body.password || req.body.password.length < 8) return res.status(400).json({ message: 'Invalid info' })
    next()
}