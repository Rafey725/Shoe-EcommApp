import express from 'express';
import 'dotenv/config'
import AuthRouter from './routes/AuthRouter';
import ShoesRouter from './routes/ShoesRouter';

const app = express();
app.use(express.json())

app.use('/auth', AuthRouter)
app.use('/shoes', ShoesRouter)

app.listen(3051, () => {
    console.log('🚀 Server is running on port: 3051');
})