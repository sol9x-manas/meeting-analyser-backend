/**
 * User Repository Interface (Domain Layer)
 *
 * This defines the contract for user data persistence.
 * The domain layer does NOT know:
 * - Which database is used
 * - Whether it's MySQL, Postgres, MongoDB
 * - Whether TypeORM or Prisma is used
 *
 * Infrastructure layer will implement this interface.
 */

import { User } from "../entities/user.entity";

export interface IUserRepository {
  /**
   * Save a new user or update an existing user
   */
  save(user: User): Promise<User>;

  /**
   * Find user by email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Find user by ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Delete user by ID
   */
  deleteById(id: string): Promise<void>;
}