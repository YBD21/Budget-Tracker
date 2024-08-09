import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';

// Extend the Request interface to include accessData
declare module 'express-serve-static-core' {
  interface Request {
    userData?: any;
  }
}

@Injectable()
export class UserDataMiddleware implements NestMiddleware {
  private readonly logger = new Logger(UserDataMiddleware.name);
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = req.cookies.userData;

      const userData = await this.authService.verifyToken(accessToken);

      if (userData?.status === false) {
        throw new UnauthorizedException();
      }

      req.userData = userData;
      next();
    } catch (error) {
      this.logger.error(`UserDataMiddleware process failed: ${error.message}`);
      throw new InternalServerErrorException();
    }
  }
}
