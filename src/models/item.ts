import mongoose, { Schema, Document } from 'mongoose';

export interface Item extends Document {
    name: string;
}

const ItemSchema: Schema = new Schema({
    name: { type: String, required: true }
});

export const ItemModel = mongoose.model<Item>('Item', ItemSchema);