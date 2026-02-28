import * as jwt from "jsonwebtoken";
import { env } from "../../../../config/env";
import {
    ITokenPayload,
    ITokenService,
} from "../../domain/services/token-service.interface";

/**
 * JwtService
 *
 * Infrastructure implementation of ITokenService.
 * Responsible for generating and verifying tokens.
 *
 * ⚠️ Only this layer knows about jsonwebtoken library.
 */
export class JwtService implements ITokenService {
    generateAccessToken(payload: ITokenPayload): string {
        return jwt.sign(payload, env.JWT.SECRET, {
            expiresIn: (env.JWT.EXPIRES_IN || "15m") as jwt.SignOptions["expiresIn"]
        });
    }

    generateRefreshToken(payload: ITokenPayload): string {
        return jwt.sign(payload, env.JWT.SECRET, {
            expiresIn: "7d",
        });
    }

    verifyAccessToken(token: string): ITokenPayload {
        return jwt.verify(token, env.JWT.SECRET) as ITokenPayload;
    }

    verifyRefreshToken(token: string): ITokenPayload {
        return jwt.verify(token, env.JWT.SECRET) as ITokenPayload;
    }
}