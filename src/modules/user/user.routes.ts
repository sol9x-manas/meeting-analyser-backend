import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { updateProfileSchema } from "./user.schema";
import { upload } from "../../middleware/upload.middleware";

const router = Router();
const controller = new UserController();

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get logged-in user profile
 *     description: Returns the profile details of the currently authenticated user.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 1
 *                 fullName:
 *                   type: string
 *                   example: Manas Singh
 *                 username:
 *                   type: string
 *                   example: manas_dev
 *                 companyName:
 *                   type: string
 *                   example: Sol9x Technologies
 *                 phoneNumber:
 *                   type: string
 *                   example: "9876543210"
 *                 email:
 *                   type: string
 *                   example: manas@email.com
 *                 role:
 *                   type: string
 *                   example: customer
 *                 profileImageUrl:
 *                   type: string
 *                   example: /uploads/1741012341231.jpg
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", authMiddleware(), controller.getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update logged-in user profile
 *     description: Update profile details of the authenticated user.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Manas Kumar
 *               username:
 *                 type: string
 *                 example: manas_updated
 *               companyName:
 *                 type: string
 *                 example: Sol9x Pvt Ltd
 *               phoneNumber:
 *                 type: string
 *                 example: "9999999999"
 *               profileImageUrl:
 *                 type: string
 *                 example: /uploads/profile.jpg
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 fullName:
 *                   type: string
 *                 username:
 *                   type: string
 *                 companyName:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 profileImageUrl:
 *                   type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.put("/profile", authMiddleware(), validate(updateProfileSchema), controller.updateProfile);

/**
 * @swagger
 * /api/users/upload-image:
 *   post:
 *     summary: Upload user profile image
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Select an image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 profileImageUrl:
 *                   type: string
 *       400:
 *         description: Invalid file format
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/upload-image",
    authMiddleware(),
    upload.single("image"),
    controller.uploadProfileImage
);

export default router;