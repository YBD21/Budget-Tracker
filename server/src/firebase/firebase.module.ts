import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { FirebaseService } from './firebase.service';

@Module({
  imports: [],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
