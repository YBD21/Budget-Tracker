import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
// import { ResetPasswordSuccessResponse } from 'src/auth/dto/auth.dto';
import { FirebaseService } from 'src/firebase/firebase.service';
import { BudgetSummary } from './dto/users.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private readonly firebaseService: FirebaseService) {}

  private readonly usersCollectionPath = 'Users';
  private readonly budgetEntryCollectionPath = 'BudgetEntry';

  getUniqueIdFromEmail(email: string) {
    const hash = crypto.createHash('sha256');
    const uniqueId = hash.update(email).digest('hex');
    return uniqueId;
  }

  async createBudgetSummary(email: string): Promise<boolean> {
    const userId = this.getUniqueIdFromEmail(email);

    const fireStoreRef = this.firebaseService
      .getFirestore()
      .collection(this.usersCollectionPath)
      .doc(userId);

    const newSummary = {
      totalIncome: 0,
      totalExpense: 0,
      totalBalance: 0,
      totalPage: 1,
      totalEntry: 0,
    };

    try {
      const summaryDoc = await fireStoreRef.get();

      if (!summaryDoc.exists) {
        await fireStoreRef.set(newSummary);
        this.logger.log(
          `Initial BudgetSummary has been created for email: ${email}`,
        );
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(
        `UsersService:createBudgetSummary process failed: ${error.message}`,
      );
      throw new Error(
        'An error occurred while creating new budget summary. Please try again later.',
      );
    }
  }

  async getBudgetSummary(email: string): Promise<BudgetSummary> {
    const userId = this.getUniqueIdFromEmail(email);

    const budgetSummaryRef = this.firebaseService
      .getFirestore()
      .collection(this.usersCollectionPath)
      .doc(userId);

    try {
      const summaryDoc = await budgetSummaryRef.get();

      if (summaryDoc.exists) {
        const {
          totalIncome,
          totalExpense,
          totalBalance,
          totalPage,
          totalEntry,
        } = summaryDoc.data();
        return {
          totalIncome,
          totalExpense,
          totalBalance,
          totalPage,
          totalEntry,
        };
      } else {
        this.logger.warn(`Budget summary document does not exist.`);

        const status = await this.createBudgetSummary(email);

        if (status) {
          const updateDoc = await budgetSummaryRef.get();

          if (updateDoc.exists) {
            const {
              totalIncome,
              totalExpense,
              totalBalance,
              totalPage,
              totalEntry,
            } = updateDoc.data();
            return {
              totalIncome,
              totalExpense,
              totalBalance,
              totalPage,
              totalEntry,
            };
          }
        }
      }
    } catch (error) {
      this.logger.error(
        `UsersService:getBudgetSummary process failed: ${error.message}`,
      );
      throw new Error(
        'An error occurred while fetching budget summary. Please try again later.',
      );
    }
  }

  async getBudgetData(userId, query) {
    console.log(userId);
    console.log(query);

    const budgetDataRef = this.firebaseService
      .getFirestore()
      .collection(
        `${this.usersCollectionPath}/${userId}/${this.budgetEntryCollectionPath}`,
      );

    const getBudgetList = await budgetDataRef.get();

    console.log(getBudgetList);
  }
}
