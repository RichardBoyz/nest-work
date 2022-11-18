import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  nickName: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  role: string;

  @Prop()
  workSpace: number;

  @Prop()
  refreshToken: string;

  @Prop({ default: Date.now() })
  updateDate: Date;
}

export const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    nickName: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    role: { type: String, default: 'user' },
    workSpace: { type: Number, default: 122 },
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
