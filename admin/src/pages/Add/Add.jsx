import React, { useState } from "react";
import "./Add.css";
import { assets } from "../../assets/assets"; // Gambar default upload area
import axios from "axios";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";

const Add = ({ url }) => {
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Menangani error

  // Menangani perubahan pada input text dan sanitize inputan
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setError(""); // Hapus pesan error saat input diperbarui
    setData((prevData) => ({
      ...prevData,
      [name]: DOMPurify.sanitize(value), // Sanitasi inputan untuk nama dan deskripsi
    }));
  };

  // Menangani perubahan pada gambar
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSize = file.size; // Dalam byte
      const maxSize = 5 * 1024 * 1024; // Maksimal 5MB
      if (fileSize > maxSize) {
        setError("Ukuran gambar harus lebih kecil dari 5MB");
        return;
      }
      setImage(file);
      setError(""); // Hapus error jika ukuran gambar sesuai
    }
  };

  // Menangani proses pengiriman form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi form
    if (!data.name || !data.description || !data.price || !data.category) {
      setError("Semua data harus diisi, kategori harus dipilih, dan harga harus valid.");
      toast.error("Semua data harus diisi, kategori harus dipilih, dan harga harus valid.");
      return;
    }

    if (!image) {
      setError("Gambar belum ditambahkan!");
      toast.error("Gambar belum ditambahkan!");
      return;
    }

    if (isNaN(data.price) || parseFloat(data.price) <= 0) {
      setError("Harga harus valid dan lebih dari 0.");
      toast.error("Harga harus valid dan lebih dari 0.");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("price", parseFloat(data.price));
    formData.append("file", image);

    setLoading(true);

    try {
      const response = await axios.post(`${url}/api/products`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        // Reset form setelah berhasil
        setData({
          name: "",
          description: "",
          category: "",
          price: "",
        });
        setImage(null);
        setError("");
        toast.success("Produk berhasil ditambahkan");
      } else {
        setError("Gagal menambahkan produk.");
        toast.error("Gagal menambahkan produk.");
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        setError(error.response.data.msg || "Terjadi kesalahan saat mengirim data.");
        toast.error(error.response.data.msg || "Terjadi kesalahan saat mengirim data.");
      } else {
        setError("Terjadi kesalahan jaringan atau server.");
        toast.error("Terjadi kesalahan jaringan atau server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={handleSubmit}>
        {/* Bagian Gambar */}
        <div className="add-img-upload flex-col">
          <p>Tambahkan Gambar</p>
          <label htmlFor="image">{loading ? <div className="loading-overlay">Loading...</div> : <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="Upload Area" />}</label>
          <input onChange={handleImageChange} type="file" id="image" hidden required />
        </div>

        {/* Bagian Nama Produk */}
        <div className="add-product-name flex-col">
          <p>Nama Product</p>
          <input onChange={handleInputChange} value={data.name} type="text" name="name" placeholder="Type here" required />
        </div>

        {/* Bagian Deskripsi Produk */}
        <div className="add-product-description flex-col">
          <p>Deskripsi Product</p>
          <textarea onChange={handleInputChange} value={data.description} name="description" rows="6" placeholder="Write content here" required />
        </div>

        {/* Bagian Kategori dan Harga Produk */}
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Kategori Product</p>
            <select onChange={handleInputChange} name="category" value={data.category} required>
              {/* Opsi default */}
              <option value="" disabled>
                Silahkan pilih kategori produk
              </option>
              <option value="Galbi Gift Florist">Galbi Gift Florist</option>
              <option value="Uniqeve Bouquet">Uniqeve Bouquet</option>
              <option value="Zyzah Bouquet">Zyzah Bouquet</option>
              <option value="Dapoer Cemilan">Dapoer Cemilan Tiga Serangkai</option>
              <option value="Es nyendol.id">Es nyendol.id</option>
              <option value="Oura Bouquet">Oura Bouquet</option>
              <option value="RV Makeup">RV Makeup</option>
              <option value="Creamango">Creamango</option>
              <option value="Karituang">Karituang</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Harga Product</p>
            <input onChange={handleInputChange} value={data.price} type="number" name="price" placeholder="Rp." required />
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="error-message">{error}</p>}

        {/* Tombol Submit */}
        <button type="submit" className="add-btn" disabled={loading}>
          {loading ? "Loading..." : "ADD"}
        </button>
      </form>
    </div>
  );
};

export default Add;
