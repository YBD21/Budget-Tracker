import {
  Body,
  Controller,
  Get,
  // HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  FindAccountDTO,
  LoginDTO,
  RecaptchaDTO,
  VerifyCaptchaResponse,
  VerifyCodeDTO,
} from './dto/auth.dto';
import { Request, Response } from 'express';

@Controller('auth-system')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @HttpCode(HttpStatus.OK)
  @Get('user-data')
  async getUserData(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      const accessToken = req.cookies.userData;
      if (!accessToken || !(await this.authService.verifyToken(accessToken))) {
        res.status(HttpStatus.UNAUTHORIZED).send('Unauthorized');
        return;
      }

      res.json(accessToken);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal Server Error');
    }
  }

  // @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Res() res: Response,
    @Body() loginData: LoginDTO,
  ): Promise<void> {
    try {
      const respond = await this.authService.handleLogin(loginData);
      if (respond.status === true) {
        // set HTTP Only Cookie
        res.cookie('userData', respond.accessToken, {
          secure: true, // set to true to enable sending the cookie only over HTTPS
          httpOnly: true, // set to true to prevent client-side scripts from accessing the cookie
          sameSite: 'lax',
        });
        res.json(respond);
      } else if (respond.message) {
        res.status(HttpStatus.BAD_REQUEST).json(respond);
      }
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal Server Error');
    }
  }

  @Post('verify-captcha')
  async verifyCaptcha(
    @Res() res: Response,
    @Body() recaptchaData: RecaptchaDTO,
  ) {
    // console.log(recaptchaData.response);

    const respond = await this.authService.handleVerifyCaptcha(recaptchaData);

    res.status(HttpStatus.CREATED).json(respond);
  }

  @Post('find-account')
  async handleFindAccount(
    @Req() req: Request,
    @Res() res: Response,
    @Body() findAccountData: FindAccountDTO,
  ): Promise<void> {
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

          res.status(HttpStatus.OK).send(respondData);
        }

        const respondData: VerifyCaptchaResponse = {
          status: accountStatus,
          error_message: 'Incorrect Data',
        };
        res.status(HttpStatus.NOT_FOUND).send(respondData);
      } else {
        res.status(HttpStatus.UNAUTHORIZED).send('Unauthorized');
      }
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal Server Error');
    }
  }

  @Post('send-otp-email')
  async handleEmailVerification(
    @Req() req: Request,
    @Res() res: Response,
    @Body() verifyEmailData: FindAccountDTO,
  ): Promise<void> {
    try {
      const userEmail = verifyEmailData.email;
      const otp = this.authService.generateOTP();
      const respond = await this.authService.sendVerificationEmail(
        userEmail,
        otp,
      );
      if (respond) {
        const hashOfOTP = this.authService.generateHashFromOTP(otp);
        res.status(HttpStatus.OK).send(hashOfOTP);
      }
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal Server Error');
    }
  }

  @Post('verify-otp')
  async handleVerifyOTP(
    @Req() req: Request,
    @Res() res: Response,
    @Body() verifyCodeData: VerifyCodeDTO,
  ): Promise<void> {
    try {
      const VerifyStatus = await this.authService.verifyHash(
        verifyCodeData.hash,
        verifyCodeData.otp,
      );

      if (VerifyStatus) {
        const respondData: VerifyCaptchaResponse = {
          status: VerifyStatus,
        };
        res.status(HttpStatus.OK).send(respondData);
      } else {
        const respondData: VerifyCaptchaResponse = {
          status: VerifyStatus,
          error_message: 'Incorrect Data',
        };
        res.status(HttpStatus.NOT_FOUND).send(respondData);
      }
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal Server Error');
    }
  }
}
