import * as db from './database';
import { Quiz_data } from './database';
import { resolve } from 'path';

export class Storage {
    dropTables(): Promise<void> {
        return db.dropTables();
    }

    createTables(): Promise<void> {
        return db.createTables();
    }

    addQuiz(quiz_name: string, quiz_json: string): Promise<void> {
        return db.addQuiz(quiz_name, quiz_json);
    }

    /* tablica stringów */
    getQuizNameListArray(): Promise<string[]> { 
        return db.getAllQuizzes().then((quizzes: Quiz_data[]) => 
            quizzes.map(quiz => quiz.quiz_name)
        );
    }

    /* string z tablicą */
    getQuizNameListString(): Promise<string> { 
        return db.getAllQuizzes().then((quizzes: Quiz_data[]) => 
            quizzes.map(quiz => quiz.quiz_name)
        ).then((quizzes: string[]) =>
            JSON.stringify(quizzes)
        );
    }

    getQuiz(quiz_name: string): Promise<Quiz_data> {
        return db.getQuiz(quiz_name)
    }

    addUser(username: string, password: string): Promise<void> {
        return db.addUser(username, password);
    }

    userExists(username: string, password: string): Promise<boolean> {
        return db.userExists(username, password);   
    }

    changePassword(username: string, newPassword: string): Promise<void> {
        return db.deleteUser(username).then(() => 
            db.addUser(username, newPassword)
        );
    }
}