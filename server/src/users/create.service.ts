import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class CreateBudgetService {
  private readonly logger = new Logger(CreateBudgetService.name);
  constructor(private readonly firebaseService: FirebaseService) {}

  private readonly budgetRefPath = 'Users';
}
