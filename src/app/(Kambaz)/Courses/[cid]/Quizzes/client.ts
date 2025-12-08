import axios from 'axios';

const REMOTE_SERVER = process.env.NEXT_PUBLIC_REMOTE_SERVER || "http://localhost:4000";
const COURSES_API = `${REMOTE_SERVER}/api/courses`;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;

export interface Quiz {
    _id?: string;
    title: string;
    course: string;
    description?: string;
    quizType?: string;
    assignmentGroup?: string;
    shuffleAnswers?: boolean;
    timeLimit?: number;
    multipleAttempts?: boolean;
    showCorrectAnswers?: boolean;
    accessCode?: string;
    lockQuestionsAfterAnswering?: boolean;
    points: number;
    due?: string;
    availableDate?: string;
    untilDate?: string;
    published: boolean;
    questionsCount?: number;
    howManyAttempts?: number;
    oneQuestionAtATime?: boolean;
    webcamRequired?: boolean;
}

export interface Question {
    _id?: string;
    quizId: string;
    title: string;
    points: number;
    text?: string;
    type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_THE_BLANK";
    choices?: { text: string, isCorrect: boolean }[];
    correctAnswer?: string[];
}

// Quiz APIs
export const findQuizzesForCourse = async (courseId: string) => {
    const response = await axios.get(`${COURSES_API}/${courseId}/quizzes`);
    return response.data;
};

export const findQuizById = async (quizId: string) => {
    const response = await axios.get(`${QUIZZES_API}/${quizId}`);
    return response.data;
}

export const createQuiz = async (courseId: string, quiz: Quiz) => {
    const response = await axios.post(`${COURSES_API}/${courseId}/quizzes`, quiz);
    return response.data;
};

export const updateQuiz = async (quiz: Quiz) => {
    const response = await axios.put(`${QUIZZES_API}/${quiz._id}`, quiz);
    return response.data;
};

export const deleteQuiz = async (quizId: string) => {
    const response = await axios.delete(`${QUIZZES_API}/${quizId}`);
    return response.data;
}

// Question APIs
export const findQuestionsForQuiz = async (quizId: string) => {
    const response = await axios.get(`${QUIZZES_API}/${quizId}/questions`);
    return response.data;
};

export const createQuestion = async (quizId: string, question: Question) => {
    const response = await axios.post(`${QUIZZES_API}/${quizId}/questions`, question);
    return response.data;
}; 

export const updateQuestion = async (question: Question) => {
    const response = await axios.put(`${QUIZZES_API}/questions/${question._id}`, question);
    return response.data;
};

export const deleteQuestion = async (questionId: string) => {
    const response = await axios.delete(`${QUIZZES_API}/questions/${questionId}`);
    return response.data;
}