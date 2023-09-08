import SuccessResponse from "../../helpers/successResponse";
import { UserLoginResponse } from "../../dtos/UserDTO";
import { AuthDTO, AuthUrlResponse, AuthTokenDTO, AuthTokenResponse, CreateUserDTO, LoginUserDTO } from "../../dtos/AuthDTO";

export default interface IAuthService {
    register(input: CreateUserDTO): Promise<SuccessResponse<UserLoginResponse>>
    login(input: LoginUserDTO): Promise<SuccessResponse<UserLoginResponse>>
    authorize(): Promise<SuccessResponse<AuthUrlResponse>>;
    getGoogleUser(inputCode: AuthDTO): Promise<SuccessResponse<UserLoginResponse>>;
    refreshToken(token: AuthTokenDTO): Promise<SuccessResponse<AuthTokenResponse>>;
}