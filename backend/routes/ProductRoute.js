import express from "express";
import multer from "multer";
import path from "path";
import { getProducts, getProductsById, saveProducts, updateProducts, deleteProducts } from "../controllers/ProductController.js";

const router = express.Router();

// Setup Multer storage untuk upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/"); // Tentukan direktori penyimpanan file
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Nama file unik dengan timestamp
  },
});

// Filter file agar hanya gambar yang dapat diupload
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/; // Format file yang diperbolehkan
  const isAllowed = allowedTypes.test(path.extname(file.originalname).toLowerCase()) && allowedTypes.test(file.mimetype);

  if (isAllowed) {
    cb(null, true);
  } else {
    cb(new Error("File harus berupa gambar (JPG, JPEG, PNG, atau GIF)."));
  }
};

const upload = multer({ storage, fileFilter });

// Rute untuk operasi produk
router.get("/products", getProducts);
router.get("/products/:id", getProductsById);
router.post("/products", upload.single("file"), saveProducts); // Menggunakan multer untuk upload file
router.patch("/products/:id", upload.single("file"), updateProducts); // Tambahkan upload file jika gambar baru ingin diupload saat update
router.delete("/products/:id", deleteProducts);

export default router;
