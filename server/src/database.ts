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


export async function dropTables(): Promise<void> {
    const sql1 = `DROP TABLE IF EXISTS quiz_data;`;
    return executeQuery(database, sql1);
}

export async function createTables(): Promise<void> {
    const sql1 = `
    CREATE TABLE quiz_data (
        quiz_name  TEXT NOT NULL PRIMARY KEY,
        quiz_json  TEXT NOT NULL
    );
    `;
    return executeQuery(database, sql1);
}

export function addQuiz(quiz_name: string, quiz_json: string) {
    const sql = `
        INSERT INTO quiz_data (quiz_name, quiz_json)
        VALUES (?, ?);
    `;
    return executeQuery(database, sql, [quiz_name, quiz_json]);
}

export function getQuizJson(quiz_name: string): Promise<string> { // moze ten promise zly
    const sql = `
        SELECT quiz_json 
        FROM quiz_data
        WHERE quiz_name = ?;
    `;
    return getQuery(database, sql, [quiz_name]);
}

export function getAllQuizNames() {
    const sql = `
        SELECT quiz_name
        FROM quiz_data
    `;
    return getAll(database, sql);

}