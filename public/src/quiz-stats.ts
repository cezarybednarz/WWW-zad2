import { Stats } from "fs";

let quizJson;
let quizId = "";
let username = "";
let userStats = [];
let allStats = [];

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

function quizResult(quiz: string): number {
    var result = 0;
    var quizExists = 0;
    userStats.forEach(stat => {
        if(stat.quiz_name ===  quiz) {
            quizExists = 1;
            result += stat.time;
            if(stat.correct) {
                result += stat.correct;
            }
        }
    });
    if(quizExists) {
        return result;
    }
    else {
        return -1;
    }
}

function questionResult(quiz: string, question: number): number {
    let ret = -1;
    userStats.forEach(stat => {
        if(stat.quiz_name == quizId && stat.task_number == question) {
            ret = stat.user_result;
        }
    });
    return ret;
}


function questionTime(quiz: string, question: number): number {
    let ret = -1;
    userStats.forEach(stat => {
        if(stat.quiz_name == quizId && stat.task_number == question) {
            ret = stat.time;
        }
    });
    return ret;
}

function getNumberOfQuestions(): number {
    return Object.keys(quizJson.questions).length;
}

function setQuizTitle() {
    document.getElementById('quiz-name').textContent = quizId;
}

function setQuizPenalty() {
    document.getElementById('penalty-info').textContent = "Kara za niepoprawną odpowiedź: " + quizJson.penalty + " s";
}

function setUserResult() {
    document.getElementById('completed-tasks').textContent = String(quizResult(quizId));
}

function setTop5Table() {
    let map = [];
    allStats.forEach(stat => {
        let result = stat.time + stat.correct;
        if(map[stat.username] === undefined) {
            map[stat.username] = result;
        }
        else {
            map[stat.username] += result;
        }
    });
    let arr = [];
    for(let key in map) {
        let value = map[key];
        arr.push({key, value});
    }
    var top5 = arr.sort((n1, n2) => n1.value-n2.value).slice(0, 5);
    let topTable = document.getElementById('top-table');
    let iter = 1;
    top5.forEach(score => {
        topTable.insertAdjacentHTML('beforeend', `
            <tr>
                <td><small>${iter++ + ")"}</small></td>
                <td><b>${score.value}</b></td>
                <td>${score.key}</td>
            </tr>
        `);
    });
}   

function getAvgTimeOnQuestion(question: number): number {
    let number = 0;
    let sum = 0;
    allStats.forEach(stat => {
        if(stat.task_number === question) {
            number++;
            sum += stat.time;
        }
    });
    if(number != 0) {
        return sum/number;
    }
    else {
        return 0;
    }
}

function setQuestionList() {
    let fullList = "";
    for(let i = 0; i < getNumberOfQuestions(); i++) {
        let ifCorrect = "";
        if(quizJson.questions[i].good_answer !== questionResult(quizId, i)) {
            ifCorrect = "zła odpowiedź!"
        }
        fullList += `
        <header class="card-header is-primary">
        <p class="card-header-title" id="question-name" class="is-warning">
            Pytanie ${i + 1} &nbsp <small><small><i>${ifCorrect}</i></small></small>
        </p>
        </header>
        <div class="card-content is-danger" id="question">
            <p>${quizJson.questions[i].question}</p>
            <p>Poprawna odpowiedź: ${quizJson.questions[i].good_answer}</p>
            <p>Twoja odpowiedź: ${questionResult(quizId, i)}</p>
            <p>Twój czas: ${questionTime(quizId, i)} s</p>
            <p>Średni czas odpowiedzi użytkowników: ${getAvgTimeOnQuestion(i)} s</p>
        </div>
        `;
    }
    document.getElementById('question-list').insertAdjacentHTML('beforeend', fullList);
}

async function main() {

    quizId = getQueryVariable("id");

    await fetch("http://localhost:1500/quiz_content/" + quizId)
    .then(response => response.json())
    .then(data => quizJson = data);

    await fetch("http://localhost:1500/username")
    .then(response => response.json())
    .then(data => username = data.username);

    await fetch("http://localhost:1500/quiz_quiz_stats/" + quizId)
    .then(response => response.json())
    .then(data => allStats = data);

    if(username && username != "") {
        await fetch("http://localhost:1500/user_stats")
        .then(response => response.json())
        .then(data => userStats = data);

        setQuizTitle();
        setQuizPenalty();
        setUserResult();
        setTop5Table();
        setQuestionList();
    }
    else {
        console.log("error, session expired");
    }

    document.body.style.visibility = "visible";
}


(async() => {
    await main();
})();
