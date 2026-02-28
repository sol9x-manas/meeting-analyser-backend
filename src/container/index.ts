import { container } from "tsyringe";

import { IUserRepository } from "@/modules/auth/domain/repositories/user.repository.interface";
import { IPasswordHasher } from "@/modules/auth/domain/services/password-hasher.interface";
import { ITokenService } from "@/modules/auth/domain/services/token-service.interface";

import { UserRepository } from "@/modules/auth/infrastructure/repositories/user.repository";
import { BcryptService } from "@/modules/auth/infrastructure/services/bcrypt.service";
import { JwtService } from "@/modules/auth/infrastructure/services/jwt.service";

/**
 * Register Dependencies
 */

container.register<IUserRepository>("UserRepository", {
  useClass: UserRepository,
});

container.register<IPasswordHasher>("PasswordHasher", {
  useClass: BcryptService,
});

container.register<ITokenService>("TokenService", {
  useClass: JwtService,
});

export { container };