import mongoose from 'mongoose';
const { Schema } = mongoose;

mongoose.connect('mongodb://127.0.0.1:27017/local')
    .then(() => console.log("数据库连接成功~"))
    .catch(err => console.log("数据库连接失败~", err));

const UserSchema = new Schema({
    username: { type: String, unique: true },
    passwordHash: String,
});

const PermissionSchema = new Schema({
    userId: { type: String, unique:true },
    teamIds: [{ type: String }],
    accessLevel: String,
});

export const User = mongoose.model('User', UserSchema);
export const Permission = mongoose.model('Permission', PermissionSchema);
