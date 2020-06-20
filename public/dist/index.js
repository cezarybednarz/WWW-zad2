import { getTopScoresWithId } from "./database.js";
let totalTests = 0;
let totalSeconds = 0;
let totalQuestions = 0;
let totalCorrectQuestions = 0;
let quizNamesJson = [];
let username;
function getDateFromTimestamp(ts) {
    var a = new Date(ts);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    return date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
}
function viewQuizTable() {
    let quizTable = document.getElementById("question-list");
    for (var i = 0; i < quizNamesJson.length; i++) {
        var quizId = quizNamesJson[i];
        quizTable.insertAdjacentHTML('beforeend', `<tr>
            <td width="5%"><i class="fa fa-bell-o"></i></td>
            <td>${quizId}</td>
            <td class="level-right"><a class="button is-small is-success" href="quiz.html?id=${quizId}">Start</a></td>
        </tr>`);
    }
}
function viewQuizStatsById(quizId) {
    var resultTable = getTopScoresWithId(quizId);
    var statsTable = document.getElementById("stats-table");
    statsTable.insertAdjacentHTML('beforeend', `<article class="tile is-child box">
        <p class="subtitle">${quizId}</p>
        <p class="content">
            <table class="table">
                <thead id="thead-${quizId}">
                    <tr>
                        <th></th>
                        <th>Wynik</th>
                        <th>Czas</th>
                        <th>Poprawne</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody id='table-${quizId}'>
                    <!-- FILLING IN LOOP -->
                </tbody>
            </table>
        </p>
    </article>
    `);
    var currTable = document.getElementById("table-" + quizId);
    if (resultTable.length == 0) {
        currTable.insertAdjacentHTML('beforeend', 'Wypełnij test, aby wyświetlić wyniki');
    }
    else {
        for (var i = 0; i < resultTable.length; i++) {
            currTable.insertAdjacentHTML('beforeend', `<tr>
                <td><b>${i + 1}</b></td>
                <td>${resultTable[i].score}</td>
                <td>${resultTable[i].time} s</td>
                <td>${resultTable[i].correct}/${resultTable[i].total}</td>
                <td>${getDateFromTimestamp(resultTable[i].date)}</td>
            </tr>
            `);
            totalTests++;
            totalQuestions += resultTable[i].total;
            totalCorrectQuestions += resultTable[i].correct;
            totalSeconds += resultTable[i].time;
        }
    }
}
function viewQuizStats() {
    for (var i = 0; i < quizNamesJson.length; i++) {
        var quizId = quizNamesJson[i];
        viewQuizStatsById(quizId);
    }
}
function viewGlobalStats() {
    var statSolved = document.getElementById("stat-solved");
    var statCorrect = document.getElementById("stat-correct");
    var statAvg = document.getElementById("stat-avg");
    statSolved.textContent = String(totalTests);
    statCorrect.textContent = String((100 * totalCorrectQuestions / totalQuestions).toFixed(0)) + "%";
    statAvg.textContent = String((totalSeconds / totalTests).toFixed(2)) + " s";
}
function showUsername() {
    var usernameField = document.getElementById("username");
    var loginButton = document.getElementById("login-button");
    var changePasswordButton = document.getElementById("change-password-button");
    usernameField.textContent = "Witaj, " + username;
    loginButton.textContent = "Wyloguj";
    loginButton.setAttribute("href", "/logout");
}
function showNoUsername() {
    var usernameField = document.getElementById("username");
    var loginButton = document.getElementById("login-button");
    var changePasswordButton = document.getElementById("change-password-button");
    usernameField.textContent = "Zaloguj się";
    changePasswordButton.style.visibility = "hidden";
}
async function main() {
    await fetch("http://localhost:1500/quiz_names")
        .then(response => response.json())
        .then(data => quizNamesJson = data);
    await fetch("http://localhost:1500/username")
        .then(response => response.json())
        .then(data => username = data.username);
    if (username && username != "") {
        showUsername();
    }
    else {
        showNoUsername();
    }
    viewQuizTable();
    viewQuizStats();
    if (totalTests > 0) {
        viewGlobalStats();
    }
}
(async () => {
    await main();
})();
//# sourceMappingURL=index.js.map