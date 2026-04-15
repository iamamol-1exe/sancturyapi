import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db/postgres";

interface OauthAttributes {
  id: number | string;
  uuid: string;
  userId: number | string;
  provider: string;
  providerAccountId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface OauthCreationAttributes extends Optional<
  OauthAttributes,
  "id" | "uuid"
> {}

export class Oauth
  extends Model<OauthAttributes, OauthCreationAttributes>
  implements OauthAttributes
{
  public id!: string | number;
  public uuid!: string;
  public userId!: string | number;
  public provider!: string;
  public providerAccountId!: string;
  public accessToken!: string;
  public refreshToken!: string;
  public expiresAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Oauth.init(
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
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    provider: {
      type: DataTypes.ENUM("google", "github"),
      allowNull: false,
    },
    providerAccountId: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    accessToken: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { sequelize, tableName: "oauths", timestamps: true, underscored: true },
);
