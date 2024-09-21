import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { FirebaseService } from 'src/firebase/firebase.service';
import {
  CreateAccountDTO,
  FindAccountDTO,
  LoginDTO,
  LoginSuccessResponse,
  RecaptchaDTO,
  ResetPasswordSuccessResponse,
  VerifyCaptchaResponse,
} from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { HttpService } from '@nestjs/axios';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly firebaseService: FirebaseService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly userService: UsersService,
    private readonly mailService: MailerService,
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

  async verifyHash(hash: string, pass: string): Promise<boolean> {
    return bcrypt.compare(pass, hash);
  }

  async verifyToken(token: string) {
    try {
      const secretKey = this.getSecretKey();
      const payload = await this.jwtService.verifyAsync(token, {
        secret: secretKey,
      });
      return {
        status: true,
        ...payload,
      }; // Token is valid
    } catch (err) {
      this.logger.error(`Token verification failed: ${err.message}`);
      return { status: false }; // Token is invalid
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

  generateToken(role: string, id: string, email: string) {
    const filterData = {
      role,
      id,
      email,
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

      const passwordStatus = await this.verifyHash(
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
        AccountType: role,
        AccountID: accountId,
        Email: userEmail,
      } = snapshot.val();

      const token = this.generateToken(role, accountId, userEmail);

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

  async createAccount(
    userData: CreateAccountDTO,
  ): Promise<ResetPasswordSuccessResponse> {
    try {
      const mailDomain = userData.email.split('@')[1].split('.')[0];
      const userId = this.userService.getUniqueIdFromEmail(userData.email);

      const createAccountRefPath = `SignWithEmail/${mailDomain}/${userId}`;

      const databaseReference = this.firebaseService
        .getDatabase()
        .ref(createAccountRefPath);

      const snapshot = await databaseReference.once('value');

      if (!snapshot.exists()) {
        const createdDate = new Date().toString();

        const encPass = this.encryptPassword(userData.password);

        await databaseReference.update({
          Created_At: createdDate,
          FirstName: userData.firstName,
          LastName: userData.lastName,
          Email: userData.email,
          LastSeen_At: createdDate,
          Password: encPass,
          AccountType: 'Client',
          AccountID: userId,
          IsDisable: false,
        });

        return {
          status: true,
        };
      }

      this.logger.warn(`Signup attempt with existing email: ${userData.email}`);
      return {
        status: false,
        error_message: 'Incorrect Data',
      };
    } catch (error) {
      this.logger.error(`Signup process failed: ${error.message}`);
      throw new Error(
        'An error occurred during the signup process. Please try again later.',
      );
    }
  }

  async resetPassword(
    resetData: LoginDTO,
  ): Promise<ResetPasswordSuccessResponse> {
    try {
      const mailDomain = resetData.email.split('@')[1].split('.')[0];
      const userId = this.userService.getUniqueIdFromEmail(resetData.email);
      const encPassword = this.encryptPassword(resetData.password);

      const resetReferencePath = `SignWithEmail/${mailDomain}/${userId}`;

      const databaseReference = this.firebaseService
        .getDatabase()
        .ref(resetReferencePath);

      const snapshot = await databaseReference.once('value');

      if (!snapshot.exists()) {
        // account not found for email
        this.logger.warn(
          `Reset Password attempt with incorrect email: ${resetData.email}`,
        );
        return {
          status: false,
          error_message: 'Incorrect Data',
        };
      }

      await databaseReference.update({
        Password: encPassword,
      });

      this.logger.log(`Password is Reset for with email: ${resetData.email}`);

      return {
        status: true,
      };
    } catch (error) {
      this.logger.error(`Reset Password process failed: ${error.message}`);
      throw new Error(
        'An error occurred during the reset password process. Please try again later.',
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

  // Generate a hash for password

  encryptPassword = (pass: string) => {
    const salt = bcrypt.genSaltSync(10);
    const encPass = bcrypt.hashSync(pass, salt);
    return encPass;
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

    const mail = this.configService.get<string>('MAIL');

    try {
      await this.mailService.sendMail({
        from: `"BudgetTracker"${mail}`,
        to: `${email}`,
        subject: 'Email Verification',
        html: html,
      });

      this.logger.log(`Verification email sent to ${email}`);
      return true;
    } catch (error) {
      console.log(error.message);
      this.logger.error(`Failed to send verification email to ${email}`);
      return false;
    }
  }
}
