import userModel from "../models/userModel.js";

const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    if (!userId || !itemId) {
      return res.status(400).json({ success: false, message: "userId dan itemId harus disertakan" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    let cartData = userData.cartData || {};

    // Tambahkan item ke keranjang atau perbarui jumlahnya
    cartData[itemId] = (cartData[itemId] || 0) + 1;

    // Update data keranjang di database
    userData.cartData = cartData;
    await userData.save();

    res.json({ success: true, message: "Item berhasil ditambahkan ke keranjang", cartData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan saat menambah item ke keranjang" });
  }
};

// Hapus item dari keranjang
const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    if (!userId || !itemId) {
      return res.status(400).json({ success: false, message: "userId dan itemId harus disertakan" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    let cartData = userData.cartData || {};

    // Validasi jika item ada di keranjang
    if (cartData[itemId]) {
      if (cartData[itemId] > 1) {
        cartData[itemId] -= 1;
      } else {
        delete cartData[itemId];
      }

      userData.cartData = cartData;
      await userData.save();

      res.json({ success: true, message: "Item berhasil dihapus dari keranjang", cartData });
    } else {
      res.status(404).json({ success: false, message: "Item tidak ditemukan di keranjang" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan saat menghapus item dari keranjang" });
  }
};

const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, message: "userId harus disertakan" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    res.json({ success: true, cartData: userData.cartData || {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan saat mengambil data keranjang" });
  }
};

export { addToCart, removeFromCart, getCart };
