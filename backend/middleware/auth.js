import jwt from "jsonwebtoken";

// Middleware untuk autentikasi
const authMiddleware = async (req, res, next) => {
  try {
    // Ambil token dari header Authorization
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Token tidak ditemukan. Login kembali" });
    }

    // Pisahkan "Bearer" dari token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Token tidak valid. Login kembali" });
    }

    // Verifikasi token
    const token_decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = { userId: token_decode.userId }; // Simpan userId di req.user
    next();
  } catch (error) {
    console.error("Error dalam autentikasi:", error.message);
    const message = error.name === "TokenExpiredError" ? "Token telah kedaluwarsa. Login kembali." : "Token tidak valid. Login kembali";
    res.status(403).json({ success: false, message });
  }
};

export default authMiddleware;
