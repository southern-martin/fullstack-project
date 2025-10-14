import { UserResponseDto } from "./user-response.dto";

export class AuthResponseDto {
  user: UserResponseDto;
  token: string;
  access_token: string;
  expiresIn: string;

  constructor(user: UserResponseDto, token: string, expiresIn: string) {
    this.user = user;
    this.token = token;
    this.access_token = token;
    this.expiresIn = expiresIn;
  }
}
