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
const express_1 = __importDefault(require("express"));
const db = __importStar(require("./database"));
const storage_1 = require("./storage");
const app = express_1.default();
const storage = new storage_1.Storage();
const secret = "asdf";
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
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
        if (exists) {
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
app.use(express_1.default.static('../public'));
app.use(express_1.default.json());
const server = app.listen(1500, () => {
    console.log(`App is running at http://localhost:1500 in ${app.get('env')} mode`);
    console.log('Press Ctrl+C to stop.');
});
//# sourceMappingURL=app.js.map