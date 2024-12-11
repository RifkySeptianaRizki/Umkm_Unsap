import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ url }) => {
  const [list, setList] = useState([]);

  // Fungsi untuk mengambil data produk
  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/products`); // Pastikan URL benar
      if (response.data.success && Array.isArray(response.data.data)) {
        setList(response.data.data); // Set data produk
        toast.success("Data produk berhasil diambil!"); // Notifikasi sukses
      } else {
        toast.error("Gagal mengambil data produk.");
      }
    } catch (error) {
      console.error("Error fetching list:", error);
      toast.error("Terjadi kesalahan saat mengambil data.");
    }
  };

  // Fungsi untuk menghapus produk
  const removeProduct = async (productId) => {
    try {
      const response = await axios.delete(`${url}/api/products/${productId}`); // Perbaiki URL
      if (response.data.success) {
        setList((prevList) => prevList.filter((item) => item.id !== productId));
        toast.success("Produk berhasil dihapus!");
      } else {
        toast.error("Gagal menghapus produk.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Terjadi kesalahan saat menghapus produk.");
    }
  };

  useEffect(() => {
    fetchList(); // Ambil data saat komponen dimuat
  }, []);

  return (
    <div className="list add flex-col">
      <p>Semua Produk</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Gambar</b>
          <b>Nama</b>
          <b>Kategori</b>
          <b>Harga</b>
          <b>Aksi</b>
        </div>
        {list.length > 0 ? (
          list.map((item) => (
            <div key={item.id} className="list-table-format">
              {/* Periksa apakah gambar ada dan tambahkan URL gambar */}
              <img
                src={`${url}/images/${item.image}`} // Perbaiki path gambar
                alt={item.name}
                onError={(e) => (e.target.src = "/images/default.jpg")} // fallback image jika error
              />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.price}</p>
              <button onClick={() => removeProduct(item.id)} className="delete-button">
                Hapus
              </button>
            </div>
          ))
        ) : (
          <p>Tidak ada produk untuk ditampilkan.</p>
        )}
      </div>
    </div>
  );
};

export default List;
