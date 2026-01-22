import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export default async function sendOTPEmail({ email, otp }) {
    await transporter.sendMail({
        from: `"My App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your OTP Code',
        html: `
            <div style="font-family: Arial">
                <h2>Your OTP Code</h2>
                <p>Use this code to continue:</p>
                <h1 style="letter-spacing:4px">${otp}</h1>
                <p>This code expires in 5 minutes.</p>
            </div>
            `
    })
}