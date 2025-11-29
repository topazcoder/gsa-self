import { Router } from "express";
import { createItem, deleteItem, getItems, getItem, updateItem } from "../controllers/itemController";

const itemRoutes = Router();


itemRoutes.get("/", getItems);         // Get all items
itemRoutes.post("/", createItem);      // Create item
itemRoutes.get("/:id", getItem);       // Get item by id
itemRoutes.put("/:id", updateItem);    // Update item by id
itemRoutes.delete("/:id", deleteItem); // Delete item by id

export default itemRoutes;