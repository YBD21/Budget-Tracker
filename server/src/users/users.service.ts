import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { FirebaseService } from 'src/firebase/firebase.service';
import { BudgetSummary, UserName } from './dto/users.dto';
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

  async getUserName(email: string): Promise<UserName> {
    const mailDomain = email.split('@')[1].split('.')[0];
    const userId = this.getUniqueIdFromEmail(email);

    const loginReferencePath = `SignWithEmail/${mailDomain}/${userId}`;
    const databaseReference = this.firebaseService
      .getDatabase()
      .ref(loginReferencePath);

    try {
      const snapshot = await databaseReference.once('value');

      if (!snapshot.exists()) {
        this.logger.warn(`Get username attempt with incorrect email: ${email}`);
      }

      return {
        firstName: snapshot.val().FirstName,
        lastName: snapshot.val().LastName,
      };
    } catch (error) {
      this.logger.error(
        `UsersService:getUserName process failed: ${error.message}`,
      );
      throw new Error(
        'An error occurred while fetching user name. Please try again later.',
      );
    }
  }

  async getBudgetSummary(
    email: string,
    userId: string,
  ): Promise<BudgetSummary> {
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
    try {
      const fireStoreDB = this.firebaseService.getFirestore();
      const {
        current,
        pageSize,
        sortField,
        sortOrder,
        type,
        reoccur,
        searchData,
      } = query;

      // Limit searchData to 40 characters
      const maxSearchLength = 40;
      const truncatedSearchData = searchData
        ? searchData.substring(0, maxSearchLength)
        : '';

      let budgetDataRef: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =
        fireStoreDB.collection(
          `${this.usersCollectionPath}/${userId}/${this.budgetEntryCollectionPath}`,
        );

      // Apply filters based on the query parameters
      if (type) {
        budgetDataRef = budgetDataRef.where('type', '==', type);
      }

      if (reoccur) {
        budgetDataRef = budgetDataRef.where('reoccur', '==', reoccur);
      }

      // Apply search filter if searchData is provided
      if (truncatedSearchData) {
        budgetDataRef = budgetDataRef
          .where('title', '>=', searchData)
          .where('title', '<=', searchData + '\uf8ff');
      }

      const firestoreSortOrder = sortOrder === 'descend' ? 'desc' : 'asc';

      if (sortField && sortOrder) {
        budgetDataRef = budgetDataRef.orderBy(sortField, firestoreSortOrder);
      } else {
        budgetDataRef = budgetDataRef.orderBy('date', 'asc');
      }

      const pageSizeInt = parseInt(pageSize);

      const totalCount = await budgetDataRef.count().get();

      if (current > 1) {
        const previousPageSnapshot = await budgetDataRef
          .limit((current - 1) * pageSizeInt)
          .get();

        if (!previousPageSnapshot.empty) {
          const lastDocument =
            previousPageSnapshot.docs[previousPageSnapshot.docs.length - 1];
          budgetDataRef = budgetDataRef.startAfter(lastDocument);
        }
      }

      budgetDataRef = budgetDataRef.limit(pageSizeInt);

      const snapshot = await budgetDataRef.get();

      const result = {
        data: snapshot.docs.map((doc) => ({
          key: doc.id,
          ...doc.data(),
        })),
        total: totalCount.data().count,
      };

      return result;
    } catch (error) {
      this.logger.error(
        'Firestore requires an index for this query:',
        error.message,
      );
    }
  }
}
