import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import path from 'path';

import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import connectDB from "./configs/mongodb.js";
import cookieParser from 'cookie-parser';
import chatRouter from "./routes/chatRoutes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

const __dirname = path.resolve();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser())

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/chat', chatRouter);

if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'dist', 'index.html'))
  })
}

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB failed:", err.message);
    process.exit(1);
  });