import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole, APP_CONSTANTS } from '../../../shared';

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.SALES_REP,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        const docObj = ret as Record<string, unknown>;
        docObj.id = (docObj._id as { toString(): string })?.toString();
        delete docObj._id;
        delete docObj.__v;
        delete docObj.passwordHash;
        return docObj;
      },
    },
  }
);

// Method to compare candidate password with stored hash
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Static helper to hash passwords before saving
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, APP_CONSTANTS.BCRYPT_ROUNDS || 12);
}

export const UserModel = model<IUserDocument>('User', userSchema);
