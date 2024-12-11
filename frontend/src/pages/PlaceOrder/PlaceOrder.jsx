import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";

const PlaceOrder = () => {
  const { getTotalCartAmount, cartItems, foodList } = useContext(StoreContext);

  const subtotal = getTotalCartAmount(); // Total harga barang di keranjang
  const ongkosKirim = subtotal === 0 ? 0 : 5000; // Ongkos kirim tetap jika ada barang
  const total = subtotal + ongkosKirim; // Total pembayaran

  const [formData, setFormData] = useState({
    nama: "",
    noHp: "",
    alamat: "",
    detailAlamat: "",
    paymentMethod: "",
  });

  // Fungsi untuk menangani perubahan input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi form
    if (!formData.nama || !formData.noHp || !formData.alamat || !formData.paymentMethod) {
      alert("Semua field harus diisi sebelum melanjutkan pemesanan.");
      return;
    }

    // Nomor WhatsApp tujuan
    const waNumber = "6281959986108";

    // Pesan WhatsApp: Daftar barang yang dipesan
    let waMessage = `Hallo, saya ingin memesan:\n\n`;

    foodList.forEach((item) => {
      if (cartItems[item.name]) {
        const quantity = cartItems[item.name];
        const itemTotalPrice = item.price * quantity;
        waMessage += `${item.name} ( x${quantity} ) - Rp ${item.price.toLocaleString("id-ID")} per item, Total: Rp ${itemTotalPrice.toLocaleString("id-ID")}\n`;
      }
    });

    // Tambahkan subtotal, ongkos kirim, dan total pembayaran
    waMessage += `\nSubtotal: Rp ${subtotal.toLocaleString("id-ID")}\nOngkos Kirim: Rp ${ongkosKirim.toLocaleString("id-ID")}\nTotal: Rp ${total.toLocaleString("id-ID")}\n\n`;

    // Tambahkan informasi pengiriman
    waMessage += `Informasi Pengiriman:\nNama: ${formData.nama}\nNo HP: ${formData.noHp}\nAlamat: ${formData.alamat}\nDetail Alamat: ${formData.detailAlamat}\nMetode Pembayaran: ${formData.paymentMethod}`;

    // URL WhatsApp
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

    // Debug
    console.log("waMessage:", waMessage);
    console.log("waUrl:", waUrl);

    // Redirect ke WhatsApp
    window.open(waUrl, "_blank");
  };

  return (
    <form className="place-order" onSubmit={handleSubmit}>
      <div className="place-order-left">
        <p className="title">Informasi Pengiriman</p>
        <div className="multi-fields">
          <input type="text" name="nama" placeholder="Nama Lengkap" required onChange={handleInputChange} />
        </div>
        <div className="multi-fields">
          <input type="text" name="noHp" placeholder="No Handphone" required onChange={handleInputChange} />
        </div>
        <div className="multi-fields">
          <input type="text" name="alamat" placeholder="Alamat Lengkap" required onChange={handleInputChange} />
          <input type="text" name="detailAlamat" placeholder="Detail Lainnya (blok / Unit / Patokan)" onChange={handleInputChange} />
        </div>
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Total Keranjang</h2>
          <div>
            {foodList.map((item) => {
              if (cartItems[item.name]) {
                return (
                  <div key={item.name} className="cart-total-details">
                    <p>
                      {item.name} ( {cartItems[item.name]} )
                    </p>
                    <p>
                      Rp. {item.price.toLocaleString("id-ID")} ( x {cartItems[item.name]} )
                    </p>
                  </div>
                );
              }
              return null;
            })}
            <hr />
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>Rp. {subtotal.toLocaleString("id-ID")}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Ongkos Kirim</p>
              <p>Rp. {ongkosKirim.toLocaleString("id-ID")}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>Rp. {total.toLocaleString("id-ID")}</b>
            </div>
          </div>
          <br />
          <h3>
            <span></span> Pilih Metode Pembayaran
          </h3>
          <div className="payment">
            <label className="payment-method">
              <input
                type="radio"
                name="paymentMethod"
                required
                value="COD"
                onChange={handleInputChange}
                disabled={subtotal === 0} // Disabled jika keranjang kosong
              />
              <img src={assets.cod_} alt="Cod" />
              <span>
                <small>
                  Bayar di tempat <b>COD</b>
                </small>
              </span>
            </label>

            <label className="payment-method">
              <input
                type="radio"
                name="paymentMethod"
                required
                value="DANA"
                onChange={handleInputChange}
                disabled={subtotal === 0} // Disabled jika keranjang kosong
              />
              <img src={assets.dana_footer} alt="Dana" />
              <span>
                <small>
                  Bayar dengan <b>DANA</b>
                </small>
              </span>
            </label>

            <label className="payment-method">
              <input
                type="radio"
                name="paymentMethod"
                required
                value="OVO"
                onChange={handleInputChange}
                disabled={subtotal === 0} // Disabled jika keranjang kosong
              />
              <img src={assets.ovo_footer} alt="Ovo" />
              <span>
                <small>
                  Bayar dengan <b>OVO</b>
                </small>
              </span>
            </label>

            <label className="payment-method">
              <input
                type="radio"
                name="paymentMethod"
                required
                value="BRI"
                onChange={handleInputChange}
                disabled={subtotal === 0} // Disabled jika keranjang kosong
              />
              <img src={assets.bri} alt="Bri" />
              <span>
                <small>
                  Bayar dengan <b>BRI</b>
                </small>
              </span>
            </label>

            <label className="payment-method">
              <input
                type="radio"
                name="paymentMethod"
                required
                value="BCA"
                onChange={handleInputChange}
                disabled={subtotal === 0} // Disabled jika keranjang kosong
              />
              <img src={assets.bca} alt="Bca" />
              <span>
                <small>
                  Bayar dengan <b>BCA</b>
                </small>
              </span>
            </label>
          </div>

          <button type="submit" disabled={subtotal === 0}>
            Lanjutkan Pemesanan
          </button>
          {subtotal === 0 && (
            <p className="warning-message">
              Oops, keranjang Anda kosong !!! <br />
              Yuk, pilih produk favorit Anda agar bisa melanjutkan pemesanan.
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
