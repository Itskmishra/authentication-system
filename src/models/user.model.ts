import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  verificationToken: string | undefined;
  passresetToken: string | undefined;
  passresetTokenExp: Date | undefined;
  //profile: Schema.Types.ObjectId;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

interface IUserModel extends Model<IUser> {
  // Add statics here if needed
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      unique: true,
    },
    passresetToken: {
      type: String,
    },
    passresetTokenExp: {
      type: Date,
    }
  },
  {
    timestamps: true,
  }
);

// match password method to check user password on login
userSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Added this function to hash the password before saving it in the db.
userSchema.pre("save", async function (this: IUser, next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;
