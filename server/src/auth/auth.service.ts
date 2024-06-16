import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { FirebaseService } from 'src/firebase/firebase.service';
import {
  FindAccountDTO,
  LoginDTO,
  LoginSuccessResponse,
  RecaptchaDTO,
  VerifyCaptchaResponse,
} from './dto/auth.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { HttpService } from '@nestjs/axios';
import * as easyYopmail from 'easy-yopmail';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly firebaseService: FirebaseService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly userService: UsersService,
  ) {}

  getSecretKey() {
    return this.configService.get<string>('JWT_SECRET_KEY');
  }

  getReCaptchaSecretKey() {
    return this.configService.get<string>('GOOGLE_RECAPTCHA_SECRET_KEY');
  }

  getGoogleVerifyUrl() {
    return this.configService.get<string>('GOOGLE_SITE_VERIFY_URL');
  }

  async checkPassword(
    hashPassword: string,
    password: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashPassword);
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      const secretKey = this.getSecretKey();
      await this.jwtService.verifyAsync(token, { secret: secretKey });
      return true; // Token is valid
    } catch (err) {
      this.logger.error(`Token verification failed: ${err.message}`);
      return false; // Token is invalid
    }
  }

  async verifyFindAccessToken(token: string) {
    try {
      const reCaptchaSecretKey = this.getReCaptchaSecretKey();
      const payload = await this.jwtService.verifyAsync(token, {
        secret: reCaptchaSecretKey,
      });

      return {
        status: true,
        ...payload,
      };
    } catch (error) {
      this.logger.error(
        `VerifyFindAccessToken process failed: ${error.message}`,
      );
      return { status: false };
    }
  }

  generateToken(
    firstName: string,
    lastName: string,
    role: string,
    id: string,
    email: string,
  ) {
    const filterData = {
      firstName,
      lastName,
      role,
      id,
      email,
      // totalIncome: totalIncome,
      // totalExpense: totalExpense,
      // totalBalance: totalBalance,
    };
    const token = this.jwtService.sign(filterData);
    return token;
  }

  async handleLogin(loginDTO: LoginDTO): Promise<LoginSuccessResponse> {
    try {
      const mailDomain = loginDTO.email.split('@')[1].split('.')[0];
      const userId = this.userService.getUniqueIdFromEmail(loginDTO.email);

      const loginReferencePath = `SignWithEmail/${mailDomain}/${userId}`;
      const databaseReference = this.firebaseService
        .getDatabase()
        .ref(loginReferencePath);
      const snapshot = await databaseReference.once('value');
      if (!snapshot.exists()) {
        this.logger.warn(
          `Login attempt with incorrect email: ${loginDTO.email}`,
        );
        return {
          message: 'Invalid email or password !',
          error_message: 'Incorrect Data',
        };
      }

      if (snapshot.val().IsDisable) {
        this.logger.warn(
          `Login attempt for disabled account: ${loginDTO.email}`,
        );
        return {
          message: 'Account is disabled !',
          error_message: 'Disable Account',
        };
      }

      const passwordStatus = await this.checkPassword(
        snapshot.val().Password,
        loginDTO.password,
      );
      if (!passwordStatus) {
        this.logger.warn(
          `Login attempt with incorrect password for email: ${loginDTO.email}`,
        );
        return {
          message: 'Invalid email or password !',
          error_message: 'Incorrect Data',
        };
      }

      const {
        FirstName: firstName,
        LastName: lastName,
        AccountType: role,
        AccountID: accountId,
        Email: userEmail,
      } = snapshot.val();

      // const { totalIncome, totalExpense, totalBalance } =
      //   await getBudgetSummary(userId);
      // add type here later
      const token = this.generateToken(
        firstName,
        lastName,
        role,
        accountId,
        userEmail,
        // totalIncome,
        // totalExpense,
        // totalBalance,
      );

      // update last seen Date
      const currentDate = new Date().toString();

      await databaseReference.update({
        LastSeen_At: currentDate,
      });

      return {
        status: passwordStatus,
        accessToken: token,
        message: false,
        error_message: false,
      };
    } catch (error) {
      this.logger.error(`Login process failed: ${error.message}`);
      throw new Error(
        'An error occurred during the login process. Please try again later.',
      );
    }
  }

  // Generate a random OTP
  generateOTP() {
    const digits = '0123456789';
    let otp: string = '';
    for (let i = 0; i < 6; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }

  // Generate a hash from OTP
  generateHashFromOTP = (otp: string) => {
    const salt = bcrypt.genSaltSync(7);
    const hashOfOTP = bcrypt.hashSync(otp, salt);
    return hashOfOTP;
  };

  async generateCaptchaVerifyToken(data: any): Promise<string> {
    const message = data;
    const token = await this.jwtService.signAsync(message, {
      secret: this.getReCaptchaSecretKey(),
    });
    return token;
  }

  async handleVerifyCaptcha(
    recaptchaData: RecaptchaDTO,
  ): Promise<VerifyCaptchaResponse> {
    const googleVerifyUrl = this.getGoogleVerifyUrl();
    const reCaptchaSecretKey = this.getReCaptchaSecretKey();

    const data = new URLSearchParams();
    data.append('secret', reCaptchaSecretKey);
    data.append('response', recaptchaData.response);
    //   return this.httpService.axiosRef.get('http://localhost:3000/cats');
    try {
      const respond = await this.httpService.axiosRef.post(
        googleVerifyUrl,
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      if (respond.data.success) {
        const data = { verifyStatus: true };
        const token = await this.generateCaptchaVerifyToken(data);
        return {
          status: true,
          token,
        };
      } else {
        this.logger.error(`Captcha verification failed !`);
        return {
          status: false,
        };
      }
    } catch (error) {
      this.logger.error(`Captcha verification failed: ${error.message}`);
      throw new Error(
        'An error occurred during the Captcha verification failed. Please try again later.',
      );
    }
  }

  async findAccount(findAccountData: FindAccountDTO): Promise<boolean> {
    let userExist = false;
    // mail type eg- gmail, hotmail etc..
    const mailDomain = findAccountData.email.split('@')[1].split('.')[0];
    const userId = this.userService.getUniqueIdFromEmail(findAccountData.email);
    const findAccountReferencePath = `SignWithEmail/${mailDomain}/${userId}`;
    const databaseReference = this.firebaseService
      .getDatabase()
      .ref(findAccountReferencePath);

    await databaseReference.once('value', (snapshot) => {
      // email found
      if (snapshot.exists()) {
        userExist = true;
      }
    });
    return userExist;
  }

  async sendVerificationEmail(email: string, otp: string): Promise<boolean> {
    // HTML email template
    const html = `
      <h1>Verify Your Email</h1>
      <p>Please use the following OTP to verify your email:</p>
      <h2>${otp}</h2>
      <p><i>Note: This is a system-generated email. Please do not reply.</i></p>
    `;

    const yopMail = this.configService.get<string>('YOP_MAIL');

    const subject = 'Email Verification';

    try {
      await easyYopmail.writeMessage(yopMail, email, subject, html);
      this.logger.log(`Verification email sent to ${email}`);

      return true;
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}`);
      return false;
    }
  }
}
