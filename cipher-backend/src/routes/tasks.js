import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/authMiddleware.js';
import { validate, taskSchema } from '../middleware/validate.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();
const prisma = new PrismaClient();

router.use(verifyToken);

router.post('/', validate(taskSchema), asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    const newTask = await prisma.task.create({
        data: { title, description, userId: req.user.userId }
    });

    res.status(201).json(newTask);
}));

router.get('/', asyncHandler(async (req, res) => {
    const tasks = await prisma.task.findMany({
        where: { userId: req.user.userId },
        orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(tasks);
}));

router.patch('/:id', validate(taskSchema), asyncHandler(async (req, res) => {
    const taskId = parseInt(req.params.id); 
    const { title, description, isCompleted } = req.body;

    const existingTask = await prisma.task.findFirst({
        where: { id: taskId, userId: req.user.userId }
    });

    if (!existingTask) {
        res.status(404);
        throw new Error("Task not found or unauthorized"); // Throws straight to the Global Handler
    }

    const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: { title, description, isCompleted }
    });

    res.status(200).json(updatedTask);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
    const taskId = parseInt(req.params.id);

    const existingTask = await prisma.task.findFirst({
        where: { id: taskId, userId: req.user.userId }
    });

    if (!existingTask) {
        res.status(404);
        throw new Error("Task not found or unauthorized");
    }

    await prisma.task.delete({ where: { id: taskId } });
    res.status(200).json({ message: "Task deleted successfully" });
}));

export default router;