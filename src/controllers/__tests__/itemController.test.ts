import { ItemModel } from "../../models/item";
import { createItem, deleteItem, getItem, getItems, updateItem } from "../itemController";
import { Request, Response } from "express";

describe('Item Controller', () => {



// Explicitly mock all static methods used in tests
ItemModel.find = jest.fn();
ItemModel.create = jest.fn();
ItemModel.findById = jest.fn();
ItemModel.findByIdAndUpdate = jest.fn();
ItemModel.findByIdAndDelete = jest.fn();

const mockRes = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res as Response;
};

describe('Item Controller CRUD', () => {
  const next = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getItems: should return 200 and items', async () => {
    (ItemModel.find as jest.Mock).mockResolvedValue([{ name: 'Test' }]);
    const req = {} as Request;
    const res = mockRes();
    await getItems(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ name: 'Test' }]);
  });

  it('createItem: should create and return new item', async () => {
    (ItemModel.create as jest.Mock).mockResolvedValue({ name: 'Created' });
    const req = { body: { name: 'Created' } } as Request;
    const res = mockRes();
    await createItem(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ name: 'Created' });
  });

  it('getItem: should return item by id', async () => {
    (ItemModel.findById as jest.Mock).mockResolvedValue({ name: 'Found' });
    const req = { params: { id: '1' } } as any;
    const res = mockRes();
    await getItem(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ name: 'Found' });
  });

  it('getItem: should return 404 if not found', async () => {
    (ItemModel.findById as jest.Mock).mockResolvedValue(null);
    const req = { params: { id: '1' } } as any;
    const res = mockRes();
    await getItem(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Item not found' });
  });

  it('updateItem: should update and return item', async () => {
    (ItemModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({ name: 'Updated' });
    const req = { params: { id: '1' }, body: { name: 'Updated' } } as any;
    const res = mockRes();
    await updateItem(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ name: 'Updated' });
  });

  it('updateItem: should return 404 if not found', async () => {
    (ItemModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
    const req = { params: { id: '1' }, body: { name: 'Updated' } } as any;
    const res = mockRes();
    await updateItem(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Item not found' });
  });

  it('deleteItem: should delete and return message', async () => {
    (ItemModel.findByIdAndDelete as jest.Mock).mockResolvedValue({ name: 'Deleted' });
    const req = { params: { id: '1' } } as any;
    const res = mockRes();
    await deleteItem(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Item deleted' });
  });

  it('deleteItem: should return 404 if not found', async () => {
    (ItemModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
    const req = { params: { id: '1' } } as any;
    const res = mockRes();
    await deleteItem(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Item not found' });
  });
});
});