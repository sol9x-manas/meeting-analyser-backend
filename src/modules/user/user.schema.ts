import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z.string().optional(),
  username: z.string().optional(),
  companyName: z.string().optional(),
  phoneNumber: z.string().optional(),
  profileImageUrl: z.string().optional(),
});