import csurf from 'csurf';
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session'

const connect = require('connect-sqlite3');
const sqliteSession = connect(session);
const csrfProtection = csurf({cookie: true});
const app = express();
const secret = "asdf"

app.use(express.static('../public'))

const server = app.listen(1500, () => {
    console.log(`App is running at http://localhost:1500/ in ${app.get('env')} mode`);
    console.log('Press Ctrl+C to stop.');
});