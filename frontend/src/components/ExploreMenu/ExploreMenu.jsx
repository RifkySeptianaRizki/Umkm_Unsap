import React from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Telusuri Daftar UMKM Kami</h1>
      <p className="explore-menu-text">
        Selamat datang di situs UMKM UNSAP! Kami bekerja sama dengan berbagai mahasiswa yang memiliki UMKM yang menyediakan produk dan layanan terbaik. Jelajahi daftar usaha di bawah ini untuk mengetahui lebih lanjut
      </p>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          return (
            <div onClick={() => setCategory((prev) => (prev === item.menu_name ? "All" : item.menu_name))} key={index} className="explore-menu-list-item">
              <img className={category === item.menu_name ? "active" : ""} src={item.menu_image} alt="" />
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
