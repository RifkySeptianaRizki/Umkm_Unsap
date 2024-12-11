import React from "react";
import "./Header.css";
const Header = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <h2>Order Makanan, Barang Atau Jasa</h2>
        <p>Bangun lingkungan bisnis yang inovatif dan produktif dengan pemanfaatan teknologi oleh UMKM mahasiswa.</p>
        <button onClick={() => document.querySelector("#explore-menu").scrollIntoView({ behavior: "smooth" })}>Lihat Produk</button>
      </div>
    </div>
  );
};

export default Header;
