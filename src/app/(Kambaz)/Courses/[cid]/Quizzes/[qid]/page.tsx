'use client';

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner, Table } from "react-bootstrap";
import { FaPencil } from "react-icons/fa6";
import * as client from "../client";


export default function QuizDetails() {
    const { cid, qid } = useParams();
    const router = useRouter();
    const [quiz, setQuiz] = useState<client.Quiz | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchQuiz = async () => {
        if (qid) {
            try {
                const data = await client.findQuizById(qid as string);
                setQuiz(data);
            } catch (error) {
                console.error("Error fetching quiz details:", error);
            }
        }
    };

    useEffect(() => {
        fetchQuiz();
    }, [qid]);

    const handlePublishToggle = async () => {
        if (!quiz) return;
        const updatedQuiz = await client.updateQuiz({ ...quiz, published: !quiz.published });
        await client.updateQuiz(updatedQuiz);
        setQuiz(updatedQuiz);
    };

    if (loading || !quiz) {
    return (
      <div className="p-4">
        <Spinner animation="border" size="sm" /> Loading quiz...
      </div>
    );
  }

    return (
        <div id="wd-quiz-details" className="p-4">
            <div className="d-flex align-items-center justify-content-end mb-3">
                <Button 
                    variant={quiz.published ? "success" : "secondary"}
                    className="me-2"
                    onClick={handlePublishToggle}
                >
                    {quiz.published ? "Unpublished" : "Published"}
                </Button>

                <Button variant="light" className="me-2 text-dark border">
                    Preview
                </Button>

                <Link href={`/Courses/${cid}/Quizzes/${qid}/Editor`}>
                    <Button variant="light" className="text-dark border">
                        <FaPencil className="me-1" /> Edit
                    </Button>
                </Link>

                <Button
                    variant="outline-secondary"
                    onClick={() =>
                    router.push(`/Courses/${cid}/Quizzes/${qid}/Questions`)
                    }
                >
                    Questions
                </Button>
            </div>

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
                    <td>{quiz.due}</td>
                    <td>Everyone</td>
                    <td>{quiz.availableDate}</td>
                    <td>{quiz.untilDate}</td>
                </tr>
                </tbody>
            </Table>
        </div>
    );
}