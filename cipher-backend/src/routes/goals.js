import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/authMiddleware.js';
import { validate, goalSchema } from '../middleware/validate.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();
const prisma = new PrismaClient();

// Apply the security guard to EVERY route in this file automatically
router.use(verifyToken);

// ==========================================
// P4a: Create Goal (POST /api/goals)
// ==========================================
router.post('/', validate(goalSchema), asyncHandler(async (req, res) => {
    const { title, progress } = req.body;

    const newGoal = await prisma.goal.create({
        data: { 
            title, 
            progress: progress || 0, 
            targetDate: new Date(), 
            userId: req.user.userId 
        }
    });

    console.log(`New Goal added ${newGoal.title}`);

    res.status(201).json(newGoal);
}));

// ==========================================
// P4b: Get Goals (GET /api/goals)
// ==========================================
router.get('/', asyncHandler(async (req, res) => {
    const goals = await prisma.goal.findMany({
        where: { userId: req.user.userId },
        orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json(goals);
}));

// ==========================================
// P4c: Update Goal (PATCH /api/goals/:id)
// ==========================================
router.patch('/:id', validate(goalSchema), asyncHandler(async (req, res) => {
    const goalId = req.params.id; 
    const { title, progress, isCompleted } = req.body;

    const existingGoal = await prisma.goal.findFirst({
        where: { id: goalId, userId: req.user.userId }
    });

    if (!existingGoal) {
        res.status(404);
        throw new Error("Goal not found or unauthorized");
    }

    const updatedGoal = await prisma.goal.update({
        where: { id: goalId },
        data: { title, progress, isCompleted }
    });
    console.log(`Updated ${updatedGoal.title} to ${updatedGoal.progress}`);
    res.status(200).json(updatedGoal);
}));

// ==========================================
// P4d: Delete Goal (DELETE /api/goals/:id)
// ==========================================
router.delete('/:id', asyncHandler(async (req, res) => {
    const goalId = req.params.id;

    const existingGoal = await prisma.goal.findFirst({
        where: { id: goalId, userId: req.user.userId }
    });

    if (!existingGoal) {
        res.status(404);
        throw new Error("Goal not found or unauthorized");
    }

    await prisma.goal.delete({ where: { id: goalId } });
    
    res.status(200).json({ message: "Goal deleted successfully" });
}));

export default router;