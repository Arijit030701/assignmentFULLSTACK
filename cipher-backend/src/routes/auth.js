import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();
const prisma = new PrismaClient();


router.post('/register', async (req, res) => {
  try {
    // 1. Extract email and password from the incoming request
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // 2. Check if a user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      return res.status(400).json({ error: "A user with this email already exists" });
    }

    // 3. Hash the password (P2c)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Save the new user to the database using Prisma
    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword, // Store the scrambled hash, NOT the real password
      }
    });

    // 5. Send a success response (excluding the password)
    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: newUser.id,
        email: newUser.email,
        createdAt: newUser.createdAt
      }
    });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({ error: "Email and password are required" });
        }
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        //checking if password is correct or not
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user.id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch(error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/me', verifyToken, async (req,res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {id: req.user.userId},
            select: {
                id: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ user });
    }catch (error) {
        console.error("Fetch User Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;