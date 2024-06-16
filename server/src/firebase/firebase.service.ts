import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../../serviceAccountKey.json';

@Injectable()
export class FirebaseService {
  private dataBase: admin.database.Database;
  private fireStoreDB: admin.firestore.Firestore;

  constructor(private configService: ConfigService) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      databaseURL: this.configService.get('FIREBASE_DATABASE_URL'),
    });

    this.dataBase = admin.database();
    this.fireStoreDB = admin.firestore();
  }

  getDatabase() {
    return this.dataBase;
  }

  getFirestore() {
    return this.fireStoreDB;
  }
}
