import csurf from 'csurf';
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session'
import { QuizData } from './quizData'


const app = express();
const connect = require('connect-sqlite3');
const sqliteSession = connect(session);
const csrfProtection = csurf({cookie: true});
const secret = "asdf";
const quizData = new QuizData();

app.use(express.static('../public'));




const server = app.listen(1500, () => {
    console.log(`App is running at http://localhost:1500/ in ${app.get('env')} mode`);
    console.log('Press Ctrl+C to stop.');
});