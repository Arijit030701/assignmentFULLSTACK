// "IITK-STUDENT-PROFILE: NAME=Arijit; DEPT=CE; ID_NO=240175;"

function isRegistered(rollNumber) {
    const num = Number(rollNumber);
    return num >= 240001 && num <= 240400;
}

function extractRollNumber(qrString) {

    const allMatches = qrString.match(/\d{6}/g);


    if (!allMatches) {
        return null;
    }

    let validRollNumber = null;

    for (let i = 0; i < allMatches.length; i++) {
        const numString = allMatches[i];
        if (isRegistered(numString)) {
            validRollNumber = numString;
            break; 
        }
    }

    return validRollNumber || null;
}

module.exports = { extractRollNumber, isRegistered };

if (require.main === module) {
    console.log("--- Testing P2c: isRegistered ---");
    console.log("240123 is valid:", isRegistered('240123')); 
    console.log("250000 is valid:", isRegistered('250000')); 

    console.log("\n--- Testing P2b: extractRollNumber ---");
    
    const trickyString = "Fake ID: 123456, Real ID: 240175, Backup ID: 240399";
    const extracted = extractRollNumber(trickyString);
    
    console.log(`Original String: "${trickyString}"`);
    console.log(`Extracted valid roll number: ${extracted}`); 
    
    const badString = "NO NUMBERS HERE";
    console.log(`\nTesting invalid string: ${extractRollNumber(badString)}`);
}