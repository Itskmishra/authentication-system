import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import { settoken } from "../utils/jwt-helper";
import { IRequest } from "../utils/interface.helper";
import { sendEmail } from "../config/nodemailer";
import { v4 } from "uuid";

// Register a new user
// Public route
// POST @ /api/v1/user/register
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password, email } = await req.body;

    const user_exists = await User.findOne({ email });
    if (user_exists) {
      res.status(200).json({ message: "User already exists" });
    }
    const verificationToken = v4();
    const new_user = await User.create({
      username,
      email,
      password,
      verificationToken,
    });
    if (new_user) {
      // const token_payload = { id: new_user._id };
      // settoken(res, token_payload);
      const verificationURL = `http://localhost:1337/api/v1/user/verify/${verificationToken}`;
      sendEmail(new_user.email, "Account verification email", verificationURL);
      res.status(201).json({
        message: "User registered succesfully. Check email to verify.",
      });
    } else {
      res.sendStatus(500);
    }
  } catch (e) {
    res.status(500).json({ message: "Something went wrong!" });
    logging.error("Something went wrong in register controller.", e);
  }
};

// Verify user's email
// Public route
// POST @ /api/v1/user/account/verify
export const resendEmailVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = await req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.sendStatus(401);
    }
    const verifyToken = v4();
    user.verificationToken = verifyToken;
    const verificationURL = `http://localhost:1337/api/v1/user/verify/${verifyToken}`;
    sendEmail(user.email, "Account verification email", verificationURL);
    res.status(201).json({
      message: "Verification email sent successfully.",
    });
  } catch (e) {
    logging.error("Something worng in verify cont", e);
  }
};

// Verify user's email
// Public route
// POST @ /api/v1/user/verify/:token
export const verify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.params.token;
    if (!token) {
      return res.sendStatus(401);
    }
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.sendStatus(401);
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    res.status(200).json("Account verified successfully");
  } catch (e) {
    logging.error("Something worng in verify cont", e);
  }
};

// User login
// Public route
// POST @ /api/v1/user/login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = await req.body;
    if (!email || !password) {
      res.sendStatus(400);
    }
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password)) && user.isVerified) {
      const token_payload = { id: user?._id };
      settoken(res, token_payload);
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  } catch (e) {
    logging.error("Something went wrong in login controller.");
  }
};

// User logout
// Public route
// POST @ /api/v1/user/logout
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.cookie("session_cookie", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json("Logged out successfully");
  } catch (e) {
    logging.error("Something went wrong in logout controller.");
  }
};

// Get user profile
// Private route
// GET @ /api/v1/user/profile
export const profile = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req?.user?._id);
    if (user) {
      return res.status(200).json({
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
      });
    } else {
      return res.sendStatus(401);
    }
  } catch (e) {
    logging.error("Something went wrong in profile controller.");
  }
};

// Request password reset link
// Public route
// POST @ /api/v1/user/reset-password
export const passwordResetLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = await req.body;
    if (!email) {
      return res.sendStatus(400);
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.sendStatus(200);
    }
    const creationTime = new Date();
    const resetToken = v4();
    const resetTokenExp = new Date(creationTime.getTime() + 30 * 60000);

    const resetURL = `This tokne will be valid for next 30 min's only. \n http://localhost:1337/api/v1/user/verify/${resetToken}`;
    user.passresetToken = resetToken;
    user.passresetTokenExp = resetTokenExp;
    await user.save();
    sendEmail(user.email, "Password reset", resetURL);
    res.status(200).json("Password reset link sent to your email.");
  } catch (e) {
    logging.error("Something went wrong in passwordRestlink controller.");
  }
};

// verify password token
// Public route
// POST @ /api/v1/user/reset-password/:token
export const verifyPasswordResetToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.params.token;
    const { password } = await req.body;
    if (!token || !password) {
      return res.sendStatus(401);
    }
    const user = await User.findOne({ passresetToken: token });
    if (user && new Date() < user?.passresetTokenExp!) {
      return res.sendStatus(200);
    } else {
      return res.sendStatus(401);
    }
  } catch (e) {
    logging.error("Something worng in verify cont", e);
  }
};
// Generate new password after reset
// Public route
// POST @ /api/v1/user/generate-password/:token
export const generatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.params.token;
    const { password } = await req.body;
    if (!token || !password) {
      return res.sendStatus(401);
    }
    const user = await User.findOne({ passresetToken: token });
    if (user && new Date() < user?.passresetTokenExp!) {
      user.passresetToken = "";
      user.passresetTokenExp = undefined;
      user.password = password;
      await user.save();
      sendEmail(
        user.email,
        "Password Reset successfull",
        "You password have been changed."
      );
      res.status(200).json("Password generated successfully");
    } else {
      logging.info(user, user?.passresetTokenExp!, new Date());
      res.sendStatus(500);
    }
  } catch (e) {
    logging.error("Something worng in verify cont", e);
  }
};

// Update user information
// Private route
// PATCH @ /api/v1/user/update
export const update_user = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user?._id);
    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }
      const updatedUser = await user.save();
      res.json({
        username: updatedUser.username,
        email: updatedUser.email,
      });
    } else {
      res.sendStatus(404);
      throw new Error("User not found");
    }
  } catch (e) {
    logging.error("Something went wrong in update_user controller.");
  }
};

// Delete user account
// Private route
// DELETE @ /api/v1/user/delete
export const delete_user = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findByIdAndDelete(req.user?._id);
    if (user) {
      res.cookie("session_cookie", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      res.status(200).json("user delete successfully");
    } else {
      res.sendStatus(401);
    }
  } catch (e) {
    logging.error("Something went wrong in delete_user controller.");
  }
};
