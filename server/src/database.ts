import * as db from 'sqlite3';
import { exit } from "process";

const database = new db.Database('database.sqlite', (error: Error) => {
    if(error) {
        console.error('Cannot estabilish connection with database');
        exit(1);
    }
});

async function executeQuery(database: db.Database, sql: string, args?: any[]): Promise<any> { // moze sie bugowac jesli args puste
    return new Promise((resolve, reject) => {
        database.run(sql, args, (err: Error) => {
            if(err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

async function getQuery(database: db.Database, sql: string, args?: any[]): Promise<any> { // moze sie bugowac jesli args puste
    return new Promise((resolve, reject) => {
        database.get(sql, args, (err: Error, data: any) => {
            if(err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
}


async function getAll(database: db.Database, sql: string, args?: any[]): Promise<any[]> {
    return new Promise((resolve, reject) => {
        database.all(sql, args, (err: Error, data: any[]) => {
            if(err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
}

export interface Quiz_data {
    quiz_name: string;
    quiz_json: string;
}

export interface User {
    username: string;
    password: string;
}

export interface Stats {
    quiz_name: string;
    task_number: number;
    username: string;
    time: number;
    correct: number;
}

export async function dropTables(): Promise<void> {
    const sql1 = `DROP TABLE IF EXISTS quiz_data;`;
    const sql2 = `DROP TABLE IF EXISTS user`;
    const sql3 = `DROP TABLE IF EXISTS stats`;
    return executeQuery(database, sql1).then(() => {
        executeQuery(database, sql2).then(() => {
            executeQuery(database, sql3);
        });
    });
}

export async function createTables(): Promise<void> {
    const sql1 = `
    CREATE TABLE quiz_data (
        quiz_name  TEXT NOT NULL PRIMARY KEY,
        quiz_json  TEXT NOT NULL
    );
    `;
    const sql2 = `
    CREATE TABLE user (
        username   TEXT NOT NULL PRIMARY KEY,
        password   TEXT NOT NULL
    );
    `;
    const sql3 = `
    CREATE TABLE stats (
        quiz_name   TEXT NOT NULL,
        task_number INTEGER NOT NULL PRIMARY KEY,
        username    TEXT NOT NULL,
        time        INTEGER NOT NULL,
        correct     INTEGER NOT NULL,
        FOREIGN KEY(quiz_name) REFERENCES quiz(quiz_name)
        FOREIGN KEY(username) REFERENCES user(username)
    )
    `;
    return executeQuery(database, sql1).then(() => {
        executeQuery(database, sql2).then(() => {
            executeQuery(database, sql3);
        });
    });
}

export function addQuiz(quiz_name: string, quiz_json: string): Promise<void> {
    const sql = `
        INSERT INTO quiz_data (quiz_name, quiz_json)
        VALUES (?, ?);
    `;
    return executeQuery(database, sql, [quiz_name, quiz_json]);
}

export function getQuiz(quiz_name: string): Promise<Quiz_data> {
    const sql = `
        SELECT quiz_name, quiz_json 
        FROM quiz_data
        WHERE quiz_name = ?;
    `;
    return getQuery(database, sql, [quiz_name]);
}

export function getAllQuizzes(): Promise<Quiz_data[]> {
    const sql = `
        SELECT quiz_name, quiz_json
        FROM quiz_data
    `;
    return getAll(database, sql);
}

export function addUser(username: string, password: string): Promise<void> {
    const sql =`
        INSERT INTO user (username, password)
        VALUES (?, ?);
    `;
    return executeQuery(database, sql, [username, password]);
}

export function userExists(username: string, password: string): Promise<boolean> {
    const sql = `
        SELECT username, password
        FROM user
        WHERE username = ?
    `;
    return new Promise((resolve, reject) => {
        database.get(sql, [username], (err: Error, user: User) => {
            if(err) { reject(err); return; }
            else if(!user || !user.password) {
                reject(Error('user not found'));
            }
            else if(user.password === password) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        })
    });
}

export function deleteUser(username: string): Promise<void> {
    const sql = `
        DELETE FROM user
        WHERE username = ?;
    `;
    return executeQuery(database, sql, [username]);
}

export function addStats(stats: Stats): Promise<void> {
    const sql = `
        INSERT INTO stats (quiz_name, task_number, username, time, correct)
        VALUES (?, ?, ?, ?, ?);
    `;
    return executeQuery(database, sql, 
        [stats.quiz_name, stats.task_number, stats.username, stats.time, stats.correct]
    );
}

