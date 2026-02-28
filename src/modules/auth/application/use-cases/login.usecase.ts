import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../domain/repositories/user.repository.interface";
import { IPasswordHasher } from "../../domain/services/password-hasher.interface";
import { ITokenService } from "../../domain/services/token-service.interface";
import { AppError } from "@/shared/errors/app-error";
import { LoginDto } from "../dto/login.dto";

@injectable()
export class LoginUseCase {
    constructor(
        @inject("UserRepository")
        private userRepository: IUserRepository,

        @inject("PasswordHasher")
        private passwordHasher: IPasswordHasher,

        @inject("TokenService")
        private tokenService: ITokenService
    ) { }

    async execute(input: LoginDto) {
        const { email, password } = input;

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new AppError("Invalid email or password", 401);
        }

        const isValid = await this.passwordHasher.compare(
            password,
            user.password
        );

        if (!isValid) {
            throw new AppError("Invalid email or password", 401);
        }

        const payload = {
            userId: user.id!,
            email: user.email,
            role: user.role,
        };

        return {
            accessToken: this.tokenService.generateAccessToken(payload),
            refreshToken: this.tokenService.generateRefreshToken(payload),
        };
    }
}