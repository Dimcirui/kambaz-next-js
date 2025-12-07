'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaBan, FaCheckCircle, FaEllipsisV, FaPlus, FaRocket } from "react-icons/fa";
import * as client from "./client";
import Link from "next/link";

export default function Quizzes() {
    const { cid } = useParams();
    const router = useRouter();
    const [quizzes, setQuizzes] = useState<client.Quiz[]>([]);

    const fetchQuizzes = async () => {
        if (cid) {
            const data = await client.findQuizzesForCourse(cid as string);
            setQuizzes(data);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, [cid]);

    const handleAddQuiz = async () => {
        const newQuiz = {
            title: "New Quiz",
            course: cid as string,
            points: 0,
            published: false,
            questionsCount: 0,
            due: new Date().toISOString().split('T')[0], // default due date today
            availableDate: new Date().toISOString().split('T')[0] // default available date today
        };
        const createdQuiz = await client.createQuiz(cid as string, newQuiz);
        router.push(`/Courses/${cid}/Quizzes/${createdQuiz._id}`);
    };
    
    const handleDeleteQuiz = async (quizId: string) => {
        await client.deleteQuiz(quizId);
        fetchQuizzes();
    };

    const handleTogglePublish = async (quiz: client.Quiz) => {
        await client.updateQuiz({ ...quiz, published: !quiz.published });
        fetchQuizzes();
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "No date";
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short", day: "numeric"
        });
    };

    const getStatusText = (quiz: client.Quiz) => {
        const now = new Date();
        const availableDate = quiz.availableDate ? new Date(quiz.availableDate) : null;
        const due = quiz.due ? new Date(quiz.due) : null;

        if (due && now > due) return "Closed";
        if (availableDate && now < availableDate) return "Not available until " + formatDate(quiz.availableDate);
        return "Available";
    };

    return (
        <div id="wd-quizzes">
            <div className="flex justify-between items-center mb-4">
                <input
                    placeholder="Search for Quiz"
                    className="p-2 border rounded"
                    id="wd-search-quiz"
                />

                <div>
                    <button
                        id="wd-add-quiz"
                        onClick={handleAddQuiz}
                        className="bg-red-600 textwhite px-4 py-2 rounded hover:bg-red-700 mr-2"
                    >
                        <FaPlus className="inline mr-1" /> Quiz
                    </button>
                    <button className="bg-gray-200 p-2 rounded hover:bg-gray-300">
                        <FaEllipsisV />
                    </button>
                </div>
            </div>

            {/* Quiz List Section */}
            <div className="mt-4">
                <div className="bg-gray-100 p-3 font-bold flex justify-between items-center">
                    <span className="flex items-center">
                        <span className="mr-2">▼</span> Assignment Quizzes
                    </span>
                </div>

                <ul id="wd-quiz-list" className="border-l border-r">
                    {quizzes.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No quizzes available. Click &quot;+ Quiz&quot; to create one.
                        </div>
                    )}
                    {quizzes.map((quiz) => (
                        <li key={quiz._id} className="wd-quiz-list-item flex items-center p-4 border-b hover:bg-gray-50">
                            <div className="text-green-600 text-2xl mr-4">
                                <FaRocket />
                            </div>

                            {/* Main Content */}
                            <div className="flex-grow">
                                <Link
                                    href={`/Courses/${cid}/Quizzes/${quiz._id}`}
                                    className="font-bold text-gray-800 hover:text-blue-600 text-lg no-underline"
                                >
                                    {quiz.title}
                                </Link>
                                <div className="text-sm text-gray-600 mt-1">
                                    <span className="font-semibold">{getStatusText(quiz)}</span> | &nbsp;
                                    <span className="font-bold">Due</span> {formatDate(quiz.due)} | &nbsp;
                                    {quiz.points} pts | &nbsp;
                                    {quiz.questionsCount || 0} Questions
                                </div>
                            </div>

                            {/* Right Side Bar*/}
                            <div className="flex items-center space-x-4">
                                <button onClick={() => handleTogglePublish(quiz)} className="text-2xl">
                                    {quiz.published ? (
                                        <FaCheckCircle className="text-green-600" />
                                    ) : (
                                        <FaBan className="text-gray-400" />
                                    )}
                                </button>

                                <div className="relative group">
                                    <button className="text-gray-600 hover:bg-gray-200 p-2 rounded">
                                        <FaEllipsisV />
                                    </button>

                                    <div className="absolute right-0 top-8 bg-white border shadow-lg rounded hidden group-hover:block z-10 w-32">
                                        <Link href={`/Courses/${cid}/Quizzes/${quiz._id}`} className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 no-underline">
                                            Edit
                                        </Link>
                                        <button 
                                            onClick={() => handleDeleteQuiz(quiz._id!)} 
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                                        >
                                            Delete
                                        </button>
                                        <button 
                                            onClick={() => handleTogglePublish(quiz)} 
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                                        >
                                            {quiz.published ? "Unpublish" : "Publish"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
