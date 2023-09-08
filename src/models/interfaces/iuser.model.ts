import { Model } from "sequelize";
import { AutoMap } from '@automapper/classes'
import logger from "../../logger";
import bcrypt from "bcrypt";

export class User extends Model {
    @AutoMap()
    id: number;

    @AutoMap()
    username: string;

    @AutoMap()
    email: string;

    password: string;

    refreshToken: string;

    refreshTokenExpiryTime: Date;

    oauthLogin: boolean

    oauthProvider: string

    static async hashPassword(user: User): Promise<void> {
        try {
            const hash = await bcrypt.hash(user.password, 7);
            user.password = hash;
        } catch (error: any) {
            logger.error(
                `Error hashing password for user with username ${user.username} and error message ${error.message}`
            );
            return;
        }
    }
    async validatePassword(password: string): Promise<boolean> {
        try {
            const valid = await bcrypt.compare(password, this.password);
            return valid;
        } catch (error: any) {
            logger.error(
                `Error validating password for user with username ${this.username} and error message ${error.message}`
            );
            return false;
        }
    }
};