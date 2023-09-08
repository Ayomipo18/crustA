export class AuthDTO {
    public code?: string;
}

export type AuthUrlResponse = string;

export class AuthTokenDTO {
    public accessToken: string;
    public refreshToken: string;
} 

export class AuthTokenResponse extends AuthTokenDTO {}

export class CreateUserDTO {
    public email: string;
    public username: string;
    public password: string;
}

export class LoginUserDTO {
    public user: string;
    public password: string;
}