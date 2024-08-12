/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { updateBudget } from './dto/users.dto';

@Injectable()
export class UpdateBudgetService {
  private readonly logger = new Logger(UpdateBudgetService.name);
  constructor(private readonly firebaseService: FirebaseService) {}

  private readonly usersCollectionPath = 'Users';
  private readonly budgetEntryCollectionPath = 'BudgetEntry';

  async updateBudgetSummary({
    userId,
    amount,
    type,
  }: updateBudget): Promise<boolean> {
    const fireStoreDB = this.firebaseService.getFirestore();

    const budgetSummaryRef = fireStoreDB
      .collection(this.usersCollectionPath)
      .doc(userId);

    try {
      const transactionStatus = await fireStoreDB.runTransaction(
        async (transaction) => {
          const doc = await transaction.get(budgetSummaryRef);
          if (!doc.exists) {
            this.logger.error(`Budget summary document does not exist.`);
            return false;
          }

          const { totalIncome, totalExpense } = doc.data();
          let updatedSummary = {};

          if (type === 'Income') {
            // Income
            updatedSummary = {
              totalIncome: totalIncome + amount,
              totalBalance: totalIncome + amount - totalExpense,
            };
          } else {
            // Expense
            updatedSummary = {
              totalExpense: totalExpense + amount,
              totalBalance: totalIncome - (totalExpense + amount),
            };
          }

          transaction.update(budgetSummaryRef, updatedSummary);
          return true;
        },
      );

      return transactionStatus;
    } catch (error) {
      this.logger.error(
        `UpdateBudgetService:updateBudgetSummary process failed: ${error.message}`,
      );
      throw new Error(
        'An error occurred while updating budget summary. Please try again later.',
      );
    }
  }

  async updateEntryAndPageCount(userId: any): Promise<boolean> {
    const fireStoreDB = this.firebaseService.getFirestore();

    const budgetSummaryRef = fireStoreDB
      .collection(this.usersCollectionPath)
      .doc(userId);

    try {
      const transactionStatus = await fireStoreDB.runTransaction(
        async (transaction) => {
          const doc = await transaction.get(budgetSummaryRef);
          if (!doc.exists) {
            this.logger.error(`Budget summary document does not exist.`);
            return false;
          }
          const { totalEntry, totalPage } = doc.data();
          const updatedSummary = {
            totalEntry: totalEntry + 1,
            totalPage,
          };

          const remainder = updatedSummary?.totalEntry % 5;

          const multiple = 5 * totalPage;

          if (remainder !== 0 && updatedSummary?.totalEntry > multiple) {
            // increase totalPage count by one
            updatedSummary.totalPage = totalPage + 1;
          }

          transaction.update(budgetSummaryRef, updatedSummary);

          return true;
        },
      );

      return transactionStatus;
    } catch (error) {
      this.logger.error(
        `UpdateBudgetService:updateEntryAndPageCount process failed: ${error.message}`,
      );
      throw new Error(
        'An error occurred while updating budget summary. Please try again later.',
      );
    }
  }
}
