import { HttpStatus, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service'; // Adjust the import path as needed

// Extend the Request interface to include accessData
declare module 'express-serve-static-core' {
  interface Request {
    accessData?: any;
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    // Example of using a method from AuthService
    // const user = await this.authService.validateUser(req.headers.authorization);
    // console.log(user);
    next();
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
        return res.status(HttpStatus.UNAUTHORIZED).send('Unauthorized');
      }
      req.accessData = accessData;
      next();
    } catch (error) {
      this.logger.error(
        `FindAccessMiddleware process failed: ${error.message}`,
      );
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal Server Error');
    }
  }
}
