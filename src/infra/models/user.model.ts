import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db/postgres";

interface UserAttributes {
  id: number | string;
  uuid: string;
  email: string;
  name: string;
  username: string;
  passwordHash: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<
  UserAttributes,
  "id" | "uuid"
> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string | number;
  public uuid!: string;
  public email!: string;
  public passwordHash!: string;
  public name!: string;
  public username!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.CITEXT,
      unique: true,
      allowNull: true,
    },
    passwordHash: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "password_hash",
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },  
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ["email"] }],
  },
);
