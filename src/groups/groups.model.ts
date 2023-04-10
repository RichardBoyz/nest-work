import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type GroupDocument = Group & Document;

@Schema({ timestamps: true })
export class Group {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  customId: string;

  @Prop()
  discription: string;
}

export const GroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    customId: { type: String, required: true },
    discription: { type: String, default: '' },
  },
  {
    timestamps: true,
  },
);
