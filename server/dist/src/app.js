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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const csurf_1 = __importDefault(require("csurf"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
const db = __importStar(require("./database"));
const storage_1 = require("./storage");
const connect_sqlite3_1 = __importDefault(require("connect-sqlite3"));
const process_1 = require("process");
const sqlite3 = __importStar(require("sqlite3"));
const sqliteSession = connect_sqlite3_1.default(express_session_1.default);
const csrfProtection = csurf_1.default({ cookie: true });
const app = express_1.default();
exports.app = app;
const storage = new storage_1.Storage();
const secret = "asdf";
const router = express_1.default.Router();
app.use(cookie_parser_1.default());
app.set('view engine', 'pug');
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(express_session_1.default({
    secret,
    cookie: { maxAge: 15 * 60000 },
    resave: false,
    saveUninitialized: true,
    store: new sqliteSession()
}));
app.get('/user_stats', (req, res) => {
    if (req.session.username) {
        storage.getQuizzesStatsByUser(req.session.username).then(stats => res.send(stats));
    }
    else {
        res.send("{}");
    }
});
app.get('/user_quiz_stats/:id', (req, res) => {
    if (req.session.username) {
        storage.getQuizStatsByUser(req.session.username, req.params.id).then(stats => res.send(stats));
    }
    else {
        res.send("");
    }
});
app.get('/quiz_quiz_stats/:id', (req, res) => {
    if (req.session.username) {
        storage.getQuizStatsByQuiz(req.params.id).then(stats => res.send(stats));
    }
    else {
        res.send("");
    }
});
app.get('/quiz_names', (req, res) => {
    storage.getQuizNameListString().then((quiz => {
        res.send(quiz);
    }));
});
app.get('/quiz_content/:id', (req, res) => {
    if (req.session.username) {
        const quizId = req.params.id;
        storage.getQuiz(quizId).then(quiz => res.send(JSON.parse(quiz.quiz_json)));
    }
});
function deleteAllSessions(user) {
    const database = new sqlite3.Database('sessions', (error) => {
        if (error) {
            console.error('Cannot estabilish connection with database');
            process_1.exit(1);
        }
    });
    const sql = `DELETE FROM sessions WHERE sess LIKE '%"username":"${user}"%';`;
    database.run(sql, (err) => {
        if (err) {
            console.log(err);
            return;
        }
    });
}
app.post('/change_password', (req, res) => {
    const newPassword = req.body.newPassword;
    const username = req.session.username;
    if (username) {
        storage.changePassword(username, newPassword);
        deleteAllSessions(req.session.username);
        setTimeout(() => {
            res.redirect('/');
        }, 100);
    }
});
app.get('/username', (req, res) => {
    if (req.session.username) {
        let reqJson = '{"username": "' + req.session.username + '"}';
        res.send(JSON.parse(reqJson));
    }
    else {
        res.send('{"username": ""}');
    }
});
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    db.userExists(username, password).then(exists => {
        if (exists) {
            req.session.regenerate(err => {
                if (err) {
                    return;
                }
                req.session.username = username;
                res.redirect('/');
            });
        }
        else {
            res.redirect(req.get('referer'));
        }
    }, err => res.redirect(req.get('referer')));
});
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
        }
        res.redirect('/');
    });
});
app.post('/quiz_finished', (req, res) => {
    const quiz_name = req.body.quiz_name;
    const username = req.body.username;
    const user_answers = req.body.user_answers;
    const user_time = req.body.user_time;
    const penalty = req.body.penalty;
    storage.addQuizAnswers(quiz_name, username, user_answers, user_time, penalty);
});
app.use(express_1.default.static('../public'));
//# sourceMappingURL=app.js.map