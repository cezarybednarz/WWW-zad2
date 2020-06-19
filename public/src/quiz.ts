import jsonString from "./quizdata.js"
import {putScoreInStorage} from "./database.js"

function getQueryVariable(variable: string) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}

// === VARIABLES THAT DEFINE CURRENT STATE OF QUIZ ===
let quizJson;
let currentQuestion = 0;
let quizId = getQueryVariable("id");
let answers: Array<string> = [];
let seconds: Array<number> = [];
let quizFinished = false; 
let totalTime = 0;
let totalPenalty = 0;
let totalCorrect = 0;
// ===================================================


function getQuizIndex(quiz: string): number {
    return quizJson.id;
}

function getPenalty(quiz: string): number {
    return parseInt(quizJson.penalty);
}

function getQuestionById(quiz: string, questionId: number) {
    document.getElementById('question').textContent = quizJson.get; // to moze sie zbugowac
    return quizJson.questions[questionId];
}

function getNumberOfQuestions(quiz : string): number {
    var index = getQuizIndex(quiz);
    return Object.keys(quizJson.questions).length;
}

function goodAnswer(answer: string): boolean {
    return /^-?\d+\d*$/.test(answer);
}

function getNumberOfGoodAnswers(quiz: string): number {
    var goodAnswers = 0;
    for(var i = 0; i < getNumberOfQuestions(quizId); i++) {
        if(goodAnswer(answers[i])) {
            goodAnswers++;
        }
    }
    return goodAnswers;
}

function onAnswerUpdate() {
    var answerBox = document.getElementById('answer-box') as HTMLTextAreaElement;
    if(answerBox.value.length === 0) {
        answerBox.setAttribute("class", "input is-primary");
        delete answers[currentQuestion];
    }
    else if(!goodAnswer(answerBox.value)) {
        answerBox.setAttribute("class", "input is-danger");
        answers[currentQuestion] = answerBox.value;
    }
    else {
        answerBox.setAttribute("class", "input is-info");
        answers[currentQuestion] = answerBox.value;
    }   

    
    document.getElementById("completed-tasks").textContent = String(getNumberOfGoodAnswers(quizId)) 
    + "/" + String(getNumberOfQuestions(quizId));
    var buttonFinish = document.getElementById("button-finish") as HTMLButtonElement;

    if(getNumberOfGoodAnswers(quizId) === getNumberOfQuestions(quizId)) {
        buttonFinish.setAttribute("class", "button is-warning");
    }
    else {
        buttonFinish.setAttribute("class", "button is-warning is-light");
    }

}

function viewQuestionById(quiz: string, questionId: number) {
    var percentDone = 100 * (questionId + 1)  / getNumberOfQuestions(quiz);
    document.getElementById('progress-bar').setAttribute("value", String(percentDone));
    document.getElementById('question').textContent = getQuestionById(quizId, currentQuestion).question;
    document.getElementById('question-name').textContent = "Pytanie " + String(questionId + 1);
    var answerBox = document.getElementById('answer-box') as HTMLTextAreaElement;
    if(typeof answers[questionId] !== 'undefined') {
        answerBox.value = answers[questionId];
    }
    else {
        answerBox.value = "";
    }
    onAnswerUpdate();
}

function viewScore(quiz: string) {
    if(!quizFinished) {
        return;
    }

    document.title = "Podsumowanie"
    document.getElementById("quiz-summary").setAttribute("class", "modal is-active");

    var resultTable = document.getElementById("result-table") as HTMLTableElement;
    for(var i = 0; i < getNumberOfQuestions(quiz); i++) {
        totalTime += seconds[i];
        let penalty = String(getPenalty(quizId));
        var correctAnswer = String(getQuestionById(quizId, i).good_answer);
        var style = "";
        if(answers[i] === correctAnswer) {
            penalty = "-";
            style = 'style="background-color:#b3ffb3"';
            totalCorrect++;
        }
        else {
            penalty += " s";
            totalPenalty += getPenalty(quizId);
            style = 'style="background-color:#ffcccc"';
        }
        resultTable.insertAdjacentHTML('beforeend', 
        `<tr ${style}>
            <td class="has-text-weight-medium">${i+1}</td>
            <td>${answers[i]}</td>
            <td>${correctAnswer}</td>
            <td>${seconds[i] + " s"}</td>
            <td>${penalty}</td>
        </tr>
        `);
    }
    document.getElementById("total-result").insertAdjacentHTML('afterbegin',  
    `<br>
    <p>
    Całkowity wynik: <b>${totalTime + totalPenalty}</b>   (<b>${totalTime}</b> czas, <b>${totalPenalty}</b> kara)
    </p>
    `);
}

function updateButtons() {
    var prevButton = document.getElementById("button-prev") as HTMLButtonElement;
    if(currentQuestion === 0) {
        prevButton.style.visibility = "hidden";
    }
    else {
        prevButton.style.visibility = "visible";
    }

    var nextButton = document.getElementById("button-next") as HTMLButtonElement;
    if(currentQuestion + 1 === getNumberOfQuestions(quizId)) {
        nextButton.style.visibility = "hidden";
    }
    else {
        nextButton.style.visibility = "visible";
    }
}

function onClickPrevious() {
    if(currentQuestion > 0) {
        currentQuestion--;
    }
    updateButtons();
    viewQuestionById(quizId, currentQuestion);
}

function onClickNext() {
    var button = document.getElementById("button-next") as HTMLButtonElement;
    if(currentQuestion + 1 < getNumberOfQuestions(quizId)) {
        currentQuestion++;
    }
    updateButtons();
    viewQuestionById(quizId, currentQuestion);
}

function onClickFinish() {
    if(getNumberOfGoodAnswers(quizId) === getNumberOfQuestions(quizId)) {
        quizFinished = true;
        viewScore(quizId);
    }
}

function onClickSaveResult() {
    if(!quizFinished) {
        return;
    }
    
    putScoreInStorage(quizId, totalTime+totalPenalty, totalTime, Date.now(), 
        totalCorrect, getNumberOfQuestions(quizId));


    window.location.href = "index.html";
}

function onClickCancelResult() {
    window.location.href = "index.html";
}

function startCountdown() {
    for(var i = 0; i < getNumberOfQuestions(quizId); i++) {
        seconds[i] = 0;
    }

    let counter = 0;
      
    const interval = setInterval(() => {
        if(quizFinished) {
            clearInterval(interval);
        }
        counter++;
        seconds[currentQuestion]++;
        document.getElementById('timer').textContent = String(counter) + " s";
    }, 1000);
}

async function main() {

    await fetch("http://localhost:1500/quiz_content/" + quizId)
    .then(response => response.json())
    .then(data => quizJson = data);

    viewQuestionById(quizId, currentQuestion);
    document.getElementById("quiz-name").textContent = quizId;
    document.getElementById("penalty-info").textContent = "kara za niepoprawną odpowiedź: " + String(getPenalty(quizId)) + " s";
    document.getElementById("answer-box").addEventListener('input', onAnswerUpdate);
    document.getElementById("button-next").addEventListener('click', onClickNext);
    document.getElementById("button-prev").addEventListener('click', onClickPrevious);
    document.getElementById("button-finish").addEventListener('click', onClickFinish);
    document.getElementById("button-save").addEventListener('click', onClickSaveResult);
    document.getElementById("button-cancel-1").addEventListener('click', onClickCancelResult);
    document.getElementById("button-cancel-2").addEventListener('click', onClickCancelResult);
    startCountdown();
}


(async() => {
    await main();
})();
