import { DataTypes } from "sequelize";
import { User } from './interfaces/iuser.model'
import sequelize from "../config/db";
import { OAuthProvider } from "../helpers/constants";

export const UserModel = User.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      username: {
        type: DataTypes.STRING(255)
      },
      password: {
        type: DataTypes.STRING
      },
      refreshToken: {
        type: DataTypes.STRING(255)
      },
      refreshTokenExpiryTime: {
        type: DataTypes.DATE
      },
      oauthLogin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      oauthProvider: {
        type: DataTypes.ENUM(...Object.values(OAuthProvider)),
        defaultValue: OAuthProvider.none
      }
}, {
    tableName: 'users',
    sequelize: sequelize,
    timestamps: true,
    hooks : {
      beforeCreate : User.hashPassword
  }
})