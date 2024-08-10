import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { BudgetDTO } from './dto/users.dto';

@Injectable()
export class CreateBudgetService {
  private readonly logger = new Logger(CreateBudgetService.name);
  constructor(private readonly firebaseService: FirebaseService) {}

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
}
