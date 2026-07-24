import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/authMiddleware.js';
import { validate, taskSchema, subtaskSchema } from '../middleware/validate.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();
const prisma = new PrismaClient();

router.use(verifyToken);

router.post('/', validate(taskSchema), asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    const newTask = await prisma.task.create({
        data: { title, description, userId: req.user.userId }
    });

    console.log(`✅ New task successfully saved to DB: ${newTask.title}`);

    res.status(201).json(newTask);
}));

router.get('/', asyncHandler(async (req, res) => {
    const tasks = await prisma.task.findMany({
        where: { userId: req.user.userId },
        orderBy: { createdAt: 'desc' },
        include: { subtasks: true }
    });
    res.status(200).json(tasks);
}));

router.post('/:taskId/subtasks', validate(subtaskSchema), asyncHandler(async (req, res) => {
    const { title } = req.body;
    const { taskId } = req.params;

    // Verify the parent task belongs to the user before adding a subtask to it
    const existingTask = await prisma.task.findFirst({
        where: { id: taskId, userId: req.user.userId }
    });

    if (!existingTask) {
        res.status(404);
        throw new Error("Parent task not found or unauthorized");
    }

    const newSubtask = await prisma.subtask.create({
        data: {
            title,
            taskId: taskId 
        }
    });

    console.log(`✅ New subtask saved: ${newSubtask.title} (Parent Task: ${taskId})`);

    res.status(201).json(newSubtask);
}));

router.patch('/:id', validate(taskSchema), asyncHandler(async (req, res) => {
    const taskId = req.params.id; 
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
    const taskId = req.params.id;

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

router.patch('/subtasks/:subtaskId', asyncHandler(async (req, res) => {
    const { subtaskId } = req.params;
    const { isCompleted } = req.body;

    const updatedSubtask = await prisma.subtask.update({
        where: { id: subtaskId },
        data: { isCompleted }
    });

    res.status(200).json(updatedSubtask);
}));

router.delete('/subtasks/:subtaskId', asyncHandler(async (req, res) => {
    const { subtaskId } = req.params;

    await prisma.subtask.delete({
        where: { id: subtaskId }
    });

    res.status(200).json({ message: "Subtask deleted successfully" });
}));

export default router;