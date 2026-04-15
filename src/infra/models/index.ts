import { Oauth } from "./oauth.model";
import { User } from "./user.model";

User.hasOne(Oauth, {
  foreignKey: "userId",
  sourceKey: "id",
  as: "oauth",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Oauth.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "id",
  as: "user",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export { User, Oauth };
