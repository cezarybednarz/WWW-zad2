"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const mocha_webdriver_1 = require("mocha-webdriver");
const app_1 = require("./src/app");
const shelljs_1 = require("shelljs");
const chai_2 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const storage_1 = require("./src/storage");
chai_2.default.use(chai_http_1.default);
function waitSeconds(s) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, s * 1000);
        });
    });
}
const TIMEOUT = 60000;
const PORT = 1500;
const PATH = `http://localhost:${PORT}`;
shelljs_1.exec('ts-node create_db_test.ts');
const server = app_1.app.listen(PORT);
describe('test server for logging, sessions and changing password', () => {
    it('redirect to home page after login', () => __awaiter(void 0, void 0, void 0, function* () {
        yield removeSession();
        yield mocha_webdriver_1.driver.get(PATH);
        yield doLogin('user1', 'user1');
        const buttonClasses = yield (yield mocha_webdriver_1.driver.find('#login-button')).getText();
        chai_1.expect(buttonClasses).to.include('Wyloguj');
    }));
    it('do not redirect to home page after invalid password', () => __awaiter(void 0, void 0, void 0, function* () {
        yield removeSession();
        yield mocha_webdriver_1.driver.get(PATH);
        yield doLogin('user1', 'bad_password');
        const buttonClasses = yield (yield mocha_webdriver_1.driver.find('#do-login-button')).getText();
        chai_1.expect(buttonClasses).to.include('Login');
    }));
    it('do not redirect to home page after invalid login', () => __awaiter(void 0, void 0, void 0, function* () {
        yield removeSession();
        yield mocha_webdriver_1.driver.get(PATH);
        yield doLogin('bad_login', 'user1');
        const buttonClasses = yield (yield mocha_webdriver_1.driver.find('#do-login-button')).getText();
        chai_1.expect(buttonClasses).to.include('Login');
    }));
    it('exit all sessions after changing password', () => __awaiter(void 0, void 0, void 0, function* () {
        yield removeSession();
        yield mocha_webdriver_1.driver.get(PATH);
        yield doLogin('user1', 'user1');
        const cookies = yield mocha_webdriver_1.driver.manage().getCookies();
        yield removeSession();
        yield mocha_webdriver_1.driver.get(PATH);
        yield doLogin('user1', 'user1');
        yield changePassword('user1');
        yield removeSession();
        yield mocha_webdriver_1.driver.sleep(1500);
        cookies.forEach((cookie) => __awaiter(void 0, void 0, void 0, function* () {
            yield chai_2.default.request(PATH)
                .get('/')
                .set(cookie.name, cookie.value);
        }));
        yield mocha_webdriver_1.driver.get(PATH);
        yield mocha_webdriver_1.driver.sleep(1500);
        const buttonClasses = yield (yield mocha_webdriver_1.driver.find('#login-button')).getText();
        chai_1.expect(buttonClasses).to.include('Login');
    }));
});
describe('test if you can solve one quiz multiple times', () => {
    it('cant access the same quiz second time', () => __awaiter(void 0, void 0, void 0, function* () {
        yield removeSession();
        yield mocha_webdriver_1.driver.get(PATH);
        yield doLogin('user1', 'user1');
        yield solveTestQuiz('2', '2', 1, 1);
        yield mocha_webdriver_1.driver.get(PATH);
        yield mocha_webdriver_1.driver.sleep(500);
        const buttonClasses = yield (yield mocha_webdriver_1.driver.find('#start-quiz-button')).getText();
        chai_1.expect(buttonClasses).to.include('Zobacz wyniki');
    }));
});
describe('test if percentages of time spent on questions are correct', () => {
    it('should spend 3 seconds on first question and 6 on second', () => __awaiter(void 0, void 0, void 0, function* () {
        yield removeSession();
        yield mocha_webdriver_1.driver.get(PATH);
        yield doLogin('user2', 'user2');
        let realFirstTime = 3;
        let realSecondTime = 6;
        yield solveTestQuiz('2', '2', realFirstTime, realSecondTime);
        yield mocha_webdriver_1.driver.sleep(200);
        let firstTime = yield (yield mocha_webdriver_1.driver.find('#time-1')).getText();
        let secondTime = yield (yield mocha_webdriver_1.driver.find('#time-2')).getText();
        firstTime = firstTime.slice(0, firstTime.length - 2);
        secondTime = secondTime.slice(0, secondTime.length - 2);
        chai_1.expect(Number(firstTime)).to.be.lessThan(realFirstTime + 2)
            .to.be.greaterThan(realFirstTime - 2);
        chai_1.expect(Number(secondTime)).to.be.lessThan(realSecondTime + 2)
            .to.be.greaterThan(realSecondTime - 2);
    }));
});
describe('clean database after testing', () => {
    it('drop tables', () => __awaiter(void 0, void 0, void 0, function* () {
        const storage = new storage_1.Storage();
        storage.dropTables();
    }));
});
function removeSession() {
    return __awaiter(this, void 0, void 0, function* () {
        return mocha_webdriver_1.driver.manage().deleteCookie('connect.sid');
    });
}
function doLogin(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        yield mocha_webdriver_1.driver.sleep(1500);
        yield mocha_webdriver_1.driver.find("#login-button").doClick();
        yield mocha_webdriver_1.driver.sleep(500);
        yield mocha_webdriver_1.driver.find('#username').sendKeys(username);
        yield mocha_webdriver_1.driver.find('#password').sendKeys(password);
        yield (yield mocha_webdriver_1.driver.find("#do-login-button")).doClick();
        yield mocha_webdriver_1.driver.sleep(500);
    });
}
function solveTestQuiz(first, second, firstTime, secondTime) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (yield mocha_webdriver_1.driver.find('#start-quiz-button')).doClick();
        yield mocha_webdriver_1.driver.sleep(firstTime * 1000);
        yield mocha_webdriver_1.driver.find("#answer-box").sendKeys(first);
        yield mocha_webdriver_1.driver.find("#button-next").doClick();
        yield mocha_webdriver_1.driver.sleep(secondTime * 1000);
        yield mocha_webdriver_1.driver.find("#answer-box").sendKeys(second);
        yield mocha_webdriver_1.driver.find("#button-finish").doClick();
    });
}
function changePassword(newPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        yield mocha_webdriver_1.driver.sleep(1500);
        yield mocha_webdriver_1.driver.find("#change-password-button").doClick();
        yield mocha_webdriver_1.driver.sleep(500);
        yield mocha_webdriver_1.driver.find('#password').sendKeys(newPassword);
        yield (yield mocha_webdriver_1.driver.find("#do-change-password")).doClick();
        yield mocha_webdriver_1.driver.sleep(500);
    });
}
const storage = new storage_1.Storage();
//# sourceMappingURL=test.js.map