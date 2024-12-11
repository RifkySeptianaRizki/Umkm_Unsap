import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Fungsi untuk mengambil data user
export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({ attributes: ["id", "name", "email"] });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Terjadi kesalahan saat mengambil data pengguna." });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = await Users.create({ name, email, password: hashPassword });
    res.status(201).json({ success: true, msg: "User berhasil ditambahkan.", data: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Terjadi kesalahan saat menambahkan user." });
  }
};

// Fungsi untuk mendaftar user baru (register)
export const register = async (req, res) => {
  const { name, email, password, confPassword } = req.body;

  // Validasi password
  if (password !== confPassword) {
    return res.status(400).json({ msg: "Password tidak sama dengan konfirmasi password." });
  }

  try {
    // Cek apakah email sudah terdaftar
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: "Email sudah terdaftar." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Simpan user baru ke database
    const newUser = await Users.create({ name, email, password: hashPassword });

    res.status(201).json({ success: true, msg: "Akun berhasil dibuat.", data: { id: newUser.id, name: newUser.name, email: newUser.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Terjadi kesalahan saat membuat akun." });
  }
};

// Fungsi untuk refresh token
export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ msg: "Refresh token tidak ada." });

  try {
    const user = await Users.findOne({ where: { refresh_token: refreshToken } });
    if (!user) return res.status(403).json({ msg: "Refresh token tidak valid." });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, userData) => {
      if (err) return res.status(403).json({ msg: "Token tidak valid." });

      const newAccessToken = jwt.sign({ userId: userData.userId, name: userData.name, email: userData.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Terjadi kesalahan saat refresh token." });
  }
};

// Fungsi untuk login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ where: { email } });
    if (!user) return res.status(404).json({ msg: "Email tidak ditemukan." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Password salah." });

    const accessToken = jwt.sign({ userId: user.id, name: user.name, email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ userId: user.id, name: user.name, email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });

    await Users.update({ refresh_token: refreshToken }, { where: { id: user.id } });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Terjadi kesalahan saat login." });
  }
};

// Fungsi untuk logout
export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  try {
    const user = await Users.findOne({ where: { refresh_token: refreshToken } });
    if (!user) return res.sendStatus(204);

    await Users.update({ refresh_token: null }, { where: { id: user.id } });
    res.clearCookie("refreshToken");

    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Terjadi kesalahan saat logout." });
  }
};
