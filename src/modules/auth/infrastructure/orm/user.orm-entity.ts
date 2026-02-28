import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from "typeorm";

/**
 * UserOrmEntity
 *
 * This represents how the User is stored in the database.
 * It is part of the Infrastructure layer.
 *
 * ⚠️ This is NOT the domain entity.
 */

export enum UserRoleEnum {
  USER = "USER",
  ADMIN = "ADMIN",
}

@Entity("users")
export class UserOrmEntity {
  /**
   * Primary Key (UUID recommended for scalability)
   */
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  /**
   * Unique email index
   */
  @Index({ unique: true })
  @Column({ type: "varchar", length: 255 })
  email!: string;

  /**
   * Hashed password
   */
  @Column({ type: "varchar", length: 255 })
  password!: string;

  /**
   * User role
   */
  @Column({
    type: "enum",
    enum: UserRoleEnum,
    default: UserRoleEnum.USER,
  })
  role!: UserRoleEnum;

  /**
   * Automatically managed creation timestamp
   */
  @CreateDateColumn()
  createdAt!: Date;
}