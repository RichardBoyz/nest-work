import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  refreshToken: string;
}

export const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    username: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String },
    refreshToken: { type: String, default: '' },
  },
  {
    timestamps: true,
  },
);

// export interface User extends mongoose.Document {
//   id: string;
//   name: string;
//   username: string;
//   password: string;
//   email: string;
//   phone: string;
// }
