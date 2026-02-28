import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../domain/repositories/user.repository.interface";
import { IPasswordHasher } from "../../domain/services/password-hasher.interface";
import { User } from "../../domain/entities/user.entity";
import { AppError } from "@/shared/errors/app-error";
import { RegisterDto } from "../dto/register.dto";


@injectable()
export class RegisterUseCase {
    constructor(
        @inject("UserRepository")
        private userRepository: IUserRepository,

        @inject("PasswordHasher")
        private passwordHasher: IPasswordHasher
    ) { }

    async execute(input: RegisterDto) {
        const { email, password } = input;

        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new AppError("Email already registered", 400);
        }

        const hashedPassword = await this.passwordHasher.hash(password);

        const user = new User({
            email,
            password: hashedPassword,
        });

        const savedUser = await this.userRepository.save(user);

        return savedUser.toJSON();
    }
}