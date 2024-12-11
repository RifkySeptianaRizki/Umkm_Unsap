import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem"; // Pastikan penamaan file sesuai (case-sensitive)

const FoodDisplay = ({ category }) => {
  const { foodList } = useContext(StoreContext); // Gunakan nama variabel konsisten dengan context

  // Validasi jika foodList undefined/null atau kosong
  if (!foodList || foodList.length === 0) {
    return <p className="loading">Loading produk...</p>;
  }

  return (
    <div className="food-display" id="food-display">
      <h2>Produk Terbaik di UMKM UNSAP</h2>
      <div className="food-display-list">
        {foodList
          .filter((item) => category === "All" || category === item.category) // Filter berdasarkan kategori
          .map((item, index) => (
            <FoodItem key={index} id={item.id} name={item.name} description={item.description} price={item.price} image={item.image} />
          ))}
      </div>
    </div>
  );
};

export default FoodDisplay;
