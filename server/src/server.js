import cors from 'cors';
import dotenv from "dotenv";
import express from "express";
import path from 'path';

import cookieParser from 'cookie-parser';
import connectDB from "./configs/mongodb.js";
import { seedConversationPrompts, seedWordsOfTheDay } from "./controllers/languageController.js";
import authRouter from "./routes/authRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import languageRouter from "./routes/languageRoutes.js";
import userRouter from "./routes/userRoutes.js";
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
app.use('/api/language', languageRouter);

if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'dist', 'index.html'))
  })
}

connectDB()
  .then(async () => {
    // Seed initial data
    await seedConversationPrompts();
    await seedWordsOfTheDay();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB failed:", err.message);
    process.exit(1);
  });