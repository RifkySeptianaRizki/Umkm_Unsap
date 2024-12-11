import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import db from "./config/db.js";
import Product from "./models/ProductModel2.js";
import User from "./models/userModel.js";
import userRouter from "./routes/userRoute.js";
import fs from "fs";
import ProductRouter from "./routes/ProductRoute.js";
import jwt from "jsonwebtoken";
import cartRouter from "./routes/cartRoute.js";

// Konfigurasi direktori saat ini
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Konfigurasi lingkungan
dotenv.config();

// Inisialisasi aplikasi
const app = express();

// Middleware untuk parsing cookie
app.use(cookieParser());

// Middleware untuk CORS
app.use(
  cors({
    origin: "http://localhost:5000",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
  })
);

// Middleware untuk parsing JSON dan URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Menyajikan file statis dari folder public/images
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Konfigurasi Multer untuk unggah file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public/images")); // Pastikan folder ini ada
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Menyimpan dengan nama unik berdasarkan waktu
  },
});

// Filter untuk file gambar
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // Format file sesuai
  } else {
    cb(new Error("Error: File harus berupa gambar (JPG, JPEG, PNG, GIF)."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// Rute untuk menghapus produk
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne({ where: { id } });

    if (!product) {
      return res.status(404).json({ success: false, msg: "Produk tidak ditemukan." });
    }

    const imagePath = path.join(__dirname, "public/images", product.image);

    fs.access(imagePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error("Gambar tidak ditemukan:", err);
        return res.status(404).json({ success: false, msg: "Gambar tidak ditemukan." });
      }

      fs.unlink(imagePath, async (err) => {
        if (err) {
          console.error("Error menghapus gambar:", err);
          return res.status(500).json({ success: false, msg: "Terjadi kesalahan saat menghapus gambar." });
        }

        await product.destroy();
        res.status(200).json({ success: true, msg: "Produk berhasil dihapus!" });
      });
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, msg: "Terjadi kesalahan saat menghapus produk." });
  }
});

// Rute untuk mengambil daftar produk
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.findAll();
    console.log("Products fetched:", products); // Pastikan produk diambil dengan benar
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, msg: "Terjadi kesalahan saat mengambil data produk." });
  }
});

// Rute untuk memperbarui token
app.post("/api/token", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ msg: "Token refresh tidak ditemukan" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findOne({ where: { id: decoded.userId } });

    if (!user || user.refresh_token !== refreshToken) {
      return res.status(403).json({ msg: "Refresh token tidak valid" });
    }

    const accessToken = jwt.sign({ userId: decoded.userId, name: decoded.name, email: decoded.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });

    res.json({ accessToken });
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    res.status(403).json({ msg: "Token refresh tidak valid" });
  }
});

// Gunakan router yang diimport
app.use("/api", ProductRouter);
app.use("/api", userRouter);
app.use("/api/cart", cartRouter);

// Sinkronisasi dengan database
async () => {
  try {
    await db.sync(); // Sinkronkan semua model dengan database
    console.log("Database synced!");
  } catch (error) {
    console.error("Failed to sync database:", error);
  }
};

// Menjalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
