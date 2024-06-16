import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  // constructor(
  //   private readonly jwtService: JwtService,
  //   private readonly firebaseService: FirebaseService,
  //   private readonly configService: ConfigService,
  // ) {}

  getUniqueIdFromEmail(email: string) {
    const hash = crypto.createHash('sha256');
    const uniqueId = hash.update(email).digest('hex');
    return uniqueId;
  }
}
