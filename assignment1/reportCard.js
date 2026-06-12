const fs = require('fs');
class Student {
    constructor(studentName, examScore){
        this.name = studentName;
        this.score = examScore;
    }
    
    get average(){
        let total = 0;
        for(let i = 0; i < this.score.length; i++){
            total += this.score[i]
        }
        return total/this.score.length;
    }
    get letterGrade(){
        let mean = this.average;
        if (mean >= 90) {
            return "A";
        } else if (mean >= 80) {
            return "B";
        } else if (mean >= 70) {
            return "C";
        } else if (mean >= 60) {
            return "D";
        } else {
            return "F";
        }

    }
    
    summary(){
        let highest = this.score[0];
        let lowest = this.score[0];
        for(let i = 1; i < this.score.length; i++){
            if(this.score[i] > highest){
                highest = this.score[i];
            }
            if(this.score[i] < lowest){
                lowest = this.score[i];
            }
        }
        return{
            highest : highest,
            lowest : lowest
        };
    }
}

function getRemark(grade){
    switch(grade){
        case 'A':
            return "Great Work";
        case 'B' :
            return "Nice Work";
        case 'C':
            return "Work Hard";    
        case 'D':
            return "Don't insult our college";    
        case 'F':
            return "Fail";    
    }
}

// const testStudent = new Student("Alice", [85, 92, 78]);

// console.log("Student Name:", testStudent.name);
// console.log("Scores Array:", testStudent.score);
// console.log("Calculated Average:", testStudent.average);
// console.log("Final Grade:", testStudent.letterGrade);
// console.log("Score Summary:", testStudent.summary());


// const studentName = process.argv[2];
// const scoreStrings = process.argv.slice(3);
// if(scoreStrings.length < 3){
//     console.log("Provide at least 3 numbers");
//     process.exit(1);
// }
// const studentScore = scoreStrings.map(Number);
// const testStudent = new Student(studentName, studentScore);
// console.log("Terminal Name:", testStudent.name);
// console.log("Terminal Scores:", testStudent.score);
// const valueHighLow = testStudent.summary();
// const finalGrade = testStudent.letterGrade;
// const Remark = getRemark(finalGrade);
// const PorF = testStudent.average >= 60 ? "Pass" : "Fail";

// const [score1, score2, ...remaining] = testStudent.score;


// console.log(`
//                      YOUR REPORT CARD
//             ___________________________________
//             Name: ${testStudent.name}   
//             Score: ${testStudent.score}  
//             ------------------------------------
//             Score1: ${score1}
//             Score2: ${score2}
//             remaining: ${remaining}
//             Average: ${testStudent.average.toFixed(1)} 
//             Grade: ${finalGrade}
//             Highest: ${valueHighLow.highest} 
//             Lowest: ${valueHighLow.lowest}  
//             Remark: ${Remark}
//             Status: ${PorF}
//             ____________________________________
//             `)
const Data = fs.readFileSync('Students.json', 'utf-8');
const ListOfStudents = JSON.parse(Data);
let highestAvg = 0;
let firstRank = "";
for(let i = 0; i < ListOfStudents.length; i++){
    const student__ = ListOfStudents[i];
    const testStudent = new Student(student__.name, student__.score);

    const valueHighLow = testStudent.summary();
    const finalGrade = testStudent.letterGrade;
    const Remark = getRemark(finalGrade);
    const PorF = testStudent.average >= 60 ? "Pass" : "Fail";

    const [score1, score2, ...remaining] = testStudent.score;

    console.log(`
            ${testStudent.name} REPORT CARD
            ___________________________________
            Name: ${testStudent.name}   
            Score: ${testStudent.score}  
            ------------------------------------
            Score1: ${score1}
            Score2: ${score2}
            remaining: ${remaining}
            Average: ${testStudent.average.toFixed(1)} 
            Grade: ${finalGrade}
            Higihest: ${valueHighLow.highest} 
            Lowest: ${valueHighLow.lowest}  
            Remark: ${Remark}
            Status: ${PorF}
            ____________________________________
            `)

    if(testStudent.average > highestAvg){
        highestAvg = testStudent.average;
        firstRank = testStudent.name;
    }

}

console.log("=========================================")
console.log(`First Rank: ${firstRank} (${highestAvg.toFixed(1)})`);

