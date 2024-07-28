import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SurveyModule } from './survey/survey.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DATABASE_URI, {
      dbName: process.env.DATABASE_NAME,
      auth: {
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS,
      },
    }),
    SurveyModule,
  ],
})
export class AppModule {}
