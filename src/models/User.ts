import mongoose, { type HydratedDocument, type Model, Schema, models } from 'mongoose';
import type { UserRole } from '@/types/domain';

export type UserDocument = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
};

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
      maxlength: 120,
    },
    password: {
      type: String,
      required: true,
      select: true,
    },
    role: {
      type: String,
      enum: ['HOST', 'ATTENDEE'],
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export type UserHydratedDocument = HydratedDocument<UserDocument>;

export const UserModel: Model<UserDocument> =
  (models.User as Model<UserDocument>) ?? mongoose.model<UserDocument>('User', userSchema);
