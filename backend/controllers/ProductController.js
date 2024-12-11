import Product from "../models/ProductModel2.js";

// Mendapatkan semua produk
export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ msg: "Terjadi kesalahan saat mengambil produk" });
  }
};

// Mendapatkan produk berdasarkan ID
export const getProductsById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ msg: "Produk tidak ditemukan" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ msg: "Terjadi kesalahan saat mengambil produk" });
  }
};

// Menyimpan produk baru
export const saveProducts = async (req, res) => {
  const { name, description, category, price } = req.body;
  const file = req.file;

  if (!name || !description || !category || !price || !file) {
    return res.status(400).json({ msg: "Semua data produk wajib diisi dan gambar harus diupload." });
  }

  try {
    const newProduct = await Product.create({
      name,
      description,
      category,
      price: parseFloat(price),
      image: file.filename,
      url: `${req.protocol}://${req.get("host")}/images/${file.filename}`,
    });
    res.status(201).json({ msg: "Produk berhasil diupload", product: newProduct });
  } catch (error) {
    res.status(500).json({ msg: "Terjadi kesalahan saat menyimpan produk" });
  }
};

// Memperbarui produk
export const updateProducts = async (req, res) => {
  try {
    const updated = await Product.update(req.body, { where: { id: req.params.id } });
    if (!updated[0]) return res.status(404).json({ msg: "Produk tidak ditemukan" });
    res.json({ msg: "Produk berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ msg: "Terjadi kesalahan saat memperbarui produk" });
  }
};

// Menghapus produk
export const deleteProducts = async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });
    console.log(`Produk dengan ID ${req.params.id} dihapus: ${deleted}`);
    if (!deleted) return res.status(404).json({ msg: "Produk tidak ditemukan" });
    res.json({ success: true, msg: "Produk berhasil dihapus" });
  } catch (error) {
    console.error("Terjadi kesalahan saat menghapus produk:", error);
    res.status(500).json({ msg: "Terjadi kesalahan saat menghapus produk" });
  }
};
