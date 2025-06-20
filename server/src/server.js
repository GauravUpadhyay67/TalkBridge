import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes.js";
import connectDB from "./configs/mongodb.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use('/api/auth', authRouter);

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