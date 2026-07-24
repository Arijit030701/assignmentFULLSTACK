import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/authMiddleware.js';
// import { validate, focusSessionSchema } from '../middleware/validate.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();
const prisma = new PrismaClient();

router.use(verifyToken);

// Save Completed Session
router.post('/', verifyToken, asyncHandler(async (req, res) => {
    const { duration, startTime, endTime } = req.body;
    const userId = req.userId;
    const newSession = await prisma.focusSession.create({
        data: {
            duration,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            userId: userId
        }
    });
    
    res.status(201).json(newSession);
}));

// Get Analytics
router.get('/analytics', asyncHandler(async (req, res) => {
    const userId = req.user.userId;

    const analytics = await prisma.focusSession.aggregate({
        where: { userId: userId },
        _sum: { duration: true },
        _count: { id: true }
    });

    const recentSessions = await prisma.focusSession.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    res.status(200).json({
        totalSessions: analytics._count.id || 0,
        totalMinutesFocused: analytics._sum.duration || 0,
        recentSessions: recentSessions
    });
}));

export default router;