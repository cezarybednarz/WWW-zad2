import 'mocha';
import { expect } from 'chai';
import { driver } from 'mocha-webdriver';
import { app } from './src/app';
import { exec } from 'shelljs'
import chai from 'chai';
import chaiHttp from 'chai-http';
import {Storage} from './src/storage'

chai.use(chaiHttp);

async function waitSeconds(s: number): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, s * 1000);
    });
}

const TIMEOUT = 60000;
const PORT = 1500;
const PATH = `http://localhost:${PORT}`;

exec('ts-node create_db_test.ts');
const server = app.listen(PORT);
/*
describe('test server for logging, sessions and changing password', () => {
    it('redirect to home page after login', async () => {
        await removeSession();
        await driver.get(PATH);
        await doLogin('user1', 'user1');
        const buttonClasses = await (await driver.find('#login-button')).getText();
        expect(buttonClasses).to.include('Wyloguj');
    });
    it('do not redirect to home page after invalid password', async () => {
        await removeSession();
        await driver.get(PATH);
        await doLogin('user1', 'bad_password');
        const buttonClasses = await (await driver.find('#do-login-button')).getText();
        expect(buttonClasses).to.include('Login');
    });
    it('do not redirect to home page after invalid login', async () => {
        await removeSession();
        await driver.get(PATH);
        await doLogin('bad_login', 'user1');
        const buttonClasses = await (await driver.find('#do-login-button')).getText();
        expect(buttonClasses).to.include('Login');
    });    
    it('exit all sessions after changing password', async () => {
        await removeSession();
        await driver.get(PATH);
        await doLogin('user1', 'user1');

        const cookies = await driver.manage().getCookies();

        await removeSession();
        await driver.get(PATH);
        await doLogin('user1', 'user1');
        await changePassword('user1');

        await removeSession();
        await driver.sleep(1500);

        cookies.forEach(async cookie => {
            await chai.request(PATH)
            .get('/')
            .set(cookie.name, cookie.value);
        });
        await driver.get(PATH);
        await driver.sleep(1500);
        const buttonClasses = await (await driver.find('#login-button')).getText();
        expect(buttonClasses).to.include('Login');
    });
});
*/
describe('test if you can solve one quiz multiple times', () => {
    it('redirect to home page after login', async () => {
        await removeSession();
        await driver.get(PATH);
        await doLogin('user1', 'user1');
        await solveTestQuiz('2', '2', 1, 1);
        const buttonClasses = await (await driver.find('#start-quiz-button')).getText();
        expect(buttonClasses).to.include('Zobacz wyniki');
    });
});



describe('clean database after testing', () => {
    it('drop tables', async () => {
        const storage = new Storage();
        storage.dropTables();
    });
});


async function removeSession(): Promise<void> {
    return driver.manage().deleteCookie('connect.sid');
}

async function doLogin(username: string, password: string): Promise<void> {
    await driver.sleep(1500);
    await driver.find("#login-button").doClick();
    await driver.sleep(500);
    await driver.find('#username').sendKeys(username);
    await driver.find('#password').sendKeys(password);
    await (await driver.find("#do-login-button")).doClick();
    await driver.sleep(500);
}

async function solveTestQuiz(first: string, second: string, firstTime: number, secondTime: number): Promise<void> {
    await (await driver.find('#start-quiz-button')).doClick();
    await driver.sleep(firstTime * 1000);
    await driver.find("#answer-box").sendKeys(first);
    await driver.find("#button-next").doClick();
    await driver.sleep(secondTime * 1000);
    await driver.find("#answer-box").sendKeys(second);
    await driver.find("#button-finish").doClick();
    await driver.get(PATH);
    await driver.sleep(500);
}

async function changePassword(newPassword: string): Promise<void> {
    await driver.sleep(1500);
    await driver.find("#change-password-button").doClick();
    await driver.sleep(500);
    await driver.find('#password').sendKeys(newPassword);
    await (await driver.find("#do-change-password")).doClick();
    await driver.sleep(500);
}

const storage = new Storage();
