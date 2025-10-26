import { ApiProperty } from "@nestjs/swagger";
import { UserResponseDto } from "./user-response.dto";

export class AuthResponseDto {
  @ApiProperty({
    description: "Authenticated user information",
    type: UserResponseDto,
  })
  user: UserResponseDto;

  @ApiProperty({
    description: "JWT access token",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  })
  token: string;

  @ApiProperty({
    description: "JWT access token (alias for token)",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  })
  access_token: string;

  @ApiProperty({
    description: "Token expiration time (e.g., 1h, 7d)",
    example: "1h",
  })
  expiresIn: string;

  constructor(user: UserResponseDto, token: string, expiresIn: string) {
    this.user = user;
    this.token = token;
    this.access_token = token;
    this.expiresIn = expiresIn;
  }
}
