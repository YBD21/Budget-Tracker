import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';

import { FirebaseService } from 'src/firebase/firebase.service';
import { BudgetDTO } from 'src/users/dto/users.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateBudgetService } from '../update/update.service';

@Injectable()
export class CreateBudgetService {
  private readonly logger = new Logger(CreateBudgetService.name);
  constructor(
    private readonly firebaseService: FirebaseService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly updateService: UpdateBudgetService,
  ) {}

  private readonly usersCollectionPath = 'Users';
  private readonly budgetEntryCollectionPath = 'BudgetEntry';

  async createBudgetRecordAndUpdateSummary(
    userId: string,
    budgetData: BudgetDTO,
  ): Promise<boolean> {
    const fireStoreDB = this.firebaseService.getFirestore();
    const unixTimestamp = new Date().getTime();
    const newEntry = {
      ...budgetData,
      created_at: unixTimestamp,
    };

    // Path of Firestore -- User/userid/BudgetEntry/createdDate
    const budgetCollectionRef = fireStoreDB
      .collection(this.usersCollectionPath)
      .doc(userId)
      .collection(this.budgetEntryCollectionPath)
      .doc(unixTimestamp.toString());

    const budgetSummaryRef = fireStoreDB
      .collection(this.usersCollectionPath)
      .doc(userId);

    try {
      const transactionStatus = await fireStoreDB.runTransaction(
        async (transaction) => {
          // Fetch budget summary next
          const budgetSummarySnapshot = await transaction.get(budgetSummaryRef);

          if (!budgetSummarySnapshot.exists) {
            this.logger.error('Budget summary document does not exist.');
            return false;
          }
          // All reads are completed here, now proceed with writes

          // Set the new budget entry in the transaction
          transaction.set(budgetCollectionRef, newEntry);
          this.logger.log(`Budget entry created for user: ${userId}`);

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
              operation: 'add',
            });

          if (!updatedSummary) {
            this.logger.error(`Invalid data for type: ${budgetData.type}`);
            return false;
          }

          const updatePage = {
            totalEntry: totalEntry + 1,
            totalPage,
          };

          // Update totalEntry and totalPage (pagination logic)
          const remainder = updatePage.totalEntry % 5;
          const multiple = 5 * totalPage;

          if (remainder !== 0 && totalEntry > multiple) {
            updatePage.totalPage = totalPage + 1;
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
      this.logger.error(
        `Error while adding new Budget to Firestore: ${error.message}`,
      );
      return false; // Return false if an error occurs
    }
  }

  async createBudgetSummary(email: string): Promise<boolean> {
    const userId = this.userService.getUniqueIdFromEmail(email);

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
      const isEmptyDoc =
        Object.keys(summaryDoc.data()).length === 0 ? true : false;

      if (isEmptyDoc) {
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
}
