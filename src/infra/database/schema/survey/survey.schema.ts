import { Document, Schema as MongooseSchema2 } from 'mongoose';
import {
  Prop,
  Schema as MongooseSchema,
  SchemaFactory,
} from '@nestjs/mongoose';

@MongooseSchema({ timestamps: false })
export class Survey extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description: string;

  @Prop({ type: [Object], required: true })
  questions: Array<{
    question: string;
    type: 'text' | 'rating' | 'email';
  }>;

  @Prop({ type: Date, default: () => new Date() })
  created_at: Date;

  @Prop({ type: Date, default: null })
  updated_at: Date;
}

export const SurveySchema = SchemaFactory.createForClass(Survey);

@MongooseSchema({ timestamps: false })
export class Response extends Document {
  @Prop({
    required: true,
    type: MongooseSchema2.Types.ObjectId,
    ref: Survey.name,
  })
  survey: MongooseSchema2.Types.ObjectId;

  @Prop({
    type: [
      {
        _id: false,
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    required: true,
  })
  responses: Array<{
    question: string;
    answer: string;
  }>;

  @Prop({ type: Date, default: () => new Date() })
  created_at: Date;
}

export const ResponseSchema = SchemaFactory.createForClass(Response);
