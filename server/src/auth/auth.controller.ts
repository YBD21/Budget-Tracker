import {
  Body,
  Controller,
  Get,
  // HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import {
  CreateAccountDTO,
  FindAccountDTO,
  LoginDTO,
  RecaptchaDTO,
  VerifyCaptchaResponse,
  VerifyCodeDTO,
} from './dto/auth.dto';
import { Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';

@Controller('auth-system')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  // @HttpCode(HttpStatus.OK)
  @Get('user-data')
  async getUserData(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const accessToken = req.cookies.userData;
      if (!accessToken || !(await this.authService.verifyToken(accessToken))) {
        return res.status(HttpStatus.UNAUTHORIZED).send('Unauthorized');
      }

      return res.json(accessToken);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal Server Error');
    }
  }

  // @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Res() res: Response,
    @Body() loginData: LoginDTO,
  ): Promise<Response> {
    try {
      const respond = await this.authService.handleLogin(loginData);
      if (respond.status === true) {
        // const time = 1 * 60 * 60 * 1000; // 60 min

        // set HTTP Only Cookie
        // res.cookie('userData', respond.accessToken, {
        //   secure: true, // set to true to enable sending the cookie only over HTTPS
        //   httpOnly: true, // set to true to prevent client-side scripts from accessing the cookie
        //   sameSite: 'strict',
        //   expires: new Date(Date.now() + time),
        // });

        return res.json(respond);
      } else if (respond.message) {
        return res.status(HttpStatus.BAD_REQUEST).json(respond);
      }
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal Server Error');
    }
  }

  @Post('create-account')
  async handlecreateAccount(
    @Res() res: Response,
    @Body() signUpData: CreateAccountDTO,
  ): Promise<Response> {
    try {
      const respond = await this.authService.createAccount(signUpData);

      if (respond.status === true) {
        await this.userService.createBudgetSummary(signUpData.email);
        return res.status(HttpStatus.OK).json(respond);
      }

      return res.status(HttpStatus.BAD_REQUEST).json(respond);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal Server Error');
    }
  }

  @Post('verify-captcha')
  async verifyCaptcha(
    @Res() res: Response,
    @Body() recaptchaData: RecaptchaDTO,
  ): Promise<Response> {
    // console.log(recaptchaData.response);

    const respond = await this.authService.handleVerifyCaptcha(recaptchaData);

    return res.status(HttpStatus.CREATED).json(respond);
  }

  @Post('find-account')
  async handleFindAccount(
    @Req() req: Request,
    @Res() res: Response,
    @Body() findAccountData: FindAccountDTO,
  ): Promise<Response> {
    try {
      const accessData = req.accessData;

      if (accessData?.verifyStatus === true) {
        const accountStatus =
          await this.authService.findAccount(findAccountData);
        // attach email to findAccess token
        const data = { verifyStatus: true, email: findAccountData.email };

        if (accountStatus) {
          const token = await this.authService.generateCaptchaVerifyToken(data);

          // set HTTP Only Cookie
          const respondData: VerifyCaptchaResponse = {
            status: accountStatus,
            token: token,
          };

          return res.status(HttpStatus.OK).send(respondData);
        }

        const respondData: VerifyCaptchaResponse = {
          status: accountStatus,
          error_message: 'Incorrect Data',
        };
        return res.status(HttpStatus.NOT_FOUND).send(respondData);
      } else {
        return res.status(HttpStatus.UNAUTHORIZED).send('Unauthorized'); // Stop further execution
      }
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal Server Error');
    }
  }

  @Post('send-otp-email')
  async handleEmailVerification(
    @Req() req: Request,
    @Res() res: Response,
    @Body() verifyEmailData: FindAccountDTO,
  ): Promise<Response> {
    try {
      const userEmail = verifyEmailData.email;
      const otp = this.authService.generateOTP();
      const respond = await this.authService.sendVerificationEmail(
        userEmail,
        otp,
      );
      if (respond) {
        const hashOfOTP = this.authService.generateHashFromOTP(otp);
        return res.status(HttpStatus.OK).send(hashOfOTP);
      }
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal Server Error');
    }
  }

  @Post('verify-otp')
  async handleVerifyOTP(
    @Req() req: Request,
    @Res() res: Response,
    @Body() verifyCodeData: VerifyCodeDTO,
  ): Promise<Response> {
    try {
      const VerifyStatus = await this.authService.verifyHash(
        verifyCodeData.hash,
        verifyCodeData.otp,
      );

      if (VerifyStatus) {
        const respondData: VerifyCaptchaResponse = {
          status: VerifyStatus,
        };
        return res.status(HttpStatus.OK).send(respondData);
      } else {
        const respondData: VerifyCaptchaResponse = {
          status: VerifyStatus,
          error_message: 'Incorrect Data',
        };
        return res.status(HttpStatus.NOT_FOUND).send(respondData);
      }
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal Server Error');
    }
  }

  @Patch('reset-password')
  async handleResetPassword(
    @Req() req: Request,
    @Res() res: Response,
    @Body() ResetPasswordData: LoginDTO,
  ): Promise<Response> {
    try {
      const respondData =
        await this.authService.resetPassword(ResetPasswordData);
      if (respondData.status) {
        return res.status(HttpStatus.OK).send(respondData);
      }
      return res.status(HttpStatus.NOT_FOUND).send(respondData);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal Server Error');
    }
  }
}
