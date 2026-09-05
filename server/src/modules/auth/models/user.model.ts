import mongoose, { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole, APP_CONSTANTS } from '../../../shared';

export interface IUser {
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  passwordHash?: string;
  password?: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      trim: true,
      default: function(this: IUserDocument) {
        return `${this.firstName || ''} ${this.lastName || ''}`.trim() || 'User';
      }
    },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
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
      select: false,
    },
    password: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.SALES_REP,
      required: true,
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
        delete docObj.password;
        return docObj;
      },
    },
  }
);

// Method to compare candidate password with stored hash
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const hash = this.passwordHash || this.password;
  if (!hash) return false;
  return bcrypt.compare(candidatePassword, hash);
};

// Static helper to hash passwords before saving
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, APP_CONSTANTS.BCRYPT_ROUNDS || 12);
}

export const UserModel = model<IUserDocument>('User', userSchema);
export const User = UserModel;

