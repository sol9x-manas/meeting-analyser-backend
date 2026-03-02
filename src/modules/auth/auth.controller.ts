import { AuthService } from "./auth.service";

const service = new AuthService();

export class AuthController {
  async register(req: any, res: any) {
    const user = await service.register(req.body);
    res.json(user);
  }

  async login(req: any, res: any) {
    const data = await service.login(req.body.email, req.body.password);
    res.json(data);
  }

  async googleLogin(req: any, res: any) {
    const { idToken } = req.body;
    const data = await service.googleLogin(idToken);
    res.json(data);
  }

  async refreshToken(req: any, res: any) {
    const data = await service.refreshToken(req.body.refreshToken);
    res.json(data);
  }

  async forgotPassword(req: any, res: any) {
    const data = await service.forgotPassword(req.body.email);
    res.json(data);
  }

  async verifyOtp(req: any, res: any) {
    const data = await service.verifyOtp(
      req.body.email,
      req.body.otp,
      req.body.newPassword
    );
    res.json(data);
  }

  async logout(req: any, res: any) {
    await service.logout(req.user.id);
    res.json({ message: "Logged out successfully" });
  }
}