
# IITK Lecture Attendance Telegram Bot 

An automated backend system designed to track student lecture attendance dynamically via Telegram. 

---

## Complete File & Directory Architecture

Every file in this directory plays an independent, decoupled role in the attendance pipeline:

* **`bot.js`**: The central application engine. 
* **`attendance.js`**: The local database manager.
* **`parser.js`**: The logic validation layer. 
* **`qr.js`**: The image processor. 
* **`.env`**: Secure environmental credentials file.
* **`attendance.json`**: The persistent storage file. 

```text
assignment2/
├── node_modules/           # Installed third-party runtime modules
├── .env                    # Environment token file (manually created)
├── attendance.js           # DB transactions & state metrics manager
├── attendance.json         # Auto-generated database storage file
├── bot.js                  # Main server entry point & command router
├── parser.js               # Range checks & validation algorithms
├── qr.js                   # Asynchronous image QR decoder 
├── package-lock.json       # Structural dependency tracking tree
└── package.json            # Manifest file declaring dependencies
```
## Steps

### 1. Clone the Repository
```bash
git clone <your-repository-url-here>
cd assignmentFULLSTACK/assignment2
```
### 2. Install dependencies
```bash
npm install npm install dotenv jimp jsqr node-telegram-bot-api@0.65.1
```
### 3. Create bot in telegram.
#### 1. Search @BotFather in telegram.
#### 2. Run /newbot
#### 3. Copy the token.

### 4. Create a .env file and add paste the token.

### 5. Start node bot.json

## Commands

| Command | Description |
|---------|-------------|
| `/start` | Display welcome message |
| `/report` | Show attendance statistics |
| `/export` | Export attendance records as CSV |
