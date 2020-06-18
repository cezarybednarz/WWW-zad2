import express from 'express';
//import cookieParser from 'cookie-parser';
//import session from 'express-session'
import * as db from './database';
import {Storage} from './storage';


const app = express();
const storage = new Storage();
const secret = "asdf"

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/quiz_names', (req, res) => {
    storage.getQuizNameListString().then((quiz => {
        res.send(quiz);
    }));    
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log("username: " + username + " password: " + password);
    db.userExists(username, password).then(exists => {
        if(exists) {
            res.redirect('/');
        }
        else {
            console.log("invalid password");
            res.redirect(req.get('referer'));
        }
    }, err => res.redirect(req.get('referer')));
});

app.post('/logout', (req, res) => {
    console.log("logging out\n");
});

app.use(express.static('../public'));
app.use(express.json());


const server = app.listen(1500, () => {
    console.log(`App is running at http://localhost:1500 in ${app.get('env')} mode`);
    console.log('Press Ctrl+C to stop.');
});