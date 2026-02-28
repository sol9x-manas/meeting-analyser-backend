import { z } from "zod";
/**
 * Register DTO (Data Transfer Object)
 *
 * Defines input shape for RegisterUseCase
 */
export interface RegisterDto {
  email: string;
  password: string;
}

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});