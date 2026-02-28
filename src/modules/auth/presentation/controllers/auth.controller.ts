import { Request, Response } from "express";
import { container } from "tsyringe";
import { RegisterUseCase } from "../../application/use-cases/register.usecase";
import { LoginUseCase } from "../../application/use-cases/login.usecase";
import { registerSchema } from "../../application/dto/register.dto";

export class AuthController {
    async register(req: Request, res: Response) {
        const useCase = container.resolve(RegisterUseCase);

        // CREATE KE TIME PE VALIDATION LAGA HUA HAI
        const data = registerSchema.safeParse(req.body);

        if (!data.success) {
            return res.status(400).json({
                success: false,
                errors: data.error.flatten(),
            });
        }

        const user = await useCase.execute(data.data);


        return res.status(201).json({
            success: true,
            data: user,
        });
    }

    async login(req: Request, res: Response) {
        const useCase = container.resolve(LoginUseCase);

        const result = await useCase.execute(req.body);

        return res.status(200).json({
            success: true,
            data: result,
        });
    }
}