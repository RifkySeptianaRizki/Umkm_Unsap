import React, { useContext, useState, useRef } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { FaBars } from "react-icons/fa";

const Navbar = ({ setShowlogin }) => {
  const [menu, setMenu] = useState("menu");
  const [isMobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [isHamburgerClicked, setIsHamburgerClicked] = useState(false);
  const [isProfileMenuVisible, setProfileMenuVisible] = useState(false);

  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  // Fungsi untuk toggle menu hamburger di mobile
  const toggleMobileMenu = () => {
    setMobileMenuVisible(!isMobileMenuVisible);
    setIsHamburgerClicked(!isHamburgerClicked); // Toggle warna ikon hamburger
  };

  // Fungsi untuk toggle menu dropdown profil
  const toggleProfileMenu = () => {
    setProfileMenuVisible(!isProfileMenuVisible);
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="logo" />
      </Link>

      <ul className={`navbar-menu ${isMobileMenuVisible ? "active" : ""}`}>
        <Link to="/" onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>
          Beranda
        </Link>
        <a href="#explore-menu" onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>
          Produk
        </a>
        <a href="#app-download" onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>
          Aplikasi
        </a>
        <a href="#footer" onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>
          Contact
        </a>
      </ul>

      {/* Navbar right section */}
      <div className="navbar-right">
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="Cart" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        <div className="navbar-hamburger" onClick={toggleMobileMenu}>
          <FaBars className={isHamburgerClicked ? "active" : ""} /> {/* Menampilkan ikon hamburger dengan warna berubah */}
        </div>
        {!token ? (
          <button onClick={() => setShowlogin(true)}>Sign In</button>
        ) : (
          <div className="navbar-profile" onClick={toggleProfileMenu} ref={profileMenuRef}>
            <img src={assets.profile_icon} alt="Profile" />
            {isProfileMenuVisible && (
              <ul className="nav-profile-dropdown">
                <li onClick={logout}>
                  <img src={assets.logout_icon} alt="Logout" />
                  <p>Logout</p>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Overlay untuk layar gelap */}
      {isMobileMenuVisible && <div className="navbar-overlay" onClick={toggleMobileMenu}></div>}
    </div>
  );
};

export default Navbar;
