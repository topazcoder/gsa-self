import type { NextFunction, Request, Response } from 'express';
import { ItemModel } from '../models/item';

export const createItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {name} = req.body;
        const newItem = await ItemModel.create({name});
        res.status(201).json(newItem);
    } catch (error) {
        next(error);
    }
}

// Get all items
export const getItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const items = await ItemModel.find();
        res.status(200).json(items);
    } catch (error) {
        next(error);
    }
};

// Get a single item by ID
export const getItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const item = await ItemModel.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.status(200).json(item);
    } catch (error) {
        next(error);
    }
};

// Update an item by ID
export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedItem = await ItemModel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
        res.status(200).json(updatedItem);
    } catch (error) {
        next(error);
    }
};

// Delete an item by ID
export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deletedItem = await ItemModel.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
        res.status(200).json({ message: 'Item deleted' });
    } catch (error) {
        next(error);
    }
};