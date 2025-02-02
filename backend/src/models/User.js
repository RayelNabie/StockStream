import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { info, error } from "../utils/logger.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    gender: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    info("[Model] Wachtwoord wordt gehasht voor gebruiker:", {
      username: this.username,
    });
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    info("[Model] Wachtwoord succesvol gehasht!");
    next();
  } catch (err) {
    error("[Model] Fout bij het hashen van wachtwoord:", {
      error: err.message,
    });
    next(err);
  }
});

// **Middleware om e-mail en gebruikersnaam uniek te valideren**
userSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    error("[Model] Dubbele waarde gedetecteerd in database", {
      error: error.keyValue,
    });
    return next(new Error("E-mail of gebruikersnaam bestaat al."));
  }
  next(error);
});

export const User = mongoose.model("User", userSchema);
