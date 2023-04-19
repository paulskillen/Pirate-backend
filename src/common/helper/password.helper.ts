import { compare, hash } from 'bcryptjs';

export class PasswordHelper {
    static validate(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        if (!hashedPassword) {
            throw Error('Password is not set!');
        }
        return compare(password, hashedPassword);
    }

    static hash(password: string): Promise<string> {
        if (password) {
            return hash(password, 10);
        }
        return null;
    }
}
