import express from 'express';
import { getDailyPrompt, getWordOfTheDay, translateText } from '../controllers/languageController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const languageRouter = express.Router();

// Apply auth middleware to all routes
languageRouter.use(protectRoute);

languageRouter.get('/prompt', getDailyPrompt);
languageRouter.get('/word-of-day', getWordOfTheDay);
languageRouter.post('/translate', translateText);

export default languageRouter;
