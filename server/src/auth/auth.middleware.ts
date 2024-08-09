import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service'; // Adjust the import path as needed

// Extend the Request interface to include accessData
declare module 'express-serve-static-core' {
  interface Request {
    accessData?: any;
  }
}

@Injectable()
export class FindAccessMiddleware implements NestMiddleware {
  private readonly logger = new Logger(FindAccessMiddleware.name);
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const findAccessToken = req.cookies.findAccess;

      const accessData =
        await this.authService.verifyFindAccessToken(findAccessToken);

      if (accessData.status === false) {
        throw new UnauthorizedException();
      }
      req.accessData = accessData;
      next();
    } catch (error) {
      this.logger.error(
        `FindAccessMiddleware process failed: ${error.message}`,
      );
      throw new InternalServerErrorException();
    }
  }
}
