/**
 * Login DTO (Data Transfer Object)
 *
 * Defines input shape for LoginUseCase
 */
export interface LoginDto {
  email: string;
  password: string;
}