"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const csurf_1 = __importDefault(require("csurf"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const connect = require('connect-sqlite3');
const sqliteSession = connect(express_session_1.default);
const csrfProtection = csurf_1.default({ cookie: true });
const app = express_1.default();
const secret = "asdf";
app.use(express_1.default.static('../public'));
const server = app.listen(1500, () => {
    console.log(`App is running at http://localhost:1500/ in ${app.get('env')} mode`);
    console.log('Press Ctrl+C to stop.');
});
//# sourceMappingURL=app.js.map