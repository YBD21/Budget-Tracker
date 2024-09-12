/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { BudgetWithID, updateBudget } from '../../dto/users.dto';

@Injectable()
export class UpdateBudgetService {
  private readonly logger = new Logger(UpdateBudgetService.name);
  constructor(private readonly firebaseService: FirebaseService) {}

  private readonly usersCollectionPath = 'Users';
  private readonly budgetEntryCollectionPath = 'BudgetEntry';

  async updateBudgetRecordAndUpdateSummary(
    userId: string,
    budgetData: BudgetWithID,
  ): Promise<boolean> {
    const fireStoreDB = this.firebaseService.getFirestore();
    const unixTimestamp = Date.now(); // Cleaner way to get current time
    const newEntry = { ...budgetData, updated_at: unixTimestamp };

    // Firestore paths
    const budgetCollectionRef = fireStoreDB
      .collection(this.usersCollectionPath)
      .doc(userId)
      .collection(this.budgetEntryCollectionPath)
      .doc(budgetData.id);

    const budgetSummaryRef = fireStoreDB
      .collection(this.usersCollectionPath)
      .doc(userId);

    try {
      const transactionStatus = await fireStoreDB.runTransaction(
        async (transaction) => {
          // Fetch previous budget data
          const prevBudgetSnapshot = await transaction.get(budgetCollectionRef);
          if (!prevBudgetSnapshot.exists) {
            this.logger.error(`Budget record does not exist: ${budgetData.id}`);
            return false;
          }

          // Fetch budget summary
          const budgetSummarySnapshot = await transaction.get(budgetSummaryRef);
          if (!budgetSummarySnapshot.exists) {
            this.logger.error('Budget summary document does not exist.');
            return false;
          }

          // Extract previous and summary data
          const {
            totalIncome = 0,
            totalExpense = 0,
            totalBalance = 0,
          } = budgetSummarySnapshot.data() || {};
          const { amount: prevAmount = 0, type: prevType } =
            prevBudgetSnapshot.data() || {};

          // Determine the amount difference and operation
          const isSameType = budgetData.type === prevType;
          const amountDifference = isSameType
            ? budgetData.amount - prevAmount
            : prevAmount + budgetData.amount;
          const operation = amountDifference >= 0 ? 'add' : 'subtract';
          const absoluteAmount = Math.abs(amountDifference);

          // Update budget entry
          transaction.update(budgetCollectionRef, newEntry);
          this.logger.log(`Budget entry updated for user: ${userId}`);

          // Calculate updated summary based on type changes
          const updatedSummary = this.calculateUpdatedBudgetSummary({
            totalIncome,
            totalExpense,
            totalBalance,
            prevAmount,
            budgetData,
            prevType,
            absoluteAmount,
            operation,
          });

          // Update the budget summary
          transaction.update(budgetSummaryRef, updatedSummary);
          this.logger.log(`Budget summary updated for user: ${userId}`);

          return true;
        },
      );

      return transactionStatus;
    } catch (error) {
      this.logger.error(
        `Error while updating existing Budget in Firestore: ${error.message}`,
      );
      return false; // Return false if an error occurs
    }
  }

  private calculateUpdatedBudgetSummary({
    totalIncome,
    totalExpense,
    totalBalance,
    prevAmount,
    budgetData,
    prevType,
    absoluteAmount,
    operation,
  }) {
    const updatedSummary = { totalIncome, totalExpense, totalBalance };

    if (prevType === 'Expense' && budgetData.type === 'Income') {
      updatedSummary.totalIncome += budgetData.amount;
      updatedSummary.totalExpense -= prevAmount;
    } else if (prevType === 'Income' && budgetData.type === 'Expense') {
      updatedSummary.totalIncome -= prevAmount;
      updatedSummary.totalExpense += budgetData.amount;
    } else if (prevType === 'Income' && budgetData.type === 'Income') {
      updatedSummary.totalIncome +=
        operation === 'add' ? absoluteAmount : -absoluteAmount;
    } else if (prevType === 'Expense' && budgetData.type === 'Expense') {
      updatedSummary.totalExpense +=
        operation === 'add' ? absoluteAmount : -absoluteAmount;
    }

    updatedSummary.totalBalance =
      updatedSummary.totalIncome - updatedSummary.totalExpense;
    return updatedSummary;
  }

  async updateBudgetSummary({
    userId,
    amount,
    type,
    operation,
  }: updateBudget): Promise<boolean> {
    const fireStoreDB = this.firebaseService.getFirestore();
    const budgetSummaryRef = fireStoreDB
      .collection(this.usersCollectionPath)
      .doc(userId);

    try {
      const transactionStatus = await fireStoreDB.runTransaction(
        async (transaction) => {
          const doc = await transaction.get(budgetSummaryRef);
          const isEmptyDoc =
            Object.keys(doc.data()).length === 0 ? true : false;

          if (isEmptyDoc) {
            this.logger.warn(`Budget summary document does not exist.`);
            return false;
          }

          const { totalIncome = 0, totalExpense = 0 } = doc.data() || {};
          const updatedSummary = await this.calculateUpdatedSummary(type, {
            totalIncome,
            totalExpense,
            amount,
            operation,
          });

          if (!updatedSummary) {
            this.logger.error(
              `Invalid type or operation provided: ${type}, ${operation}`,
            );
            return false;
          }

          transaction.update(budgetSummaryRef, updatedSummary);
          return true;
        },
      );

      this.logger.log(
        transactionStatus
          ? 'Budget summary updated successfully'
          : 'Error updating budget summary',
      );

      return transactionStatus;
    } catch (error) {
      this.logger.error(
        `UpdateBudgetService:updateBudgetSummary process failed: ${error.message}`,
      );
      throw new Error(
        'An error occurred while updating the budget summary. Please try again later.',
      );
    }
  }

  async calculateUpdatedSummary(
    type: string,
    data: {
      totalIncome: number;
      totalExpense: number;
      amount: number;
      operation: 'add' | 'subtract';
    },
  ) {
    const { totalIncome, totalExpense, amount, operation } = data;

    const updateValues = (newIncome: number, newExpense: number) => ({
      totalIncome: newIncome,
      totalExpense: newExpense,
      totalBalance: newIncome - newExpense,
    });

    if (operation === 'add') {
      return type === 'Income'
        ? updateValues(totalIncome + amount, totalExpense)
        : type === 'Expense'
          ? updateValues(totalIncome, totalExpense + amount)
          : null;
    }

    if (operation === 'subtract') {
      return type === 'Income'
        ? updateValues(totalIncome - amount, totalExpense)
        : type === 'Expense'
          ? updateValues(totalIncome, totalExpense - amount)
          : null;
    }

    return null;
  }

  async updateEntryAndPageCount({
    userId,
    operation, // 'add' or 'subtract'
  }: {
    userId: any;
    operation: 'add' | 'subtract';
  }): Promise<boolean> {
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
          const sign = operation === 'add' ? 1 : -1; // Use 1 for add and -1 for subtract

          const updatedSummary = {
            totalEntry: totalEntry + sign,
            totalPage,
          };

          const remainder = updatedSummary?.totalEntry % 5;
          const multiple = 5 * totalPage;

          if (
            operation === 'add' &&
            remainder !== 0 &&
            updatedSummary?.totalEntry > multiple
          ) {
            // increase totalPage count by one
            updatedSummary.totalPage = totalPage + 1;
          } else if (
            operation === 'subtract' &&
            remainder === 0 &&
            updatedSummary?.totalEntry < multiple
          ) {
            // decrease totalPage count by one when an entry is removed
            updatedSummary.totalPage = totalPage - 1;
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
