import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class FindAccountDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class RecaptchaDTO {
  @IsString()
  @IsNotEmpty()
  response: string;
}

export type LoginSuccessResponse = {
  status?: boolean;
  accessToken?: string;
  message: false | string;
  error_message: false | string;
};

export type VerifyCaptchaResponse = {
  status: boolean;
  token?: string;
  error_message?: string;
};
