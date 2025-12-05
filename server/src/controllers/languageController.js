import axios from "axios";
import ConversationPrompt from "../models/ConversationPrompt.js";
import WordOfTheDay from "../models/WordOfTheDay.js";

// LibreTranslate API - free translation service
const TRANSLATE_API_URL = process.env.TRANSLATE_API_URL || "https://libretranslate.de/translate";

export const getDailyPrompt = async (req, res) => {
  try {
    const userProficiency = req.user.proficiencyLevel || "beginner";
    
    // Get random prompt matching user's proficiency
    const prompts = await ConversationPrompt.find({
      difficulty: userProficiency
    });

    if (prompts.length === 0) {
      // Fallback to any prompt
      const allPrompts = await ConversationPrompt.find({});
      if (allPrompts.length === 0) {
        return res.status(404).json({ message: "No prompts available. Please seed the database." });
      }
      const randomPrompt = allPrompts[Math.floor(Math.random() * allPrompts.length)];
      return res.status(200).json(randomPrompt);
    }

    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    res.status(200).json(randomPrompt);
  } catch (error) {
    console.error("Error in getDailyPrompt controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getWordOfTheDay = async (req, res) => {
  try {
    const { language } = req.query;
    const targetLanguage = language || req.user.learningLanguage || "spanish";

    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let wordOfDay = await WordOfTheDay.findOne({
      date: today,
      language: targetLanguage
    });

    if (!wordOfDay) {
      // If no word for today, get the most recent word for this language
      wordOfDay = await WordOfTheDay.findOne({
        language: targetLanguage
      }).sort({ date: -1 });

      if (!wordOfDay) {
        return res.status(404).json({ 
          message: "No word of the day available for this language. Please seed the database." 
        });
      }
    }

    res.status(200).json(wordOfDay);
  } catch (error) {
    console.error("Error in getWordOfTheDay controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const translateText = async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;

    if (!text || !sourceLang || !targetLang) {
      return res.status(400).json({ 
        message: "Missing required fields: text, sourceLang, targetLang" 
      });
    }

    // Call LibreTranslate API
    const response = await axios.post(TRANSLATE_API_URL, {
      q: text,
      source: sourceLang,
      target: targetLang,
      format: "text"
    });

    const translatedText = response.data.translatedText;

    res.status(200).json({
      original: text,
      translated: translatedText,
      sourceLang,
      targetLang
    });
  } catch (error) {
    console.error("Error in translateText controller", error.message);
    
    // Handle API errors
    if (error.response) {
      return res.status(error.response.status).json({ 
        message: error.response.data.error || "Translation failed" 
      });
    }
    
    res.status(500).json({ message: "Translation service unavailable" });
  }
};

// Seed initial conversation prompts
export const seedConversationPrompts = async () => {
  try {
    const count = await ConversationPrompt.countDocuments();
    if (count > 0) {
      console.log("Conversation prompts already seeded");
      return;
    }

    const prompts = [
      // Beginner prompts
      { topic: "Daily Life", promptEnglish: "What did you do today?", difficulty: "beginner", tags: ["daily", "routine"] },
      { topic: "Food", promptEnglish: "What's your favorite food?", difficulty: "beginner", tags: ["food", "preferences"] },
      { topic: "Hobbies", promptEnglish: "What do you like to do in your free time?", difficulty: "beginner", tags: ["hobbies", "interests"] },
      { topic: "Travel", promptEnglish: "Have you traveled anywhere interesting?", difficulty: "beginner", tags: ["travel", "experiences"] },
      { topic: "Movies", promptEnglish: "What kind of movies do you enjoy?", difficulty: "beginner", tags: ["entertainment", "movies"] },
      
      // Intermediate prompts
      { topic: "Culture", promptEnglish: "How do people in your country celebrate special occasions?", difficulty: "intermediate", tags: ["culture", "traditions"] },
      { topic: "Technology", promptEnglish: "How has technology changed your daily life?", difficulty: "intermediate", tags: ["technology", "lifestyle"] },
      { topic: "Work", promptEnglish: "What do you find most challenging about your work or studies?", difficulty: "intermediate", tags: ["work", "challenges"] },
      { topic: "Nature", promptEnglish: "What's your opinion on environmental conservation?", difficulty: "intermediate", tags: ["environment", "opinion"] },
      { topic: "Books", promptEnglish: "Can you recommend a book that changed your perspective?", difficulty: "intermediate", tags: ["books", "recommendations"] },
      
      // Advanced prompts
      { topic: "Culture", promptEnglish: "How do cultural differences affect international communication?", difficulty: "advanced", tags: ["culture", "communication"] },
      { topic: "Technology", promptEnglish: "What ethical concerns do you have about artificial intelligence?", difficulty: "advanced", tags: ["AI", "ethics"] },
      { topic: "Travel", promptEnglish: "How has traveling influenced your worldview and personal growth?", difficulty: "advanced", tags: ["travel", "philosophy"] },
      { topic: "Art", promptEnglish: "In what ways does art reflect societal values and changes?", difficulty: "advanced", tags: ["art", "society"] },
      { topic: "Daily Life", promptEnglish: "How do you maintain work-life balance in modern society?", difficulty: "advanced", tags: ["lifestyle", "balance"] }
    ];

    await ConversationPrompt.insertMany(prompts);
    console.log("✅ Conversation prompts seeded successfully");
  } catch (error) {
    console.error("Error seeding conversation prompts:", error.message);
  }
};

// Seed initial words of the day
export const seedWordsOfTheDay = async () => {
  try {
    const count = await WordOfTheDay.countDocuments();
    if (count > 0) {
      console.log("Words of the day already seeded");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const words = [
      // Spanish words
      {
        date: today,
        language: "spanish",
        word: "Aprender",
        translation: new Map([["english", "To learn"]]),
        pronunciation: "ah-pren-DEHR",
        example: "Me gusta aprender nuevos idiomas.",
        exampleTranslation: new Map([["english", "I like to learn new languages."]]),
        difficulty: "beginner"
      },
      // French words
      {
        date: today,
        language: "french",
        word: "Apprentissage",
        translation: new Map([["english", "Learning"]]),
        pronunciation: "ah-pron-tee-SAHZH",
        example: "L'apprentissage d'une langue prend du temps.",
        exampleTranslation: new Map([["english", "Learning a language takes time."]]),
        difficulty: "intermediate"
      },
      // German words
      {
        date: today,
        language: "german",
        word: "Lernen",
        translation: new Map([["english", "To learn"]]),
        pronunciation: "LEHR-nen",
        example: "Ich möchte Deutsch lernen.",
        exampleTranslation: new Map([["english", "I want to learn German."]]),
        difficulty: "beginner"
      }
    ];

    await WordOfTheDay.insertMany(words);
    console.log("✅ Words of the day seeded successfully");
  } catch (error) {
    console.error("Error seeding words of the day:", error.message);
  }
};
