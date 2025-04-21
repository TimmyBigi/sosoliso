import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const adminSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    phoneNumber: {
      type: String,
      unique: true,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "admin",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Hash password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
adminSchema.methods.comparePassword = async function (candidatePassword) {
    try {
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
      return false;
    }
  };
  
  // Generate JWT Token
  adminSchema.methods.generateAuthToken = function () {
    return jwt.sign(
      {
        userId: this._id,
        email: this.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
  };
  
  // Generate Reset Password Token
  adminSchema.methods.generateResetToken = function () {
    return jwt.sign(
      {
        userId: this._id,
      },
      process.env.JWT_RESET_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
  };
  
export default mongoose.model("Admin", adminSchema);
