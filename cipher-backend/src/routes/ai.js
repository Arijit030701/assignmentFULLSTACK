import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { verifyToken } from '../middleware/authMiddleware.js'; // Adjust to your auth path

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/generate-feature', verifyToken, async (req, res) => {
    try {
        const { prompt, componentName } = req.body;

        if (!prompt || !componentName) {
            return res.status(400).json({ message: "Prompt and componentName are required." });
        }

        // 1. System Prompt enforces 'export default' and standard React/CSS
        const model = genAI.getGenerativeModel({ 
            model: "gemini-3.6-flash",
            systemInstruction: `You are an expert React developer. 
            Generate raw React JSX code for a component named "${componentName}".
            Rules:
            1. Return ONLY a valid JSON object with a single key "code".
            2. The code MUST be exported as DEFAULT: export default function ${componentName}() { ... }
            3. Use ONLY standard HTML elements and React inline styles (style={{ ... }}). Do NOT import external CSS files or third-party libraries (like lucide-react or framer-motion).`,
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const result = await model.generateContent(
            `Component Name: ${componentName}\nRequirement: ${prompt}`
        );

        let responseText = result.response.text();

        // 1. Strip out markdown formatting if the AI wrapped the JSON in code blocks
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        // 2. Sanitize unescaped control characters (like raw newlines or tabs) that break JSON parsing
        // This safely escapes them so JSON.parse() can read them without crashing
        responseText = responseText.replace(/[\u0000-\u001F\u007F-\u009F]/g, function (match) {
            return '\\u' + ('0000' + match.charCodeAt(0).toString(16)).slice(-4);
        });
        responseText = responseText.replace(/,\s*([\]}])/g, '$1');
        const parsedData = JSON.parse(responseText);

        // 2. Define target directory and file path (Adjust relative path to match your frontend folder)
        const targetDir = path.resolve(process.cwd(), '../assignment3/src/components/generated');
        const filePath = path.join(targetDir, `${componentName}.jsx`);

        // 3. Auto-create directory if it doesn't exist
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        // 4. Save the file directly to your frontend
        fs.writeFileSync(filePath, parsedData.code, 'utf8');

        res.json({ message: `✨ Component ${componentName}.jsx created and rendered live!` });

    } catch (error) {
        console.error("AI Generation Error:", error);
        res.status(500).json({ message: "Failed to generate component. Check server logs." });
    }
});

export default router;