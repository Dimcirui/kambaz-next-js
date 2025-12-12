'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaBan, FaCheckCircle, FaEllipsisV, FaPlus, FaRocket } from "react-icons/fa";
import * as client from "./client";
import Link from "next/link";
import { Button, Dropdown, ListGroup } from "react-bootstrap";
import { IoEllipsisVertical } from "react-icons/io5";
import { BsRocketFill } from "react-icons/bs";

export default function Quizzes() {
    const { cid } = useParams();
    const router = useRouter();
    const [quizzes, setQuizzes] = useState<client.Quiz[]>([]);

    const fetchQuizzes = async () => {
        if (cid) {
            try {
                const data = await client.findQuizzesForCourse(cid as string);
                const sortedData = data.sort((a: any, b: any) => {
                    const dateA = new Date(a.availableDate || 0);
                    const dateB = new Date(b.availableDate || 0);
                    return dateB.getTime() - dateA.getTime();
                });
                setQuizzes(sortedData);
            } catch (error) {
                console.error("Error fetching quizzes:", error);
                setQuizzes([]);
            }
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
        router.push(`/Courses/${cid}/Quizzes/${createdQuiz._id}/Editor?new=true`);
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
            <div className="d-flex justify-content-between align-items-center mb-3">
                <input
                    placeholder="Search for Quiz"
                    className="form-control w-50"
                    id="wd-search-quiz"
                />

                <div>
                    <Button
                        variant="danger"
                        size="lg"
                        id="wd-add-quiz-btn"
                        onClick={handleAddQuiz}
                        className="me-1"
                    >
                        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} /> Quiz
                    </Button>
                    <Button variant="secondary" size="lg" className="me-1">
                        <IoEllipsisVertical className="fs-4" />
                    </Button>
                </div>
            </div>


            {/* Header */}
            <div id="wd-quiz-list-title" className="bg-light p-2 border-top border-bottom fw-bold text-secondary d-flex align-items-center">
                <span className="me-2" style={{ fontSize: "0.8rem" }}>▼</span> Assignment Quizzes
            </div>  

            {/* Quiz List Section */}
            <ListGroup className="rounded-0" id="wd-quiz-list">
                {quizzes.length === 0 && (
                    <div className="text-center p-5 text-secondary">
                        No quizzes available. Click &quot;+ Quiz&quot; to create one.
                    </div>
                )}

                {Array.isArray(quizzes) && quizzes.map((quiz) => (
                    <ListGroup.Item
                        key={quiz._id}
                        className="p-3 ps-2 d-flex align-items-center"
                        style={{ borderLeft: "4px solid green" }}
                    >
                        
                        <div className="me-4 text-success fs-3">
                            <BsRocketFill />
                        </div>

                        {/* Main Content */}
                        <div className="flex-grow-1">
                            <Link
                                href={`/Courses/${cid}/Quizzes/${quiz._id}`}
                                className="fw-bold text-dark text-decoration-none fs-5"
                                id="wd-quiz-link"
                            >
                                {quiz.title}
                            </Link>
                            <div className="text-nowrap">
                                <span className="fw-bold text-dark">
                                    {getStatusText(quiz)}
                                </span>{" "}
                                &nbsp; | &nbsp;
                                <span className="text-muted">Due</span> {formatDate(quiz.due)}{" "}
                                &nbsp; | &nbsp; {quiz.points} pts &nbsp; | &nbsp;
                                {quiz.questionsCount || 0} Questions
                            </div>
                        </div>

                        {/* Right Side Bar*/}
                        <div className="flex items-center space-x-4">
                            <span onClick={() => handleTogglePublish(quiz)} className="me-3 fs-4">
                                {quiz.published ? (
                                    <FaCheckCircle className="text-success" />
                                ) : (
                                    <FaBan className="text-danger" />
                                )}
                            </span>

                            <Dropdown className="d-inline" align="end">
                                <Dropdown.Toggle
                                    as="div"
                                    bsPrefix="custom-toggle"
                                    className="d-inline-block"
                                    style={{ cursor: "pointer" }}
                                >
                                    <IoEllipsisVertical className="fs-4 text-secondary" />
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item href={`/Courses/${cid}/Quizzes/${quiz._id}`} className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 no-underline">
                                        Edit
                                    </Dropdown.Item>
                                    <Dropdown.Item 
                                        onClick={() => handleTogglePublish(quiz)} 
                                    >
                                        {quiz.published ? "Unpublish" : "Publish"}
                                    </Dropdown.Item>
                                    <Dropdown.Item 
                                        onClick={() => handleDeleteQuiz(quiz._id!)} 
                                    >
                                        Delete
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
}
