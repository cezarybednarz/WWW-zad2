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
    getQuizJson(quiz_name) {
        return db.getQuizJson(quiz_name);
    }
    addUser(username, password) {
        return db.addUser(username, password);
    }
    userExists(username, password) {
        return db.userExists(username, password);
    }
}
exports.Storage = Storage;
//# sourceMappingURL=storage.js.map