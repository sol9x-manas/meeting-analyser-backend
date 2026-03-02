import { AppDataSource } from "../../config/data-source";
import { User } from "./user.model";

const userRepo = AppDataSource.getRepository(User);

export class UserService {
    async getProfile(userId: number) {
        const user = await userRepo.findOne({
            where: { id: userId },
            select: [
                "id",
                "fullName",
                "username",
                "companyName",
                "phoneNumber",
                "email",
                "role",
                "profileImage",
                "createdAt",
            ],
        });

        return user;
    }

    async updateProfile(userId: number, data: any) {
        await userRepo.update(userId, data);
        return this.getProfile(userId);
    }

    async uploadProfileImage(userId: number, file: Express.Multer.File) {
        const user = await userRepo.findOne({ where: { id: userId } });
        if (!user) throw new Error("User not found");

        user.profileImage = `/uploads/${file.filename}`;

        await userRepo.save(user);

        return this.getProfile(userId);
    }
}