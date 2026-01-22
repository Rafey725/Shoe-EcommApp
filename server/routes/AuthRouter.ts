import jwt from 'jsonwebtoken';
import express from "express";
import { db } from "../db";
import { users } from "../schemas/userSchema";
import { eq } from "drizzle-orm";
import bcrypt from 'bcrypt'
import { validataInfo } from "../middlewares/validateInfo";
import createAccessToken from "../functions/createAccessToken";
import { OAuth2Client } from 'google-auth-library';
import generateOTP from '../functions/genertateOTP';
import sendOTPEmail from '../functions/sendOTPEmail';
import { storeOTP } from '../functions/storeOTP';
import { redis } from '../functions/redisClient';
// import 

const GOOGLE_CLIENT_ID = process.env.GOOGLE_WEB_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID)

const router = express.Router();

router.get('/me', async (req, res) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) return res.status(401).json({ message: 'No token provided' })
    const token = req.headers.authorization.split(' ')[1]
    try {
        if (!process.env.JWT_SECRET) return res.status(500).json({ message: 'Server error' })
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: number, iat?: number, exp?: number }

        if (!decoded.userId) return res.status(401).json({ message: 'INVALID_TOKEN' })
        const user = await db.select().from(users).where(eq(users.id, decoded.userId))

        // setTimeout(() => {
        res.status(200).json({ message: 'User data fetched successfully', data: { name: user[0].name, email: user[0].email } })
        // }, 10000)
    } catch (err) {
        console.log('Error from getting me request: ', err);
        console.log('Invalid or expired token');
        res.status(401).json({ message: 'INVALID_TOKEN' })
    }
})

router.post('/signup', validataInfo, async (req, res) => {
    // check if the email already exists
    const existingUser = await db.select().from(users).where(eq(users.email, req.body.email))
    if (existingUser.length > 0) return res.status(400).json({ message: 'Email already exists' })

    const password_hash = await bcrypt.hash(req.body.password, 12)

    // create a new user
    await db.insert(users).values({
        name: req.body.name,
        email: req.body.email,
        password_hash: password_hash
    })

    res.status(201).json({ message: 'User created successfully' })
})

router.post('/login', async (req, res) => {
    // check if the email exists
    const existingUser = await db.select().from(users).where(eq(users.email, req.body.email))
    if (existingUser.length === 0) return res.status(401).json({ message: 'Email does not exist' })

    const user = existingUser[0]

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password_hash)
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' })

    // generate a jwt token
    const token = createAccessToken({ userId: user.id })

    res.status(200).json({ message: 'User is authenticated', token: token })
})

router.post('/google_signin', async (req, res) => {
    try {
        const idToken = req.body.idToken
        if (!idToken) return res.status(400).json({ message: "Missing idToken" });

        const ticket = await googleClient.verifyIdToken({
            idToken, audience: GOOGLE_CLIENT_ID
        })

        const payload = ticket.getPayload()
        if (!payload) return res.status(401).json({ message: "Invalid token" });

        const { sub, email, email_verified, name, picture, iss, aud, exp, } = payload;

        if (!email || !email_verified) {
            return res.status(401).json({ message: "Email not verified" });
        }
        if (aud !== GOOGLE_CLIENT_ID) {
            return res.status(401).json({ message: "Wrong audience" });
        }
        if (iss !== "https://accounts.google.com" && iss !== "accounts.google.com") {
            return res.status(401).json({ message: "Wrong issuer" });
        }
        if (typeof exp === "number" && Date.now() >= exp * 1000) {
            return res.status(401).json({ message: "Token expired" });
        }

        // Try login by google 
        const googleUser = await db
            .select()
            .from(users)
            .where(eq(users.provider_user_id, sub));
        if (googleUser.length > 0) {
            const token = createAccessToken({ userId: googleUser[0].id })
            return res.status(200).json({ message: 'User authorized', token: token })
        }

        // Try link by email
        const emailUser = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
        if (emailUser.length > 0) {
            const [updatedUser] = await db
                .update(users)
                .set({ auth_provider: 'google', provider_user_id: sub })
                .where(eq(users.id, emailUser[0].id))
                .returning();
            const token = createAccessToken({ userId: updatedUser.id })
            return res.status(200).json({ message: "User authorized", token: token });
        }

        // Create new Google user
        const [newUser] = await db
            .insert(users)
            .values({
                name: name,
                email: email,
                auth_provider: 'google',
                provider_user_id: sub
            })
            .returning();
        console.log(newUser);

        const token = createAccessToken({ userId: newUser.id })
        return res.status(200).json({ message: 'User created', token: token })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server issue' })
    }
})

router.post('/requestOTP', async (req, res) => {
    const { OTP, hashedOTP } = await generateOTP(6);
    await storeOTP(req.body.email, hashedOTP)
    await sendOTPEmail({ email: req.body.email, otp: OTP })

    res.status(200).json({ message: 'OTP is sent to the email' })
})

router.post('/verifyOTP', async (req, res) => {
    const key = `otp:${req.body.email.toLocaleLowerCase()}`

    const rawData = await redis.get<string>(key)
    if (!rawData) return res.status(410).json({ message: 'OTP expired' });


    const data =
        typeof rawData === "string"
            ? (JSON.parse(rawData) as { otp: string; attempts: number | string })
            : (rawData as { otp: string; attempts: number | string });

    const hashedOtp = data.otp;

    const ok = await bcrypt.compare(req.body.otp, hashedOtp)
    if (!ok) return res.status(401).json({ message: 'Invalid OTP' });

    if (ok) await redis.del(key);

    // const resetToken = createAccessToken()
    return res.status(200).json({ message: 'OTP verified' })
})

router.put('/newPassword', async (req, res) => {
    const email = req.body.email;
    const hashedPass = await bcrypt.hash(req.body.pass, 12);

    await db
        .update(users)
        .set({ password_hash: hashedPass })
        .where(eq(users.email, email))
})

export default router