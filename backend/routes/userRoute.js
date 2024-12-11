import express from "express";
import { getUsers, register, login, logout, createUser } from "../controllers/userController.js"; // Pastikan createUser diimpor
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

// Menambahkan route untuk menambahkan user baru
router.post("/users", createUser); // Pastikan fungsi createUser ada di userController.js

router.get("/users", verifyToken, getUsers);
router.post("/token", refreshToken);
router.post("/register", register);
router.post("/login", login);
router.delete("/logout", logout);

export default router;
