import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import goalRoutes from './routes/goals.js'; 
import { errorHandler } from './middleware/errorHandler.js';
import focusRoutes from './routes/focus.js';
import aiRoutes from './routes/ai.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/goals', goalRoutes); 
app.use('/api/focus', focusRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Cipher Backend MVP is running smoothly!' });
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});