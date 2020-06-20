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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addStats = exports.deleteUser = exports.userExists = exports.addUser = exports.getAllQuizzes = exports.getQuiz = exports.addQuiz = exports.createTables = exports.dropTables = void 0;
const db = __importStar(require("sqlite3"));
const process_1 = require("process");
const database = new db.Database('database.sqlite', (error) => {
    if (error) {
        console.error('Cannot estabilish connection with database');
        process_1.exit(1);
    }
});
function executeQuery(database, sql, args) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            database.run(sql, args, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    });
}
function getQuery(database, sql, args) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            database.get(sql, args, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data);
            });
        });
    });
}
function getAll(database, sql, args) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            database.all(sql, args, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data);
            });
        });
    });
}
function dropTables() {
    return __awaiter(this, void 0, void 0, function* () {
        const sql1 = `DROP TABLE IF EXISTS quiz_data;`;
        const sql2 = `DROP TABLE IF EXISTS user`;
        const sql3 = `DROP TABLE IF EXISTS stats`;
        return executeQuery(database, sql1).then(() => {
            executeQuery(database, sql2).then(() => {
                executeQuery(database, sql3);
            });
        });
    });
}
exports.dropTables = dropTables;
function createTables() {
    return __awaiter(this, void 0, void 0, function* () {
        const sql1 = `
    CREATE TABLE quiz_data (
        quiz_name  TEXT NOT NULL PRIMARY KEY,
        quiz_json  TEXT NOT NULL
    );
    `;
        const sql2 = `
    CREATE TABLE user (
        username   TEXT NOT NULL PRIMARY KEY,
        password   TEXT NOT NULL
    );
    `;
        const sql3 = `
    CREATE TABLE stats (
        quiz_name   TEXT NOT NULL,
        task_number INTEGER NOT NULL PRIMARY KEY,
        username    TEXT NOT NULL,
        time        INTEGER NOT NULL,
        correct     INTEGER NOT NULL,
        FOREIGN KEY(quiz_name) REFERENCES quiz(quiz_name)
        FOREIGN KEY(username) REFERENCES user(username)
    )
    `;
        return executeQuery(database, sql1).then(() => {
            executeQuery(database, sql2).then(() => {
                executeQuery(database, sql3);
            });
        });
    });
}
exports.createTables = createTables;
function addQuiz(quiz_name, quiz_json) {
    const sql = `
        INSERT INTO quiz_data (quiz_name, quiz_json)
        VALUES (?, ?);
    `;
    return executeQuery(database, sql, [quiz_name, quiz_json]);
}
exports.addQuiz = addQuiz;
function getQuiz(quiz_name) {
    const sql = `
        SELECT quiz_name, quiz_json 
        FROM quiz_data
        WHERE quiz_name = ?;
    `;
    return getQuery(database, sql, [quiz_name]);
}
exports.getQuiz = getQuiz;
function getAllQuizzes() {
    const sql = `
        SELECT quiz_name, quiz_json
        FROM quiz_data
    `;
    return getAll(database, sql);
}
exports.getAllQuizzes = getAllQuizzes;
function addUser(username, password) {
    const sql = `
        INSERT INTO user (username, password)
        VALUES (?, ?);
    `;
    return executeQuery(database, sql, [username, password]);
}
exports.addUser = addUser;
function userExists(username, password) {
    const sql = `
        SELECT username, password
        FROM user
        WHERE username = ?
    `;
    return new Promise((resolve, reject) => {
        database.get(sql, [username], (err, user) => {
            if (err) {
                reject(err);
                return;
            }
            else if (!user || !user.password) {
                reject(Error('user not found'));
            }
            else if (user.password === password) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        });
    });
}
exports.userExists = userExists;
function deleteUser(username) {
    const sql = `
        DELETE FROM user
        WHERE username = ?;
    `;
    return executeQuery(database, sql, [username]);
}
exports.deleteUser = deleteUser;
function addStats(stats) {
    const sql = `
        INSERT INTO stats (quiz_name, task_number, username, time, correct)
        VALUES (?, ?, ?, ?, ?);
    `;
    return executeQuery(database, sql, [stats.quiz_name, stats.task_number, stats.username, stats.time, stats.correct]);
}
exports.addStats = addStats;
//# sourceMappingURL=database.js.map