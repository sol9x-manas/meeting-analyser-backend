/**
 * Password Hasher Interface (Domain Layer)
 *
 * This defines how passwords should be handled.
 *
 * The domain DOES NOT know:
 * - Which hashing library is used (bcrypt, argon2, etc.)
 * - How hashing works internally
 *
 * Infrastructure layer will provide the actual implementation.
 */

export interface IPasswordHasher {
  /**
   * Hash a plain text password
   */
  hash(password: string): Promise<string>;

  /**
   * Compare a plain text password with a hashed password
   */
  compare(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}