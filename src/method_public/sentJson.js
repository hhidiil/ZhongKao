/**
 * 数据存储Json结构
 * Created by gaoju on 2018/4/23.
 */

export var sentJson_Question = {
    "ExamInfoID": "",
    "UserID": "",
    "ExamPaperID":"",
    "Score": "",
    "AllDone": "",
    "currentquesid": 0,
    "StartDate": "",
    "FinishDate": "",
    "SpendTime":0,
    "ExamType":"",
    "DoExamInfo":"",
    "ExamResult": []
};
//默认：二测数据中每一个试题下面子题的数据存储结构
export var EveryChildInfo={
    "questionid": "",
    "QuesType": "",
    "answer": [
        {
            "content":"",
            "url":""
        }
    ],
    "scroe": 0,
    "isRight": false,
    "childs": [
        {
            "Objective": [
            ],
            "Review": [
            ],
            "Analysis": [
            ],
            "Explain": [
            ],
            "Exercise1": [
                {
                    "questionid": "Q_9c3b6664-ba01-4809-8ebf-b52888ee56c6",
                    "answer": "6",
                    "isRight": true,
                }
            ],
            "Exercise2": [
            ]
        }
    ]
}