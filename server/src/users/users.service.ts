import { Injectable, Logger } from '@nestjs/common';
// import { ResetPasswordSuccessResponse } from 'src/auth/dto/auth.dto';
import { FirebaseService } from 'src/firebase/firebase.service';
import { BudgetSummary } from './dto/users.dto';
import { CreateBudgetService } from './create.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly createBudgetService: CreateBudgetService,
  ) {}

  private readonly usersCollectionPath = 'Users';
  private readonly budgetEntryCollectionPath = 'BudgetEntry';

  async getBudgetSummary(email: string): Promise<BudgetSummary> {
    const userId = this.createBudgetService.getUniqueIdFromEmail(email);

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

        const status =
          await this.createBudgetService.createBudgetSummary(email);

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
