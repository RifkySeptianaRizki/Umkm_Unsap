import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const LoginPopup = ({ setShowlogin }) => {
  const { url, setToken } = useContext(StoreContext);

  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [confPassword, setConfPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handler untuk input form
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleConfPasswordChange = (event) => {
    setConfPassword(event.target.value);
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const onLogin = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validasi checkbox syarat dan ketentuan (Sign Up)
    if (currState === "Sign Up" && !isChecked) {
      setErrorMessage("Silakan centang kotak persetujuan untuk melanjutkan.");
      return;
    }

    // Validasi password dan konfirmasi password (Sign Up)
    if (currState === "Sign Up" && data.password !== confPassword) {
      setErrorMessage("Password dan Konfirmasi Password tidak sesuai.");
      return;
    }

    // Siapkan payload sesuai dengan state
    const payload = currState === "Login" ? { email: data.email, password: data.password } : { name: data.name, email: data.email, password: data.password };

    // Endpoint backend
    const endpoint = currState === "Login" ? `${url}/api/login` : `${url}/api/users`;

    try {
      const response = await axios.post(endpoint, payload);
      console.log("Respons server:", response.data); // Debugging respons server

      // Login berhasil jika ada accessToken
      if (currState === "Login" && response.data.accessToken) {
        setToken(response.data.accessToken); // Simpan accessToken di context
        localStorage.setItem("token", response.data.accessToken); // Simpan token di localStorage
        setShowlogin(false); // Tutup popup login
      }

      // Sign Up berhasil jika success === true
      else if (currState === "Sign Up" && response.data.success) {
        setSuccessMessage(response.data.msg || "Pendaftaran berhasil.");
        setCurrState("Login"); // Alihkan kembali ke halaman login
      } else {
        setErrorMessage(response.data.message || "Terjadi kesalahan, silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Terjadi kesalahan saat menghubungkan ke server. Silakan coba lagi.");
      }
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowlogin(false)} src={assets.cross_icon} alt="Close" />
        </div>

        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <>
              <input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder="Nama" required />
            </>
          )}
          <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email" required />
          <input name="password" onChange={onChangeHandler} value={data.password} type="password" placeholder="Password" required />
          {currState === "Sign Up" && <input name="confPassword" onChange={handleConfPasswordChange} value={confPassword} type="password" placeholder="Konfirmasi Password" required />}
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <button type="submit">{currState === "Sign Up" ? "Tambahkan akun" : "Login"}</button>

        {currState === "Sign Up" && (
          <div className="login-popup-condition">
            <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} required />
            <p>Dengan melanjutkan, saya setuju dengan syarat dan ketentuan penggunaan serta kebijakan privasi.</p>
          </div>
        )}

        {currState === "Login" ? (
          <p>
            Tambahkan akun baru? <span onClick={() => setCurrState("Sign Up")}>Klik disini</span>
          </p>
        ) : (
          <p>
            Sudah memiliki akun? <span onClick={() => setCurrState("Login")}>Login disini</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
