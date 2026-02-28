/**
 * Token Service Interface (Domain Layer)
 *
 * Responsible for generating and verifying authentication tokens.
 *
 * The domain DOES NOT know:
 * - Whether JWT is used
 * - Whether OAuth is used
 * - Whether sessions are used
 *
 * Infrastructure layer will implement this.
 */

export interface ITokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface ITokenService {
  /**
   * Generate an access token
   */
  generateAccessToken(payload: ITokenPayload): string;

  /**
   * Generate a refresh token
   */
  generateRefreshToken(payload: ITokenPayload): string;

  /**
   * Verify an access token
   */
  verifyAccessToken(token: string): ITokenPayload;

  /**
   * Verify a refresh token
   */
  verifyRefreshToken(token: string): ITokenPayload;
}