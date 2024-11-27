import { User } from "./user";
import { Auth } from "./auth";
import { Branch } from "./branch";
import { UserBranch } from "./userBranch";
import { Message } from "./message";
import Concurrence from "./concurrence";
import { Alert } from "./alerts";

Auth.hasOne(User, { onDelete: "CASCADE" });
User.belongsTo(Auth, { onDelete: "CASCADE" });

User.belongsToMany(Branch, { through: UserBranch });
Branch.belongsToMany(User, { through: UserBranch });

Message.belongsTo(User);
User.hasMany(Message);

Message.belongsTo(Branch);
Branch.hasMany(Message);

Concurrence.belongsTo(Branch);
Branch.hasMany(Concurrence);

Concurrence.belongsTo(User);
User.hasOne(Concurrence);

Alert.belongsTo(User);
User.hasMany(Alert);

Alert.belongsTo(Branch);
Branch.hasMany(Alert);

export { Auth, User, Branch, UserBranch, Message, Concurrence, Alert };
