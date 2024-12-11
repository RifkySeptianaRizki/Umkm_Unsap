import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const formatWithK = (number) => {
  return number >= 1000 ? (number / 1000).toFixed(1) + "K" : number;
};

const Cart = () => {
  const { cartItems, foodList, removeFromCart, getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();

  if (!foodList || foodList.length === 0) {
    return <p>Data produk belum dimuat.</p>;
  }
  const isCartEmpty = Object.keys(cartItems).length === 0;

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Barang</p>
          <p>Nama</p>
          <p>Harga</p>
          <p>Jumlah</p>
          <p>Total</p>
          <p>Hapus</p>
        </div>
        <hr />

        {Object.keys(cartItems).length > 0 ? (
          foodList.map((item) => {
            // Ganti item._id dengan item.name
            if (cartItems[item.name]) {
              return (
                <div key={item.name}>
                  <div className="cart-items-title cart-items-item">
                    <img src={`http://localhost:5000/images/${item.image}`} alt={item.name} />
                    <p>{item.name}</p>
                    <p>{formatWithK(item.price)}</p>
                    <p>{cartItems[item.name]}</p>
                    <p>{formatWithK(item.price * cartItems[item.name])}</p>
                    <p onClick={() => removeFromCart(item.name)} className="cross">
                      x
                    </p>
                  </div>
                  <hr />
                </div>
              );
            }
            return null;
          })
        ) : (
          <p className="empty-cart">Keranjang Anda kosong. Yuk, tambahkan produk favorit Anda!</p>
        )}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Total Keranjang</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>Rp. {getTotalCartAmount().toLocaleString("id-ID")}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Ongkos Kirim</p>
              <p>Rp. {getTotalCartAmount() === 0 ? 0 : 5000}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>Rp. {(getTotalCartAmount() + (getTotalCartAmount() === 0 ? 0 : 5000)).toLocaleString("id-ID")}</b>
            </div>
          </div>
          <button
            onClick={() => navigate("/order")}
            disabled={isCartEmpty} // Tombol dinonaktifkan jika keranjang kosong
            style={{ cursor: isCartEmpty ? "not-allowed" : "pointer" }} // Ganti kursor saat tombol dinonaktifkan
          >
            Lanjutkan Ke Pembayaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
