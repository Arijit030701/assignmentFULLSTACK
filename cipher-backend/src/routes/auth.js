import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { validate, registerSchema, loginSchema } from '../middleware/validate.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const prisma = new PrismaClient();

// P1a: Register Route
router.post('/register', validate(registerSchema), asyncHandler(async (req, res) => {
    console.log("Incoming Data:", req.body);
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        res.status(400);
        throw new Error("User already exists"); 
    }

    // Hash the password and save the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
        data: { email, password: hashedPassword }
    });

    res.status(201).json({ message: "User registered successfully", userId: newUser.id });
}));

// P1b: Login Route
router.post('/login', validate(loginSchema), asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find the user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        res.status(400);
        throw new Error("Invalid credentials");
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        res.status(400);
        throw new Error("Invalid credentials");
    }

    // Generate JWT Token
    const token = jwt.sign(
        { userId: user.id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
    );

    res.status(200).json({ token });
}));

// P2b: Get Current User (Protected Route)
router.get('/me', verifyToken, asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { id: true, email: true, createdAt: true } // Do not send the password back!
    });

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    res.status(200).json(user);
}));

export default router;