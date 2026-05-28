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

const testStudent = new Student("Alice", [85, 92, 78]);

console.log("Student Name:", testStudent.name);
console.log("Scores Array:", testStudent.score);
console.log("Calculated Average:", testStudent.average);
console.log("Final Grade:", testStudent.letterGrade);
console.log("Score Summary:", testStudent.summary());