import mongoose from "mongoose";

const wordOfTheDaySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true
    },
    language: {
      type: String,
      required: true
    },
    word: {
      type: String,
      required: true
    },
    translation: {
      type: Map,
      of: String,
      default: {}
    },
    pronunciation: {
      type: String,
      default: ""
    },
    example: {
      type: String,
      default: ""
    },
    exampleTranslation: {
      type: Map,
      of: String,
      default: {}
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner"
    }
  },
  { timestamps: true }
);

// Create compound index for date and language
wordOfTheDaySchema.index({ date: 1, language: 1 });

const WordOfTheDay = mongoose.model("WordOfTheDay", wordOfTheDaySchema);
export default WordOfTheDay;
