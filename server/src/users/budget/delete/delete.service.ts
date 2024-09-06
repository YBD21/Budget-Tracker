import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class DeleteBudgetService {
  private readonly logger = new Logger(DeleteBudgetService.name);
  constructor(private readonly firebaseService: FirebaseService) {}
}
