import { Injectable, Logger } from '@nestjs/common';

import { FirebaseService } from 'src/firebase/firebase.service';
import { BudgetDTO } from './dto/users.dto';
import { UsersService } from './users.service';

@Injectable()
export class CreateBudgetService {
  private readonly logger = new Logger(CreateBudgetService.name);
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly userService: UsersService,
  ) {}

  private readonly usersCollectionPath = 'Users';
  private readonly budgetEntryCollectionPath = 'BudgetEntry';

  async createBudget(userId: any, budgetData: BudgetDTO): Promise<boolean> {
    const unixTimestamp = new Date().getTime();
    const newEntry = {
      ...budgetData,
      created_at: unixTimestamp,
    };

    // Path of Firestore -- User/userid/BudgetEntry/createdDate
    const budgetCollectionRef = this.firebaseService
      .getFirestore()
      .collection(this.usersCollectionPath)
      .doc(userId)
      .collection(this.budgetEntryCollectionPath)
      .doc(unixTimestamp.toString());

    try {
      await budgetCollectionRef.set(newEntry);
      return true; // Return true if the operation is successful
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
}
