import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const prisma = new PrismaClient();

// Apply the security guard to EVERY route in this file automatically
router.use(verifyToken);

// ==========================================
// P4a: Create Goal (POST /api/goals)
// ==========================================
router.post('/', async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ error: "Goal title is required" });
        }

        const newGoal = await prisma.goal.create({
            data: {
                title,
                description,
                userId: req.user.userId 
            }
        });

        res.status(201).json(newGoal);
    } catch (error) {
        console.error("Create Goal Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ==========================================
// P4b: Get Goals (GET /api/goals)
// ==========================================
router.get('/', async (req, res) => {
    try {
        const goals = await prisma.goal.findMany({
            where: { userId: req.user.userId },
            orderBy: { createdAt: 'desc' } 
        });

        res.status(200).json(goals);
    } catch (error) {
        console.error("Get Goals Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ==========================================
// P4c: Update Goal (PATCH /api/goals/:id)
// ==========================================
router.patch('/:id', async (req, res) => {
    try {
        const goalId = req.params.id; 
        const { title, description, isCompleted } = req.body;

        const existingGoal = await prisma.goal.findFirst({
            where: { id: goalId, userId: req.user.userId }
        });

        if (!existingGoal) {
            return res.status(404).json({ error: "Goal not found or unauthorized" });
        }

        const updatedGoal = await prisma.goal.update({
            where: { id: goalId },
            data: { title, description, isCompleted }
        });

        res.status(200).json(updatedGoal);
    } catch (error) {
        console.error("Update Goal Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ==========================================
// P4d: Delete Goal (DELETE /api/goals/:id)
// ==========================================
router.delete('/:id', async (req, res) => {
    try {
        const goalId = req.params.id;

        const existingGoal = await prisma.goal.findFirst({
            where: { id: goalId, userId: req.user.userId }
        });

        if (!existingGoal) {
            return res.status(404).json({ error: "Goal not found or unauthorized" });
        }

        await prisma.goal.delete({
            where: { id: goalId }
        });

        res.status(200).json({ message: "Goal deleted successfully" });
    } catch (error) {
        console.error("Delete Goal Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;