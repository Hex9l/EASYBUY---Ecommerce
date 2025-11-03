import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import http from 'http';
import connectDB from './config/connectDB.js';
import userRouter from './route/user.route.js';
import categoryRouter from './route/category.Route.js';
import uploadRouter from './route/upload.router.js';

const app = express();

// For JSON
app.use(express.json());

// For URL encoded form
app.use(express.urlencoded({ extended: true }));


app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet({
    crossOriginResourcePolicy: false,
}));

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    // server to client
    res.json({
        message: 'Hello from the server!'+ PORT
    })
})
 
app.use('/api/user', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/upload', uploadRouter);

const server = http.createServer(app);

connectDB().then(() => {   
    server.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
})




