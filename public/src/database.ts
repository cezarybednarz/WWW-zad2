


export function putScoreInStorage(quizId: string, score: number, time: number, date: number,
    correct: number, total: number) {
    var currentTable = JSON.parse(localStorage.getItem(quizId));
    if(currentTable == null) {
        currentTable = [];
    }
    currentTable.push({score: score, time: time, date: date, correct: correct, total: total});
    localStorage.setItem(quizId, JSON.stringify(currentTable));
}

export function getTopScoresWithId(quizId: string) {
    var currentTable = JSON.parse(localStorage.getItem(quizId));
    if(currentTable == null) {
        return [];
    }
    currentTable.sort((n1, n2) => n1.score - n2.score);
    return currentTable;
}