import { Repository } from "typeorm";
import { AppDataSource } from "../../../../config/database/data-source";
import { IUserRepository } from "../../domain/repositories/user.repository.interface";
import { User } from "../../domain/entities/user.entity";
import { UserOrmEntity, UserRoleEnum } from "../orm/user.orm-entity";

/**
 * UserRepository
 *
 * Infrastructure implementation of IUserRepository.
 * Handles database interaction using TypeORM.
 *
 * ⚠️ This layer knows about:
 * - TypeORM
 * - Database
 * - ORM Entity
 *
 * But domain layer does NOT know about this.
 */
export class UserRepository implements IUserRepository {
  private repository: Repository<UserOrmEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserOrmEntity);
  }

  /**
   * Save new or existing user
   */
  async save(user: User): Promise<User> {
    const ormEntity = this.toOrmEntity(user);

    const saved = await this.repository.save(ormEntity);

    return this.toDomainEntity(saved);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.repository.findOne({
      where: { email },
    });

    if (!user) return null;

    return this.toDomainEntity(user);
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    const user = await this.repository.findOne({
      where: { id },
    });

    if (!user) return null;

    return this.toDomainEntity(user);
  }

  /**
   * Delete user by ID
   */
  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  // ================================
  // Mapping Methods
  // ================================

  /**
   * Convert Domain User → ORM Entity
   */
  private toOrmEntity(user: User): UserOrmEntity {
    const orm = new UserOrmEntity();

    if (user.id) {
      orm.id = user.id;
    }

    orm.email = user.email;
    orm.password = user.password;
    orm.role = user.role as UserRoleEnum;
    orm.createdAt = user.createdAt;

    return orm;
  }

  /**
   * Convert ORM Entity → Domain User
   */
  private toDomainEntity(orm: UserOrmEntity): User {
    return new User({
      id: orm.id,
      email: orm.email,
      password: orm.password,
      role: orm.role,
      createdAt: orm.createdAt,
    });
  }
}