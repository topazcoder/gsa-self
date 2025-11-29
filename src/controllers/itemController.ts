import type { NextFunction, Request, Response } from 'express';
import { ItemModel } from '../models/item';
import logger from '../utils/logger';

export const createItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info('Creating item', { body: req.body });
        const {name} = req.body;
        const newItem = await ItemModel.create({name});
        res.status(201).json(newItem);
    } catch (error) {
        logger.error('Error creating item', { error });
        next(error);
    }
}

// Get all items
export const getItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info('Fetching all items');
        const items = await ItemModel.find();
        res.status(200).json(items);
    } catch (error) {
        logger.error('Error fetching items', { error });
        next(error);
    }
};

// Get a single item by ID
export const getItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info('Fetching item by id', { id: req.params.id });
        const item = await ItemModel.findById(req.params.id);
        if (!item) {
            logger.warn('Item not found', { id: req.params.id });
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (error) {
        logger.error('Error fetching item', { error, id: req.params.id });
        next(error);
    }
};

// Update an item by ID
export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info('Updating item', { id: req.params.id, body: req.body });
        const updatedItem = await ItemModel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedItem) {
            logger.warn('Item not found for update', { id: req.params.id });
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(updatedItem);
    } catch (error) {
        logger.error('Error updating item', { error, id: req.params.id });
        next(error);
    }
};

// Delete an item by ID
export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info('Deleting item', { id: req.params.id });
        const deletedItem = await ItemModel.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            logger.warn('Item not found for deletion', { id: req.params.id });
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted' });
    } catch (error) {
        logger.error('Error deleting item', { error, id: req.params.id });
        next(error);
    }
};
