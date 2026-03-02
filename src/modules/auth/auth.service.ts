import { AppDataSource } from "../../config/data-source";
import { AuthProvider, User, UserRole } from "../user/user.model";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import { env } from "../../config/env";
import jwt from "jsonwebtoken";
import { sendMail } from "../../utils/mailer";
import { OAuth2Client } from "google-auth-library";

const userRepo = AppDataSource.getRepository(User);
const client = new OAuth2Client(env.google.clientId);

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

  async googleLogin(idToken: string) {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.google.clientId,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new Error("Invalid Google token");

    const { email, name, picture, sub } = payload;

    if (!email || !sub) {
      throw new Error("Google account missing required data");
    }

    let user = await userRepo.findOne({
      where: [
        { email },
        { providerId: sub },
      ],
    });

    // 🟢 CASE 1 — User not exists
    if (!user) {
      user = userRepo.create({
        email,
        fullName: name || "",
        username: email.split("@")[0] + Date.now(),
        companyName: "",
        phoneNumber: "",
        password: "", // Google users no password
        role: UserRole.CUSTOMER,
        provider: AuthProvider.GOOGLE,
        providerId: sub,
        profileImage: picture,
      });

      await userRepo.save(user);
    }

    // 🟡 CASE 2 — Email exists but created via LOCAL login
    if (user.provider === AuthProvider.LOCAL) {
      throw new Error(
        "This email is already registered using email/password. Please login normally."
      );
    }

    // 🔐 Generate JWT
    const jwtPayload = { id: user.id, role: user.role };

    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    user.currentHashedRefreshToken = hashedRefreshToken;
    await userRepo.save(user);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async forgotPassword(email: string) {
    const user = await userRepo.findOne({ where: { email } });
    if (!user) throw new Error("User not found");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await userRepo.save(user);

    const html = `
  <div style="background-color:#f4f6f8;padding:40px 0;font-family:Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

      <!-- Header -->
      <div style="background:#111827;padding:20px;text-align:center;">
        <h2 style="color:#ffffff;margin:0;">Meeting Analyser</h2>
      </div>

      <!-- Body -->
      <div style="padding:30px;">
        <h3 style="margin-top:0;color:#111827;">Password Reset Request</h3>
        <p style="color:#4b5563;font-size:14px;">
          Hi ${user.fullName || "User"},
        </p>

        <p style="color:#4b5563;font-size:14px;">
          We received a request to reset your password. Use the OTP below to proceed:
        </p>

        <!-- OTP Box -->
        <div style="margin:30px 0;text-align:center;">
          <div style="
            display:inline-block;
            background:#f3f4f6;
            padding:15px 30px;
            border-radius:8px;
            font-size:28px;
            letter-spacing:6px;
            font-weight:bold;
            color:#111827;
          ">
            ${otp}
          </div>
        </div>

        <p style="color:#ef4444;font-size:13px;">
          This OTP will expire in 10 minutes.
        </p>

        <p style="color:#6b7280;font-size:13px;">
          If you did not request this password reset, please ignore this email.
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#f9fafb;padding:15px;text-align:center;font-size:12px;color:#9ca3af;">
        © ${new Date().getFullYear()} Meeting Analyser. All rights reserved.
      </div>

    </div>
  </div>
  `;

    await sendMail(
      user.email,
      "🔐 Password Reset OTP - Meeting Analyser",
      html
    );

    return { message: "OTP sent to email successfully" };
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