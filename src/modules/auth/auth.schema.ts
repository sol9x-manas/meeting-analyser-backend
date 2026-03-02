import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string(),
  username: z.string(),
  companyName: z.string().optional(),
  phoneNumber: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "customer"]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string(),
  newPassword: z.string().min(6),
});