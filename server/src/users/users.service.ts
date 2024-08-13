import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
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

  getUniqueIdFromEmail(email: string) {
    const hash = crypto.createHash('sha256');
    const uniqueId = hash.update(email).digest('hex');
    return uniqueId;
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

  async getBudgetData(userId: any, query: any) {
    const fireStoreDB = this.firebaseService.getFirestore();
    const { current, pageSize, sortField, sortOrder, type, reoccur } = query;

    console.log('userId:', userId);
    console.log('Query:', query);

    console.log('current:', current);
    console.log('pageSize:', pageSize);
    console.log('sortField:', sortField);
    console.log('sortOrder:', sortOrder);
    console.log('type:', type);
    console.log('reoccur:', reoccur);

    // Initialize as Query instead of CollectionReference
    let budgetDataRef: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =
      fireStoreDB.collection(
        `${this.usersCollectionPath}/${userId}/${this.budgetEntryCollectionPath}`,
      );

    // Apply filters dynamically if they exist in the query
    if (type) {
      budgetDataRef = budgetDataRef.where('type', '==', type);
    }

    if (reoccur) {
      budgetDataRef = budgetDataRef.where('reoccur', '==', reoccur);
    }

    // Apply sorting dynamically
    if (sortField && sortOrder) {
      budgetDataRef = budgetDataRef.orderBy(sortField, sortOrder);
    } else {
      // Default sorting (optional)
      budgetDataRef = budgetDataRef.orderBy('date', 'asc');
    }

    // Apply pagination
    budgetDataRef = budgetDataRef.limit(parseInt(pageSize));

    // Execute query and return data
    const snapshot = await budgetDataRef.get();
    return snapshot.docs.map((doc) => ({
      key: doc.id, // Add the document ID as a key
      ...doc.data(), // Spread the rest of the document data
    }));
  }
}
