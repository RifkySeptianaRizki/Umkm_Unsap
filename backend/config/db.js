import { Sequelize } from "sequelize";

// Sesuaikan dengan informasi database yang Anda gunakan
const db = new Sequelize("databaseumkmunsap", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false, // Nonaktifkan logging jika tidak diperlukan
});

// Cek koneksi ke database
db.authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.error("Error: " + err));

export default db;
