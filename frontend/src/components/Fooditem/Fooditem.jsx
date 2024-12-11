import React, { useContext } from "react";
import "./Fooditem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

const Fooditem = ({ name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          className="food-item-image"
          src={"http://localhost:5000/images/" + image} // Pastikan URL gambar benar
          alt={name} // Memberikan alt untuk aksesibilitas
        />
        {!cartItems[name] ? (
          <img className="add" onClick={() => addToCart(name)} src={assets.add_icon_white} alt="Add to cart" />
        ) : (
          <div className="food-item-counter">
            <img onClick={() => removeFromCart(name)} src={assets.remove_icon_red} alt="Remove from cart" />
            <p>{cartItems[name]}</p>
            <img onClick={() => addToCart(name)} src={assets.add_icon_green} alt="Add more" />
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">Rp.{price}</p>
      </div>
    </div>
  );
};

export default Fooditem;
