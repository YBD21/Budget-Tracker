import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { BudgetWithID } from 'src/users/dto/users.dto';
import { UpdateBudgetService } from '../update/update.service';

@Injectable()
export class DeleteBudgetService {
  private readonly logger = new Logger(DeleteBudgetService.name);

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly updateService: UpdateBudgetService,
  ) {}

  private readonly usersCollectionPath = 'Users';
  private readonly budgetEntryCollectionPath = 'BudgetEntry';

  async deleteBudgetRecordAndUpdateSummary(
    userId: string,
    budgetData: BudgetWithID,
  ): Promise<boolean> {
    const fireStoreDB = this.firebaseService.getFirestore();
    const budgetEntryDataRef = this.getBudgetEntryDataRef(fireStoreDB, userId);
    const budgetSummaryRef = this.getBudgetSummaryRef(fireStoreDB, userId);

    try {
      const transactionStatus = await fireStoreDB.runTransaction(
        async (transaction) => {
          // Fetch budget entry first
          const budgetEntryRef = budgetEntryDataRef.doc(budgetData.id);
          const budgetEntrySnapshot = await transaction.get(budgetEntryRef);

          if (!budgetEntrySnapshot.exists) {
            this.logger.warn(`Budget record does not exist: ${budgetData.id}`);
            return false;
          }

          // Fetch budget summary next
          const budgetSummarySnapshot = await transaction.get(budgetSummaryRef);

          if (!budgetSummarySnapshot.exists) {
            this.logger.error('Budget summary document does not exist.');
            return false;
          }

          // All reads are completed here, now proceed with writes

          // Delete the budget entry
          transaction.delete(budgetEntryRef);
          this.logger.log(`Budget record deleted: ${budgetData.id}`);

          const {
            totalIncome = 0,
            totalExpense = 0,
            totalEntry = 0,
            totalPage = 1,
          } = budgetSummarySnapshot.data() || {};

          // Calculate updated summary based on the type of budget and subtract operation
          const updatedSummary =
            await this.updateService.calculateUpdatedSummary(budgetData.type, {
              totalIncome,
              totalExpense,
              amount: budgetData.amount,
              operation: 'subtract',
            });

          if (!updatedSummary) {
            this.logger.error(`Invalid data for type: ${budgetData.type}`);
            return false;
          }

          const updatePage = {
            totalEntry: totalEntry - 1,
            totalPage,
          };

          // Update totalEntry and totalPage (pagination logic)
          const remainder = updatePage.totalEntry % 5;
          const multiple = 5 * totalPage;

          if (remainder === 0 && totalEntry < multiple) {
            updatePage.totalPage = totalPage - 1;
          }

          // Update the budget summary
          transaction.update(budgetSummaryRef, updatedSummary);
          transaction.update(budgetSummaryRef, updatePage);

          this.logger.log(`Budget summary updated for user: ${userId}`);
          return true;
        },
      );

      return transactionStatus;
    } catch (error) {
      this.handleTransactionError(error, 'deleteBudgetRecordAndUpdateSummary');
      throw new Error(
        'An error occurred while deleting the budget record and updating the summary. Please try again later.',
      );
    }
  }

  private getBudgetEntryDataRef(
    fireStoreDB: FirebaseFirestore.Firestore,
    userId: string,
  ): FirebaseFirestore.CollectionReference {
    return fireStoreDB
      .collection(this.usersCollectionPath)
      .doc(userId)
      .collection(this.budgetEntryCollectionPath);
  }

  private getBudgetSummaryRef(
    fireStoreDB: FirebaseFirestore.Firestore,
    userId: string,
  ): FirebaseFirestore.DocumentReference {
    return fireStoreDB.collection(this.usersCollectionPath).doc(userId);
  }

  private handleTransactionError(error: Error, functionName: string) {
    this.logger.error(
      `DeleteBudgetService:${functionName} failed: ${error.message}`,
    );
  }
}
