import express from 'express';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session'
import * as db from './database';
import {Storage} from './storage';
import connect from 'connect-sqlite3';
import { exit } from "process";
import * as sqlite3 from 'sqlite3';

const sqliteSession = connect(session);
const csrfProtection = csurf({cookie: true});
const app = express();
const storage = new Storage();
const secret = "asdf";
const router = express.Router();

app.use(cookieParser());
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(session({
    secret,
    cookie: {maxAge: 15 * 60000},
    resave: false,
    saveUninitialized: true,
    store: new sqliteSession()
}));

app.get('/user_stats', (req, res) => {
    if(req.session.username) {
        storage.getQuizzesStatsByUser(req.session.username).then(stats => 
            res.send(stats)
        );
    }
    else {
        res.send("{}");
    }
});

app.get('/user_quiz_stats/:id', (req, res) => {
    if(req.session.username) {
        storage.getQuizStatsByUser(req.session.username, req.params.id).then(stats => 
            res.send(stats)
        );
    }
    else {
        res.send("");
    }
});

app.get('/quiz_quiz_stats/:id', (req, res) => {
    if(req.session.username) {
        storage.getQuizStatsByQuiz(req.params.id).then(stats => 
            res.send(stats)
        );
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
    if(req.session.username) {
        const quizId = req.params.id;
        storage.getQuiz(quizId).then(quiz => 
            res.send(JSON.parse(quiz.quiz_json))
        );
    }
});

function deleteAllSessions(user: string) {
    const database = new sqlite3.Database('sessions', (error: Error) => {
        if(error) {
            console.error('Cannot estabilish connection with database');
            exit(1);
        }
    });
    const sql = `DELETE FROM sessions WHERE sess LIKE '%"username":"${user}"%';`;
    database.run(sql, (err: Error) => {
        if(err) {
            console.log(err);
            return;
        }
    });
}

app.post('/change_password', (req, res) => {
    const newPassword = req.body.newPassword;
    const username = req.session.username;
    if(username) {
        storage.changePassword(username, newPassword);
        deleteAllSessions(req.session.username);
        setTimeout(() => {
            res.redirect('/');
        }, 
        100);
    }
});

app.get('/username', (req, res) => {
    if(req.session.username) {
        let reqJson = '{"username": "'+ req.session.username + '"}';
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
        if(exists) {
            req.session.regenerate(err => {
                if(err) {
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
        if(err) { console.error(err); }
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


app.use(express.static('../public'));

export { app };