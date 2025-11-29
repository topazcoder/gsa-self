import { ItemModel } from "../../models/item";

// Ensure all static methods are Jest mocks for all tests
(ItemModel.find as jest.Mock) = jest.fn();
(ItemModel.create as jest.Mock) = jest.fn();
(ItemModel.findById as jest.Mock) = jest.fn();
(ItemModel.findByIdAndUpdate as jest.Mock) = jest.fn();
(ItemModel.findByIdAndDelete as jest.Mock) = jest.fn();
import { createItem, deleteItem, getItem, getItems, updateItem } from "../itemController";
import { request, Request, Response } from "express";

describe('Item Controller', () => {


jest.mock('../../models/item');

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

  beforeEach(() => {
  (ItemModel.findByIdAndDelete as jest.Mock) = jest.fn();
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

    const req: Partial<Request> = { params: { id: '1' } };
    const res = mockRes();
    await getItem(request, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ name: 'Found' });
  });

  it('getItem: should return 404 if not found', async () => {
    (ItemModel.findById as jest.Mock).mockResolvedValue(null);
    const req: Partial<Request> = { params: { id: '1' } };
    const res = mockRes();
    await getItem(request, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Item not found' });
  });

  it('updateItem: should update and return item', async () => {
    (ItemModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({ name: 'Updated' });
    const req: Partial<Request> = { params: { id: '1' }, body: { name: 'Updated' } };
    const res = mockRes();
    await updateItem(request, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ name: 'Updated' });
  });

  it('updateItem: should return 404 if not found', async () => {
    (ItemModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
    const req: Partial<Request> = { params: { id: '1' }, body: { name: 'Updated' } };
    const res = mockRes();
    await updateItem(request, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Item not found' });
  });

  it('deleteItem: should delete and return message', async () => {
    (ItemModel.findByIdAndDelete as jest.Mock).mockResolvedValue({ name: 'Deleted' });
    const req: Partial<Request> = { params: { id: '1' } };
    const res = mockRes();
    await deleteItem(request, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Item deleted' });
  });

  it('deleteItem: should return 404 if not found', async () => {
    (ItemModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
    const req: Partial<Request> = { params: { id: '1' } };
    const res = mockRes();
    await deleteItem(request, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Item not found' });
  });
});
});