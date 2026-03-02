import { UserService } from "./user.service";

const service = new UserService();

export class UserController {
    async getProfile(req: any, res: any) {
        const user = await service.getProfile(req.user.id);
        res.json(user);
    }

    async updateProfile(req: any, res: any) {
        const user = await service.updateProfile(
            req.user.id,
            req.body
        );
        res.json(user);
    }

    async uploadProfileImage(req: any, res: any) {
        if (!req.file)
            return res.status(400).json({ message: "Image required" });

        const user = await service.uploadProfileImage(
            req.user.id,
            req.file
        );

        res.json(user);
    }
}