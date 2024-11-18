import { User } from "./user";
import { Auth } from "./auth";
import { Branch } from "./branch";
import { UserBranch } from "./userBranch";
import { Message } from "./message";
import Concurrence from "./concurrence";

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

export { Auth, User, Branch, UserBranch, Message, Concurrence };
