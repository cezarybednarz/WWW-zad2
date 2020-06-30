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
const app_1 = require("./src/app");
const shelljs_1 = require("shelljs");
function waitSeconds(s) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, s * 1000);
        });
    });
}
const TIMEOUT = 60000;
const PORT = 1500;
const PATH = `http://127.0.0.1:${PORT}`;
shelljs_1.exec('npm run createdb');
const server = app_1.app.listen(PORT);
describe('test server for logging, sessions and changing password', () => {
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
            console.log(cookie.name, cookie.value);
            yield mocha_webdriver_1.driver.manage().addCookie(cookie.name, cookie.value);
        }));
        yield mocha_webdriver_1.driver.sleep(1500);
        yield mocha_webdriver_1.driver.get(PATH);
        yield mocha_webdriver_1.driver.sleep(1500);
        const buttonClasses = yield (yield mocha_webdriver_1.driver.find('#login-button')).getText();
        yield mocha_webdriver_1.driver.sleep(1500);
        chai_1.expect(buttonClasses).to.include('Login');
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
//# sourceMappingURL=test.js.map