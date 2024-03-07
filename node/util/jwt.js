import jwt from "jsonwebtoken";
export const secretKey = 'jessica-SecretKey';
export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send({ message: 'No token provided!' });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized!' });
        }
        req.userId = decoded.userId;
        next();
    });
};


export const generateToken = (userId) => {
    const payload = {
        userId: userId,
    };
    const options = {
        expiresIn: '1h',
    };
    const token = jwt.sign(payload, secretKey, options);
    return token;
};
