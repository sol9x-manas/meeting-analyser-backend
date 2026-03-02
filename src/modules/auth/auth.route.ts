import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../middleware/validate.middleware";
import {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    verifyOtpSchema,
} from "./auth.schema";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();
const controller = new AuthController();
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - username
 *               - phoneNumber
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *               username:
 *                 type: string
 *               companyName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, customer]
 *     responses:
 *       200:
 *         description: User registered successfully
 */
router.post("/register", validate(registerSchema), controller.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "manasrai123400@gmail.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login successful with access & refresh token
 */
router.post("/login", validate(loginSchema), controller.login);

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Login or Register user using Google OAuth
 *     description: Verifies Google ID token and logs in or creates a new user account.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Google ID token received from frontend
 *                 example: eyJhbGciOiJSUzI1NiIsImtpZCI6IjE2...
 *     responses:
 *       200:
 *         description: Google login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     fullName:
 *                       type: string
 *                       example: Manas Singh
 *                     email:
 *                       type: string
 *                       example: manas@email.com
 *                     role:
 *                       type: string
 *                       example: customer
 *                     provider:
 *                       type: string
 *                       example: google
 *                     profileImageUrl:
 *                       type: string
 *                       example: https://lh3.googleusercontent.com/a/...
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 refreshToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Invalid Google token
 */
router.post("/google", controller.googleLogin);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token with rotation
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access and refresh token generated
 */
router.post("/refresh", controller.refreshToken);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Send OTP to email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "manasrai123400@gmail.com"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */
router.post("/forgot-password", validate(forgotPasswordSchema), controller.forgotPassword);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP and reset password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp, newPassword]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "manasrai123400@gmail.com"
 *               otp:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 example: "1234567"
 *     responses:
 *       200:
 *         description: Password updated successfully
 */
router.post("/verify-otp", validate(verifyOtpSchema), controller.verifyOtp);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post("/logout", authMiddleware(), controller.logout);

export default router;