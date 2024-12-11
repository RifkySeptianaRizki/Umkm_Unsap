import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : {};
  });

  const [foodList, setFoodList] = useState([]); // Data produk
  const [token, setToken] = useState(localStorage.getItem("token") || ""); // Token autentikasi
  const url = "http://localhost:5000"; // URL backend

  // Simpan cart ke Local Storage
  const saveCartToLocalStorage = (cart) => {
    localStorage.setItem("cartItems", JSON.stringify(cart));
  };

  // Tambahkan item ke keranjang (berdasarkan name)
  const addToCart = (itemName) => {
    console.log("Menambahkan item:", itemName);

    setCartItems((prev) => {
      const updatedCart = {
        ...prev,
        [itemName]: (prev[itemName] || 0) + 1,
      };
      saveCartToLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  // Hapus item dari keranjang (berdasarkan name)
  const removeFromCart = (itemName) => {
    console.log("Menghapus item:", itemName);

    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[itemName] > 1) {
        updatedCart[itemName] -= 1;
      } else {
        delete updatedCart[itemName];
      }
      saveCartToLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  // Hitung total keranjang berdasarkan data produk dan jumlah item
  const getTotalCartAmount = () => {
    let totalAmount = 0;

    if (foodList.length > 0) {
      for (const itemName in cartItems) {
        const itemInfo = foodList.find((product) => product.name === itemName); // Cari item berdasarkan name
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[itemName];
        }
      }
    }

    return totalAmount;
  };

  // Ambil daftar produk dari server
  const fetchFoodList = async () => {
    try {
      const response = await fetch(`${url}/api/products`);
      const data = await response.json();
      setFoodList(data.data || []); // Pastikan data produk di-set
    } catch (error) {
      console.error("Error mengambil produk:", error.message);
    }
  };

  // Logout: Hapus token dan cartItems dari localStorage dan state
  const logout = () => {
    console.log("Logout: Menghapus token dan keranjang belanja.");
    localStorage.removeItem("token"); // Hapus token
    localStorage.removeItem("cartItems"); // Hapus keranjang
    setToken(""); // Reset state token
    setCartItems({}); // Reset state keranjang
  };

  // Fetch data produk saat pertama kali render
  useEffect(() => {
    fetchFoodList();
  }, []);

  // Nilai context yang akan diakses oleh komponen lain
  const contextValue = {
    foodList,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    setToken,
    url,
    logout, // Tambahkan fungsi logout
  };

  return <StoreContext.Provider value={contextValue}>{props.children}</StoreContext.Provider>;
};

export default StoreContextProvider;
