import { AutoMap } from '@automapper/classes'

export class UserLoginResponse {
    @AutoMap()
    public username: string;

    @AutoMap()
    public email: string;

    @AutoMap()
    public id: number;

    public accessToken: string;

    public refreshToken: string;   
}

export class GetGoogleUser {
    public data: any;
    public refreshToken: string | null | undefined;
}

export class LoggedInUser {
    public id: number;
    public email: string

    constructor(id: number, email: string) {
        this.id = id;
        this.email = email;
    }
}