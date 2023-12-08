import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';

@Injectable()
export class AdminAuthenticatorService {
    async generateSecret() {
        return authenticator.generateSecret();
    }

    async verifyToken(token: string, secret: string) {
        try {
            return authenticator.verify({ token, secret });
        } catch (err) {
            return false;
        }
    }
}
