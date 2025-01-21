import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  gender: {
    //true voor man false voor vrouw
    type: Boolean,
  },
});

// Middleware om wachtwoorden te hashen vóór opslaan
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // Als het wachtwoord niet is gewijzigd, niets doen
  }

  try {
    const salt = await bcrypt.genSalt(10); // Genereer een salt
    this.password = await bcrypt.hash(this.password, salt); // Hash het wachtwoord
    next();
  } catch (error) {
    next(error); // Geef de fout door aan de volgende middleware
  }
});

export const User = mongoose.model("User", userSchema);
