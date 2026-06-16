require('dotenv').config();
const fs = require('fs');
const { decodeQR } = require('./qr');
const { extractRollNumber } = require('./parser');
const { markPresent, getStats } = require('./attendance');
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN;
if (!token) {
    console.error('Error: BOT_TOKEN is missing in your .env file!');
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

console.log('Telegram Bot system online and polling for data...');

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || 'Student';

    const welcomeMessage = `Hello ${firstName}! Welcome to the IITK Lecture Attendance Bot. \n\n` +
                           `Please send a photo of your student ID card QR code to log your attendance for today's session.`;

    bot.sendMessage(chatId, welcomeMessage);
});

bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    let localFilePath = null;

    try {
        const photoArray = msg.photo;
        const highestResPhoto = photoArray[photoArray.length - 1];
        
        bot.sendMessage(chatId, "Processing your ID card image, please wait...");

        localFilePath = await bot.downloadFile(highestResPhoto.file_id, __dirname);

        const qrString = await decodeQR(localFilePath);
        
        if (!qrString) {
            throw new Error('no_qr');
        }

        const allSixDigits = qrString.match(/\d{6}/g);
        if (!allSixDigits) {
            throw new Error('no_roll_number');
        }

        const validRollNumber = extractRollNumber(qrString);
        if (!validRollNumber) {
            throw new Error('out_of_range');
        }

        const dbResult = markPresent(validRollNumber);

        if (!dbResult.success && dbResult.reason === 'already_marked') {
            const duplicateError = new Error('already_marked');
            duplicateError.timestamp = dbResult.timestamp; 
            throw duplicateError;
        }

        const successMsg = `Attendance Marked Successfully!\n\n` +
                           `Roll Number: ${validRollNumber}\n` +
                           `Time: ${new Date().toLocaleTimeString()}`;
        bot.sendMessage(chatId, successMsg);

    } catch (error) {
        switch (error.message) {
            case 'no_qr':
                bot.sendMessage(chatId, "No QR code in this image.");
                break;
                
            case 'no_roll_number':
                bot.sendMessage(chatId, "QR code doesn't contain a roll number.");
                break;
                
            case 'out_of_range':
                bot.sendMessage(chatId, "Your roll number is outside the range.");
                break;
                
            case 'already_marked':
                const cleanTime = new Date(error.timestamp).toLocaleTimeString();
                bot.sendMessage(chatId, `Warning: Your attendance has already been logged!\n\n Original Log Time: ${cleanTime}`);
                break;
                
            default:
                console.error("System Error:", error);
                bot.sendMessage(chatId, "An unexpected processing error occurred on the server.");
        } 
    }finally {
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
    }
});

bot.onText(/\/report/, (msg) => {
    const chatId = msg.chat.id;
    const stats = getStats();

    const listString = stats.rollNumbers.length > 0 ? stats.rollNumbers.join('\n• ') : 'None';

    const reportMessage = `*IITK Lecture Attendance Summary Report*\n` +
                          `----------------------------------------\n` +
                          `Total Students Present: ${stats.total}\n\n` +
                          `Registered Roll Numbers:\n• ${listString}\n` +
                          `----------------------------------------\n` +
                          `Report generated at: ${new Date().toLocaleTimeString()}`;

    bot.sendMessage(chatId, reportMessage, { parse_mode: 'Markdown' });
});

bot.onText(/\/export/, async (msg) => {
    const chatId = msg.chat.id;
    const filePath = './attendance_export.csv';

    try {
        if (!fs.existsSync('./attendance.json')) {
            return bot.sendMessage(chatId, "No attendance records found to export yet!");
        }

        const rawData = fs.readFileSync('./attendance.json', 'utf8');
        const db = JSON.parse(rawData);

        if (Object.keys(db).length === 0) {
            return bot.sendMessage(chatId, "The attendance database is currently empty.");
        }

        const csvHeader = 'RollNumber,Timestamp\n';

        const csvRows = Object.entries(db)
            .map(([rollNumber, timestamp]) => `${rollNumber},${timestamp}`)
            .join('\n');

        const fullCsvContent = csvHeader + csvRows;

        fs.writeFileSync(filePath, fullCsvContent);

        bot.sendMessage(chatId, "Generating your CSV spreadsheet");

        await bot.sendDocument(chatId, filePath, {}, {
            filename: 'IITK_Attendance_Report.csv',
            contentType: 'text/csv'
        });

    } catch (error) {
        console.error("Export Error:", error);
        bot.sendMessage(chatId, "A critical system error occurred while generating the CSV file.");
    } finally {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
});