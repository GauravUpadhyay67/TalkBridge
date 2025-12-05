import mongoose from "mongoose";

const conversationPromptSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
      enum: ["Travel", "Food", "Sports", "Movies", "Music", "Technology", "Art", "Books", "Gaming", "Nature", "Culture", "Work", "Hobbies", "Daily Life"]
    },
    promptEnglish: {
      type: String,
      required: true
    },
    promptTranslated: {
      type: Map,
      of: String,
      default: {}
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner"
    },
    tags: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

const ConversationPrompt = mongoose.model("ConversationPrompt", conversationPromptSchema);
export default ConversationPrompt;
