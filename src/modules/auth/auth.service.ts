import { AppDataSource } from "../../config/data-source";
import { User } from "../user/user.model";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import { env } from "../../config/env";
import jwt from "jsonwebtoken";

const userRepo = AppDataSource.getRepository(User);

export class AuthService {
  async register(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = userRepo.create({
      ...data,
      password: hashedPassword,
    });

    await userRepo.save(user);

    return user;
  }

  async login(email: string, password: string) {
    const user = await userRepo.findOne({ where: { email } });

    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const payload = { id: user.id, role: user.role };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    user.currentHashedRefreshToken = hashedRefreshToken;
    await userRepo.save(user);

    return { user, accessToken, refreshToken };
  }

  async forgotPassword(email: string) {
    const user = await userRepo.findOne({ where: { email } });
    if (!user) throw new Error("User not found");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await userRepo.save(user);

    // Yaha email send karna hoga (nodemailer)
    console.log("OTP:", otp);

    return { message: "OTP sent to email" };
  }

  async verifyOtp(email: string, otp: string, newPassword: string) {
    const user = await userRepo.findOne({ where: { email } });

    if (!user || user.resetOtp !== otp)
      throw new Error("Invalid OTP");

    if (user.otpExpiry! < new Date())
      throw new Error("OTP expired");

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = null!;
    user.otpExpiry = null!;

    await userRepo.save(user);

    return { message: "Password updated successfully" };
  }

  async logout(userId: number) {
    await userRepo.update(userId, { currentHashedRefreshToken: null! });
  }

  async refreshToken(token: string) {
    try {
      const decoded: any = jwt.verify(token, env.jwtSecret);

      const user = await userRepo.findOne({
        where: { id: decoded.id },
      });

      if (!user || !user.currentHashedRefreshToken)
        throw new Error("Access Denied");

      const isTokenValid = await bcrypt.compare(
        token,
        user.currentHashedRefreshToken
      );

      if (!isTokenValid) {
        // TOKEN REUSE DETECTED
        user.currentHashedRefreshToken = null!;
        await userRepo.save(user);
        throw new Error("Token reuse detected. Please login again.");
      }

      const payload = { id: user.id, role: user.role };

      const newAccessToken = generateAccessToken(payload);
      const newRefreshToken = generateRefreshToken(payload);

      const newHashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);

      user.currentHashedRefreshToken = newHashedRefreshToken;
      await userRepo.save(user);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new Error("Invalid refresh token");
    }
  }
}