import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    bio: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    nativeLanguage: { type: String, default: "" },
    learningLanguage: { type: String, default: "" },
    location: { type: String, default: "" },
    isOnboarded: { type: Boolean, default: false },
    friends: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// pre hook(help to generate and store the hashed version of password)
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    try {
        const salt = await bycrypt.genSalt(10);
        this.password = await bycrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
})

export default User;
