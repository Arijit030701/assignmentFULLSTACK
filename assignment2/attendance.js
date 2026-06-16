const fs = require('fs');
const STORE_FILE = 'attendance.json';
let attendanceStore = {};

try {
    const fileData = fs.readFileSync(STORE_FILE, 'utf8');
    
    attendanceStore = JSON.parse(fileData);
    
    console.log('Database loaded successfully.');
} catch (error) {
    console.log('No existing database found. Starting fresh.');
}
function markPresent(rollNumber) {
    if (attendanceStore[rollNumber]) {
        return { 
            success: false, 
            reason: 'already_marked', 
            timestamp: attendanceStore[rollNumber] 
        };
    }
    const currentTime = new Date().toISOString();
    attendanceStore[rollNumber] = currentTime;

    fs.writeFileSync(STORE_FILE, JSON.stringify(attendanceStore, null, 2));
    return { success: true };
}

function getStats() {
    const rollNumbers = Object.keys(attendanceStore);

    return {
        total: rollNumbers.length,     
        rollNumbers: rollNumbers.sort()
    };
}
module.exports = { markPresent, getStats };

if (require.main === module) {
    console.log("\n--- Testing P3: Attendance Store ---");
    
    console.log("\n1. Marking 240175 present...");
    console.log(markPresent('240175'));

    console.log("\n2. Trying to duplicate mark 240175...");
    console.log(markPresent('240175')); 

    console.log("\n3. Marking 240005 present...");
    console.log(markPresent('240005'));

    console.log("\n4. Generating Stats Report...");
    console.log(getStats()); 
}