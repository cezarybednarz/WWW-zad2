export default `{
    "quiz": [ 
        {
            "id": "easy",
            "penalty": "4",
            "questions": [
                {
                    "question": "2+2=",
                    "good_answer": 4
                },
                {
                    "question": "3+4=",
                    "good_answer": 7
                },
                {
                    "question": "100+10=",
                    "good_answer": 110
                },
                {
                    "question": "2+0=",
                    "good_answer": 2
                }
            ]    
        },
        {
            "id": "hard",
            "penalty": "8",
            "questions": [
                {
                    "question": "2*2=",
                    "good_answer": 4
                },
                {
                    "question": "3*4=",
                    "good_answer": 12
                },
                {
                    "question": "100*10=",
                    "good_answer": 1000
                },
                {
                    "question": "2*0=",
                    "good_answer": 0
                }
            ]
        },
        {
            "id": "long",
            "penalty": "8",
            "questions": [
                {
                    "question": "2*14=",
                    "good_answer": 28
                },
                {
                    "question": "1*1=",
                    "good_answer": 1
                },
                {
                    "question": "11*11=",
                    "good_answer": 121
                },
                {
                    "question": "25*25=",
                    "good_answer": 625
                },
                {
                    "question": "1*4=",
                    "good_answer": 4
                },
                {
                    "question": "4/2=",
                    "good_answer": 2
                }
            ]
        },
        {
            "id": "negative",
            "penalty": "4",
            "questions": [
                {
                    "question": "2-2=",
                    "good_answer": 0
                },
                {
                    "question": "3-14=",
                    "good_answer": -11
                },
                {
                    "question": "10-100=",
                    "good_answer": -90
                },
                {
                    "question": "-1+0=",
                    "good_answer": -1
                }
            ]    
        }
    ]
}`