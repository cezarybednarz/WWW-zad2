import express from 'express';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session'
import * as db from './database';
import {Storage} from './storage';
import connect from 'connect-sqlite3';

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

app.get('/quiz_names', (req, res) => {
    storage.getQuizNameListString().then((quiz => {
        res.send(quiz);
    }));    
});

app.get('/quiz_content/:id', (req, res) => {
    const quizId = req.params.id;
    storage.getQuiz(quizId).then(quiz => 
        res.send(JSON.parse(quiz.quiz_json))
    );
});

app.post('/change_password', (req, res) => {
    const newPassword = req.body.newPassword;
    const username = req.session.username;
    console.log("user: " + username + " is changing password to: " + newPassword);
    if(username) {
        storage.changePassword(username, newPassword);
        req.session.destroy(err => {
            if(err) { console.error(err); }
        });
        res.redirect('/');
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
    console.log("username: " + username + " password: " + password);
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
            console.log("invalid password");
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

    console.log("quiz_name: " + quiz_name);
    console.log("username: " + username);
    console.log("user_answers: " + user_answers);
    console.log("user_time: " + user_time);
});


app.use(express.static('../public'));

const server = app.listen(1500, () => {
    console.log(`App is running at http://localhost:1500 in ${app.get('env')} mode`);
    console.log('Press Ctrl+C to stop.');
});