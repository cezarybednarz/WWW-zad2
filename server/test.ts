import 'mocha';
import { expect } from 'chai';
import { driver } from 'mocha-webdriver';
import { app } from './src/app';

// tslint:disable-next-line: no-var-requires
const shell = require('shelljs');

async function waitSeconds(s: number): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, s * 1000);
    });
}

const TIMEOUT = 60000;
const PORT = 1500;
const PATH = `http://localhost:${PORT}`;

shell.exec('npm run createdb');
const server = app.listen(PORT);

describe('test server for logging', () => {
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
