import { Router } from "express";
import {
  login,
  logout,
  register,
  profile,
  update_user,
  delete_user,
  verify,
  passwordResetLink,
  generatePassword,
  verifyPasswordResetToken,
  resendEmailVerification,
} from "../controllers/user.controller";
import isAuthenticated from "../middleware/isauthenticated.middleware";
import { validateInput } from "../middleware/inputvalidator.middleware";
import {
  emailSchema,
  generatePasswordSchema,
  loginSchema,
  reigsterSchema,
  resetPasswordSchema,
  updateUserSchema,
  verifyEmailSchema,
  verifyPasswordSchema,
} from "../utils/validation.helper";

const userRouter = Router();

/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
userRouter.post("/register", validateInput(reigsterSchema), register);

/**
 * @swagger
 * /api/v1/user/account/verify:
 *   post:
 *     summary: Resend verify user's email
 *     tags: [User]
 *     parameters:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification mail sent successfully
 *       401:
 *         description: Invalid Request
 */
userRouter.post(
  "/account/verify",
  validateInput(emailSchema),
  resendEmailVerification
);

/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: User login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
userRouter.post("/login", validateInput(loginSchema), login);

/**
 * @swagger
 * /api/v1/user/verify/{token}:
 *   post:
 *     summary: Verify user's email
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account verified successfully
 *       401:
 *         description: Invalid token
 */
userRouter.post("/verify/:token", validateInput(verifyEmailSchema), verify);

/**
 * @swagger
 * /api/v1/user/logout:
 *   post:
 *     summary: User logout
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
userRouter.post("/logout", logout);

/**
 * @swagger
 * /api/v1/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
userRouter.get("/profile", isAuthenticated, profile);

/**
 * @swagger
 * /api/v1/user/reset-password:
 *   post:
 *     summary: Request password reset link
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset link sent
 *       400:
 *         description: Invalid input
 */
userRouter.post(
  "/reset-password",
  validateInput(resetPasswordSchema),
  passwordResetLink
);

/**
 * @swagger
 * /api/v1/user/reset-password/{token}:
 *   post:
 *     summary: Verify password reset token
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 description: New password to be set
 *     responses:
 *       200:
 *         description: Token is valid and password can be reset
 *       401:
 *         description: Invalid token or password not provided
 *       500:
 *         description: Server error
 */
userRouter.get(
  "/reset-password/:token",
  validateInput(verifyPasswordSchema),
  verifyPasswordResetToken
);

/**
 * @swagger
 * /api/v1/user/generate-password/{token}:
 *   post:
 *     summary: Generate new password after reset
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password generated successfully
 *       401:
 *         description: Invalid token
 *       500:
 *         description: Server error
 */
userRouter.post(
  "/generate-password/:token",
  validateInput(generatePasswordSchema),
  generatePassword
);

/**
 * @swagger
 * /api/v1/user/update:
 *   patch:
 *     summary: Update user information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
userRouter.patch(
  "/update",
  isAuthenticated,
  validateInput(updateUserSchema),
  update_user
);
/**
 * @swagger
 * /api/v1/user/delete:
 *   delete:
 *     summary: Delete user account
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 */
userRouter.delete("/delete", isAuthenticated, delete_user);

// User model annotation
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - role
 *       properties:
 *         username:
 *           type: string
 *           description: The user's username
 *         email:
 *           type: string
 *           description: The user's email address
 *           format: email
 *         password:
 *           type: string
 *           description: The user's password (hashed)
 *         isVerified:
 *           type: boolean
 *           description: Indicates if the user's email is verified
 *           default: false
 *         verificationToken:
 *           type: string
 *           description: Token used for email verification
 *         passresetToken:
 *           type: string
 *           description: Token used for password reset
 *         passresetTokenExp:
 *           type: string
 *           format: date-time
 *           description: Expiration time for the password reset token
 *         role:
 *           type: string
 *           description: The user's role
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp of when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp of when the user was last updated
 */

// exporting
export default userRouter;
