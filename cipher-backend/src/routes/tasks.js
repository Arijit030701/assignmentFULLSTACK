import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const prisma = new PrismaClient();

router.use(verifyToken);

router.post('/', async (req, res) => {
    try {
        const {title, description} = req.body;

        if(!title) {
            return res.status(400).json({ error: "Task title is required" });
        }
        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                userid: req.user.userId
            }
        });
        res.status(201).json(newTask);
    }catch(error){
        console.error("Create Task Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/', async (req,res) => {
    try {
        const tasks = await prisma.task.findMany({
            where: { userId: req.user.userId},
            orderBy: {createdAt: 'desc'}
        });
        res.status(200).json(tasks);
    }catch (error) {
        console.error("Get Tasks Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.patch(':/id', async (req, res) =>{
    try{
        const taskId = req.params.id;
        const {title, description, isCompleted} = req.body;

        const existingTask = await prisma.task.findFirst({
            where: { id: taskId, userId: req.user.userId }
        });

        if (!existingTask) {
            return res.status(404).json({ error: "Task not found or unauthorized" });
        }

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: { title, description, isCompleted }
        });

        res.status(200).json(updatedTask);
    } catch(error){
        console.error("Update Task Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete(':/id', async (req,res) => {
    try {
        const taskId = req.params.id;

        const existingTask = await prisma.task.findFirst({
            where: { id: taskId, userId: req.user.userId }
        });

        if (!existingTask) {
            return res.status(404).json({ error: "Task not found or unauthorized" });
        }

        await prisma.task.delete({
            where: { id: taskId }
        });

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Delete Task Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;