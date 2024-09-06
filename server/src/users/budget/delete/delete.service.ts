import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class DeleteBudgetService {
  private readonly logger = new Logger(DeleteBudgetService.name);
  constructor(private readonly firebaseService: FirebaseService) {}
  private readonly usersCollectionPath = 'Users';
  private readonly budgetEntryCollectionPath = 'BudgetEntry';

  async deleteBudgetRecord(userId: string, recordId: string): Promise<boolean> {
    const budgetEntryDataRef = this.firebaseService
      .getFirestore()
      .collection(this.usersCollectionPath)
      .doc(userId)
      .collection(this.budgetEntryCollectionPath);

    try {
      const documentRef = budgetEntryDataRef.doc(recordId);
      const deleteStatus = await documentRef.delete();
      console.log(deleteStatus);
      return true;
    } catch (error) {
      this.logger.error(
        `Error while deleting BudgetRecord from Firestore: ${error.message}`,
      );
      return false;
    }
  }
}
