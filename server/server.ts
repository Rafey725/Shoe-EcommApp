import express from 'express';
import 'dotenv/config'
import AuthRouter from './routes/AuthRouter';

const app = express()
app.use(express.json())

app.use('/auth', AuthRouter)

app.listen(3051, () => {
    console.log('🚀 Server is running on port: 3051');
})