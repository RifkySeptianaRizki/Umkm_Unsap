import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";
const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="" className="logo" />
          <p> Selamat datang di situs UMKM UNSAP! Kami menyediakan berbagai layanan terbaik untuk memenuhi kebutuhan Anda. Jelajahi menu kami untuk mengetahui lebih lanjut tentang produk dan layanan yang kami tawarkan.</p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+62 819 - 5998 - 6108</li>
            <li>umkm.unsap@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2024 © Umkm.Unsap.com - All Right Reserved</p>
    </div>
  );
};

export default Footer;
