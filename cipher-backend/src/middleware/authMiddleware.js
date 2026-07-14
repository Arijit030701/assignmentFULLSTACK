import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if(!authHeader){
        return res.status(401).json({ error: "Access denied. No VIP wristband provided!" });
    }

    try {
        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

        const verifiedData = jwt.verify(token, process.env.JWT_SECRET);

        req.user = verifiedData;

        next();
    }catch(error){
        return res.status(400).json({ error: "Invalid or expired token." });
    }
};