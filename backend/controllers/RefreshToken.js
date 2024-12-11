import jwt from "jsonwebtoken";
import Users from "../models/userModel.js";

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) return res.status(401).json({ msg: "Token refresh tidak ditemukan" });

  try {
    // Memeriksa apakah refresh token ada di database
    const user = await Users.findOne({ where: { refresh_token: refreshToken } });
    if (!user) return res.status(403).json({ msg: "Refresh token tidak valid" });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ msg: "Refresh token tidak valid" });

      const accessToken = jwt.sign({ userId: decoded.userId, name: decoded.name, email: decoded.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
      res.json({ accessToken });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
