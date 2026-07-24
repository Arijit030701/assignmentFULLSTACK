import { z } from 'zod';
// 1. Define the Blueprints (Schemas)
export const registerSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const taskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    isCompleted: z.boolean().optional()
});

export const subtaskSchema = z.object({
    title: z.string().min(1, "Subtask title is required").max(255),
    isCompleted: z.boolean().optional()
});

export const goalSchema = z.object({
    title: z.string().min(1, "Title is required").optional(),
    progress: z.number().min(0).max(100).optional(),
    isCompleted: z.boolean().optional()
});

export const focusSessionSchema = z.object({
    duration: z.number().min(1, "Session must be at least 1 minute long"),
    startTime: z.any(),
    endTime: z.any()
});

// 2. Define the Middleware that checks the blueprints
export const validate = (schema) => (req, res, next) => {
    try {
        // This throws an error if the user's req.body doesn't match the schema
        schema.parse(req.body); 
        next(); // If it passes, move to the route!
    } catch (error) {
        // If it fails, send a 400 Bad Request with exactly what went wrong
        const details = error.errors 
            ? error.errors.map(err => err.message) 
            : [error.message];
        res.status(400).json({ 
            error: "Validation failed", 
            details: error.errors.map(err => err.message) 
        });
    }
};