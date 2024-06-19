import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
// import { ResetPasswordSuccessResponse } from 'src/auth/dto/auth.dto';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private readonly firebaseService: FirebaseService) {}

  getUniqueIdFromEmail(email: string) {
    const hash = crypto.createHash('sha256');
    const uniqueId = hash.update(email).digest('hex');
    return uniqueId;
  }

  async createBudgetSummary(email: string) {
    const userId = this.getUniqueIdFromEmail(email);
    const budgetRefPath = 'Users';
    const fireStoreRef = this.firebaseService
      .getFirestore()
      .collection(budgetRefPath)
      .doc(userId);

    const newSummary = {
      totalIncome: 0,
      totalExpense: 0,
      totalBalance: 0,
    };

    try {
      const summaryDoc = await fireStoreRef.get();

      if (!summaryDoc.exists) {
        await fireStoreRef.set(newSummary);
        this.logger.log(
          `Initial BudgetSummary has been created for email: ${email}`,
        );
      }
    } catch (error) {
      this.logger.error(`createBudgetSummary process failed: ${error.message}`);
      throw new Error(
        'An error occurred while creating new budget summary. Please try again later.',
      );
    }
  }
}
