import db from "../config/db.js"; // Pastikan path relatif ke file db.js benar
import { DataTypes } from "sequelize";

const Users = db.define(
  "users",
  {
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    refresh_token: {
      type: DataTypes.TEXT,
    },
    cartData: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  },
  {
    freezeTableName: true,
    hooks: {
      beforeUpdate: (user, options) => {
        if (!user.cartData) {
          user.cartData = [];
        }
      },
    },
  }
);

export default Users;
