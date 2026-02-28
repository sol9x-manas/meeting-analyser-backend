/**
 * User Entity (Domain Layer)
 *
 * This represents the core business model of a User.
 * It contains business rules and validation logic.
 *
 * ⚠️ This file MUST NOT depend on:
 * - Express
 * - TypeORM
 * - Database
 * - Bcrypt
 * - JWT
 */

export type UserRole = "USER" | "ADMIN";

export interface CreateUserProps {
  id?: string;
  email: string;
  password: string; // This should already be hashed before creating entity
  role?: UserRole;
  createdAt?: Date;
}

export class User {
  private _id?: string;
  private _email: string;
  private _password: string;
  private _role: UserRole;
  private _createdAt: Date;

  constructor(props: CreateUserProps) {
    this.validateEmail(props.email);
    this.validatePassword(props.password);

    this._id = props.id;
    this._email = props.email.toLowerCase();
    this._password = props.password;
    this._role = props.role ?? "USER";
    this._createdAt = props.createdAt ?? new Date();
  }

  // ========================
  // Getters
  // ========================

  get id(): string | undefined {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get role(): UserRole {
    return this._role;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  // ========================
  // Business Methods
  // ========================

  /**
   * Change user role
   */
  public changeRole(newRole: UserRole) {
    this._role = newRole;
  }

  /**
   * Change password (hashed password must be provided)
   */
  public changePassword(newHashedPassword: string) {
    this.validatePassword(newHashedPassword);
    this._password = newHashedPassword;
  }

  /**
   * Convert entity to plain object (safe for response)
   * ⚠️ Password intentionally excluded
   */
  public toJSON() {
    return {
      id: this._id,
      email: this._email,
      role: this._role,
      createdAt: this._createdAt,
    };
  }

  // ========================
  // Private Validation Methods
  // ========================

  /**
   * Basic email validation
   */
  private validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
  }

  /**
   * Password validation
   * ⚠️ Here we only check minimum length.
   * Hashing happens outside (in application layer).
   */
  private validatePassword(password: string) {
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }
  }
}