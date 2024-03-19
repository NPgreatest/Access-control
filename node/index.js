import express from 'express';
// import mongoose from './mongoose.js'; // Assuming mongoose.js is in the same directory
import bcrypt from 'bcrypt';
import {verifyToken,generateToken} from "./util/jwt.js";
import { User, Permission } from './mongoose.js';
import cors from 'cors';
import jwt from "jsonwebtoken";
const app = express();

app.use(cors());
app.use(express.json());



app.post('/admin_api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
        // 修改错误响应的结构，使其更为规范和易于前端处理
        return res.status(401).send({ message: 'Invalid username or password' });
    }
    const token = generateToken(username);
    res.status(200).json({token: token,code:200});
});


app.get('/admin_api/info', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({username: req.userId}); // 使用从令牌解码的userId查询用户
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send({ username: user.username, role: user.role });
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving user information' });
    }
});


app.post('/admin_api/change-password', async (req, res) => {
    const { userId, newPassword } = req.body;
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { passwordHash: newPasswordHash });
    res.send({ message: 'Password updated successfully',code:200 });
});

app.get('/admin_api/permissions', verifyToken, async (req, res) => {
    const permissions = await Permission.find().populate('userId');
    res.send(permissions);
});

app.post('/admin_api/permissions/update',  verifyToken, async (req, res) => {
    const {  userId,teamIds, accessLevel } = req.body;
    await Permission.findOneAndUpdate({ userId }, { teamIds, accessLevel }, { upsert: true });
    res.send({ message: 'Permissions updated successfully',code:200 });
});

app.post('/admin_api/permissions/delete', verifyToken, async (req, res) => {
    const { userId } = req.body;
    try {
        const result = await Permission.deleteOne({ userId });
        if (result.deletedCount === 0) {
            return res.status(404).send({ message: 'Permission not found', code: 404 });
        }
        res.send({ message: 'Permission deleted successfully', code: 200 });
    } catch (error) {
        res.status(500).send({ message: 'Failed to delete permission', code: 500 });
    }
});



app.get('/verify', async (req, res) => {
    const { userId, teamId, operation } = req.query;
    try {

        const permission = await Permission.findOne({ userId: userId });
        if (!permission) {
            return res.status(403).json({ message: "No permissions found for user" });
        }

        const hasAccess = permission.teamIds.includes(teamId) && (permission.accessLevel === operation || permission.accessLevel === "write");
        if (hasAccess) {
            res.status(200).json({ message: "Access granted" });
        } else {
            res.status(403).json({ message: "Access denied" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.post('/create-admin', async (req, res) => {
    const username = 'admin';
    const password = 'admin';

    // Check if an admin user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).send({ error: 'Administrator already created.' });
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create a new admin user
    const adminUser = new User({
        username,
        passwordHash,
    });

    try {
        await adminUser.save();
        res.send({ message: 'Administrator created successfully.' });
    } catch (error) {
        res.status(500).send({ error: 'Error creating administrator.' });
    }
});


app.listen(3000, () => console.log('Server running on port 3000'));
