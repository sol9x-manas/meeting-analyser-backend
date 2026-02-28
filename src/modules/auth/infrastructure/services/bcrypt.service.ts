import bcrypt from "bcrypt";
import { IPasswordHasher } from "../../domain/services/password-hasher.interface";

/**
 * BcryptService
 *
 * Infrastructure implementation of IPasswordHasher.
 * Responsible for hashing and comparing passwords.
 *
 * ⚠️ Only this layer knows about bcrypt.
 */
export class BcryptService implements IPasswordHasher {
  private readonly saltRounds = 10;

  /**
   * Hash plain password
   */
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Compare plain password with hashed password
   */
  async compare(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}