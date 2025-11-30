import mongoose, { Document, Schema } from "mongoose";
import bcrypt from 'bcryptjs';

export interface User extends Document {
    username: string;
    email: string;
    password?: string;
    googleId? : string;
    authProvider?: 'local' | 'google';
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export const UserSchema: Schema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String},
    googleId: {type: String, unique: true, sparse: true},
    authProvider: {type: String, enum: ['local', 'google'], default: 'local'}
})

UserSchema.pre('save', async function (this: any, next) {
    if(this.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next as mongoose.SaveOptions;
        } catch (err) {
            next as mongoose.SaveOptions;
        }
    } else {
        next as mongoose.SaveOptions;
    }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    if (! this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = mongoose.model<User>('User', UserSchema);
