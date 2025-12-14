'use client';

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, Button, Col, Row, Spinner, Table } from "react-bootstrap";
import { FaPencil } from "react-icons/fa6";
import * as client from "../client";
import { useSelector } from "react-redux";


export default function QuizDetails() {
    const params = useParams();
    const cid = params.cid as string;
    const qid = params.qid as string;
    const router = useRouter();

    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

    const [quiz, setQuiz] = useState<client.Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchQuiz = async () => {
        if (!qid) return;
        setLoading(true);
        setError(null);
        try {
            const data = await client.findQuizById(qid);
            if (!data) {
                throw new Error("Quiz data not found");
            }
            setQuiz(data);
        } catch (err: any) {
            console.error("Error fetching quiz details:", err);
            setError(err.message || "Failed to load quiz.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuiz();
    }, [qid]);

    const handlePublishToggle = async () => {
        if (!quiz) return;
        try {
            const newPublishedState = !quiz.published;
            setQuiz({ ...quiz, published: newPublishedState });
            await client.updateQuiz({ ...quiz, published: newPublishedState });
        } catch (err) {
            console.error("Error updating publish status:", err);
            alert("Failed to update publish status. Please try again.");
            fetchQuiz();
        }
    };

    if (loading) {
        return (
        <div className="p-5 text-center">
            <Spinner animation="border" variant="secondary" />
            <div className="mt-2 text-secondary">Loading quiz details...</div>
        </div>
        );
    }

    if (error) {
        return (
        <div className="p-5">
            <Alert variant="danger">
            <Alert.Heading>Error</Alert.Heading>
            <p>{error}</p>
            <Button
                variant="outline-danger"
                onClick={() => router.push(`/Courses/${cid}/Quizzes`)}
            >
                Back to Quiz List
            </Button>
            </Alert>
        </div>
        );
    }

    if (!quiz) {
        return <div className="p-5 text-center">Quiz not found.</div>;
    }

    return (
        <div id="wd-quiz-details" className="p-4">
            <div className="d-flex align-items-center justify-content-end mb-3">
                {isFaculty && (
                    <div>
                        <Button 
                            variant={quiz.published ? "success" : "secondary"}
                            className="me-2"
                            onClick={handlePublishToggle}
                        >
                            {quiz.published ? "Unpublished" : "Published"}
                        </Button>

                        <Button
                            variant="light"
                            className="me-2 text-dark border"
                            onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Preview`)}
                        >
                            Preview
                        </Button>

                        
                        <Link href={`/Courses/${cid}/Quizzes/${qid}/Editor`}>
                            <Button variant="light" className="text-dark border">
                                <FaPencil className="me-1" /> Edit
                            </Button>
                        </Link>
                    </div>
                )}

                {!isFaculty && (
                    <Button 
                        variant="danger" 
                        size="lg"
                        onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Preview`)}
                    >
                        Start Quiz
                    </Button>
                )}
            </div>

            {/* Title */}
            <h1 className="mb-3">{quiz.title}</h1>

            <div className="mb-5">
                <Row className="mb-2">
                    <Col md={3} className="text-end fw-bold text-secondary">Quiz Type</Col>
                    <Col md={9}>{quiz.quizType || "Graded Quiz"}</Col>
                </Row>
                <Row className="mb-2">
                    <Col md={3} className="text-end fw-bold text-secondary">Points</Col>
                    <Col md={9}>{quiz.points}</Col>
                </Row>
                <Row className="mb-2">
                    <Col md={3} className="text-end fw-bold text-secondary">Assignment Group</Col>
                    <Col md={9}>{quiz.assignmentGroup || "Quizzes"}</Col>
                </Row>
                <Row className="mb-2">
                    <Col md={3} className="text-end fw-bold text-secondary">Shuffle Answers</Col>
                    <Col md={9}>{quiz.shuffleAnswers ? "Yes" : "No"}</Col>
                </Row>
                <Row className="mb-2">
                    <Col md={3} className="text-end fw-bold text-secondary">Time Limit</Col>
                    <Col md={9}>{quiz.timeLimit ? `${quiz.timeLimit} Minutes` : "None"}</Col>
                </Row>
                <Row className="mb-2">
                    <Col md={3} className="text-end fw-bold text-secondary">Multiple Attempts</Col>
                    <Col md={9}>{quiz.multipleAttempts ? "Yes" : "No"}</Col>
                </Row>
                {quiz.multipleAttempts && (
                    <Row className="mb-2">
                        <Col md={3} className="text-end fw-bold text-secondary">How Many Attempts</Col>
                        <Col md={9}>{quiz.howManyAttempts || "Unlimited"}</Col>
                    </Row>
                )}
                <Row className="mb-2">
                    <Col md={3} className="text-end fw-bold text-secondary">Show Correct Answers</Col>
                    <Col md={9}>{quiz.showCorrectAnswers ? "Yes" : "No"}</Col>
                </Row>
                <Row className="mb-2">
                    <Col md={3} className="text-end fw-bold text-secondary">Access Code</Col>
                    <Col md={9}>{quiz.accessCode || "None"}</Col>
                </Row>
                <Row className="mb-2">
                    <Col md={3} className="text-end fw-bold text-secondary">One Question at a Time</Col>
                    <Col md={9}>{quiz.oneQuestionAtATime ? "Yes" : "No"}</Col>
                </Row>
                <Row className="mb-2">
                    <Col md={3} className="text-end fw-bold text-secondary">Webcam Required</Col>
                    <Col md={9}>{quiz.webcamRequired ? "Yes" : "No"}</Col>
                </Row>
                <Row className="mb-2">
                    <Col md={3} className="text-end fw-bold text-secondary">Lock Questions After Answering</Col>
                    <Col md={9}>{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</Col>
                </Row>
            </div>

            <Table striped bordered hover className="mt-4" style={{ maxWidth: "800px" }}>
                <thead>
                <tr>
                    <th>Due</th>
                    <th>For</th>
                    <th>Available from</th>
                    <th>Until</th>
                </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{quiz.due || "None"}</td>
                        <td>Everyone</td>
                        <td>{quiz.availableDate || "None"}</td>
                        <td>{quiz.untilDate || "None"}</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    );
}