import express from "express";
import { addToCart, removeFromCart, getCart } from "../controllers/cartController.js";
import authMiddleware from "../middleware/auth.js";

const cartRouter = express.Router();

// Perbaiki rute ini
cartRouter.get("/get/:userId", authMiddleware, getCart); // Perbaiki dengan method GET dan path yang benar
cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.post("/remove", authMiddleware, removeFromCart);

export default cartRouter;
