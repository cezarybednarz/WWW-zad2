"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
const db = __importStar(require("./database"));
class Storage {
    dropTables() {
        return db.dropTables();
    }
    createTables() {
        return db.createTables();
    }
    addQuiz(quiz_name, quiz_json) {
        return db.addQuiz(quiz_name, quiz_json);
    }
    getQuizNameListArray() {
        return db.getAllQuizzes().then((quizzes) => quizzes.map(quiz => quiz.quiz_name));
    }
    getQuizNameListString() {
        return db.getAllQuizzes().then((quizzes) => quizzes.map(quiz => quiz.quiz_name)).then((quizzes) => JSON.stringify(quizzes));
    }
    getQuiz(quiz_name) {
        return db.getQuiz(quiz_name);
    }
    addUser(username, password) {
        return db.addUser(username, password);
    }
    userExists(username, password) {
        return db.userExists(username, password);
    }
    changePassword(username, newPassword) {
        return db.deleteUser(username).then(() => db.addUser(username, newPassword));
    }
    addQuizAnswers(quiz_name, username, user_answers, user_time, penalty) {
        this.getQuiz(quiz_name).then(quiz_data => {
            const quiz = JSON.parse(quiz_data.quiz_json);
            for (var i = 0; i < user_answers.length; i++) {
                var stats = {
                    quiz_name: quiz_name,
                    task_number: i,
                    username: username,
                    time: user_time[i],
                    correct: 0,
                    user_result: Number(user_answers[i])
                };
                if (user_answers[i] == quiz.questions[i].good_answer) {
                    stats.correct = penalty;
                }
                db.addStats(stats);
            }
        });
    }
    getQuizzesStatsByUser(username) {
        return db.getStatsByUser(username);
    }
    getQuizStatsByUser(username, quiz_name) {
        return db.getQuizStatsByUser(username, quiz_name);
    }
}
exports.Storage = Storage;
//# sourceMappingURL=storage.js.map