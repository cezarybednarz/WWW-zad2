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
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const mocha_webdriver_1 = require("mocha-webdriver");
const app_1 = require("./app");
const shell = require('shelljs');
function waitSeconds(s) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, s * 1000);
        });
    });
}
const TIMEOUT = 60000;
const PORT = 20000;
const PATH = `http://localhost:${PORT}`;
shell.exec('npm run createdb');
const server = app_1.app.listen(PORT);
describe('test server for logging', () => {
    it('should redirect to home page after logged in', () => __awaiter(void 0, void 0, void 0, function* () {
        yield removeSession();
        yield mocha_webdriver_1.driver.get(PATH);
        yield doLogin();
        const buttonClasses = yield mocha_webdriver_1.driver.find('#loginButton').getAttribute('class');
        chai_1.expect(buttonClasses).to.include('is-hidden');
    }));
    it('should show error after invalid passord inputed', () => __awaiter(void 0, void 0, void 0, function* () {
        yield removeSession();
        yield mocha_webdriver_1.driver.get(PATH);
        yield doInvalidLogin();
        const error = yield mocha_webdriver_1.driver.find('#loginPanel > div.modal-content > div > div > form > div:nth-child(3) > p').getText();
        chai_1.expect(error).to.include('Invalid password.');
    }));
    it('should log out all sessions when password has changed', () => __awaiter(void 0, void 0, void 0, function* () {
        yield removeSession();
        yield mocha_webdriver_1.driver.get(PATH);
        yield doLogin();
        const session = yield mocha_webdriver_1.driver.manage().getCookie('connect.sid');
        yield removeSession();
        yield mocha_webdriver_1.driver.get(PATH);
        yield doLogin();
        yield doChangePassword();
        yield removeSession();
        yield mocha_webdriver_1.driver.manage().addCookie({ name: 'connect.sid', value: session.value });
        yield mocha_webdriver_1.driver.get(PATH);
        const buttonClasses = yield mocha_webdriver_1.driver.find('#loginButton').getAttribute('class');
        chai_1.expect(buttonClasses).to.not.include('is-hidden');
    }));
});
describe('test server for correct quiz managemant', () => {
    it('should not open if user is not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
        yield removeSession();
        yield openQuiz();
        const err = yield mocha_webdriver_1.driver.getPageSource();
        chai_1.expect(err).to.include('User not logged in.');
    }));
    it('should start button be disabled in user is not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
        yield removeSession();
        yield mocha_webdriver_1.driver.get(PATH);
        const button = yield mocha_webdriver_1.driver.find('#startButton');
        const disabled = yield button.getAttribute('disabled');
        chai_1.expect(disabled).to.be.equal('true');
    }));
    it('should display overlay after completed quiz', () => __awaiter(void 0, void 0, void 0, function* () {
        yield removeSession();
        yield mocha_webdriver_1.driver.get(PATH);
        yield doLogin();
        yield doQuiz();
        yield waitSeconds(5);
        const overlay = yield mocha_webdriver_1.driver.find('#overlay');
        const overlayDisplay = yield overlay.getCssValue('display');
        chai_1.expect(overlayDisplay).to.include('block');
        const returnButton = yield mocha_webdriver_1.driver.find('#results > a');
        yield returnButton.doClick();
        const url = yield mocha_webdriver_1.driver.getCurrentUrl();
        chai_1.expect(url).to.not.include('play');
    }));
    it('should not open the same quiz second time', () => __awaiter(void 0, void 0, void 0, function* () {
        yield removeSession();
        yield mocha_webdriver_1.driver.get(PATH);
        yield doLogin();
        yield openQuiz();
        yield waitSeconds(5);
        const error = yield mocha_webdriver_1.driver.find('#errorPanel');
        const errorClasses = yield error.getAttribute('class');
        chai_1.expect(errorClasses).to.include('is-active');
        const errorBody = yield mocha_webdriver_1.driver.find('#error-body');
        const errorMsg = yield errorBody.getText();
        chai_1.expect(errorMsg).to.include('Quiz already solved.');
    }));
});
function removeSession() {
    return __awaiter(this, void 0, void 0, function* () {
        return mocha_webdriver_1.driver.manage().deleteCookie('connect.sid');
    });
}
function doLogin() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mocha_webdriver_1.driver.find('#loginButton').doClick();
        yield mocha_webdriver_1.driver.find('#username').sendKeys('user1');
        yield mocha_webdriver_1.driver.find('#password').sendKeys('user1');
        yield mocha_webdriver_1.driver.find('#loginPanel > div.modal-content > div > div > form > div:nth-child(4) > p > input').doClick();
    });
}
function doInvalidLogin() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mocha_webdriver_1.driver.find('#loginButton').doClick();
        yield mocha_webdriver_1.driver.find('#username').sendKeys('user1');
        yield mocha_webdriver_1.driver.find('#password').sendKeys('lol');
        yield mocha_webdriver_1.driver.find('#loginPanel > div.modal-content > div > div > form > div:nth-child(4) > p > input').doClick();
    });
}
function doChangePassword() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mocha_webdriver_1.driver.find('#changePassButton').doClick();
        yield mocha_webdriver_1.driver.find('#pass1').sendKeys('user1');
        yield mocha_webdriver_1.driver.find('#pass2').sendKeys('user1');
        yield mocha_webdriver_1.driver.find('#changePanel > div.modal-content > div > div > form > div:nth-child(4) > p > input').doClick();
    });
}
function openQuiz() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mocha_webdriver_1.driver.get(PATH + '/play/1');
    });
}
function doQuiz() {
    return __awaiter(this, void 0, void 0, function* () {
        yield openQuiz();
        yield waitSeconds(5);
        const answer = mocha_webdriver_1.driver.find('#answer');
        const button = mocha_webdriver_1.driver.find('#submitButton');
        let buttonClass = yield button.getAttribute('class');
        while (buttonClass.includes('is-success')) {
            buttonClass = yield button.getAttribute('class');
            yield answer.sendKeys('4');
            yield button.doClick();
        }
    });
}
//# sourceMappingURL=test.js.map