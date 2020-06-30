import * as db from './src/database';
import {Storage} from './src/storage'

const quizJson =
[ 
    {
        "id": "test",
        "penalty": "10",
        "questions": [
            {
                "question": "1+1=",
                "good_answer": 2
            },
            {
                "question": "1+1=",
                "good_answer": 2
            }
        ]    
    }
];


async function main() {
    console.log("Creating new TEST database");

    const storage = new Storage();

    await storage.dropTables().then(() => {
        console.log("Dropping tables");
    });
    await storage.createTables().then(() => {
        console.log("Creating new tables");
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    await quizJson.forEach(async (quiz) => {
        console.log("adding quiz: '" + quiz.id + "'");
        await storage.addQuiz(quiz.id, JSON.stringify(quiz));
    });

    await storage.addUser('user1', 'user1').then(() => {
        console.log("user1/user1 added");
    });
    await storage.addUser('user2', 'user2').then(() => {
        console.log("user2/user2 added");
    });
}

(async() => {
    await main();
})();