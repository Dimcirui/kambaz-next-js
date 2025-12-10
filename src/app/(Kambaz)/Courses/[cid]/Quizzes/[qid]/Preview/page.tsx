'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as client from "../../client";
import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const QuestionItem = ({
    question,
    index,
    answers,
    handleAnswerChange,
    submitted
}: {
    question: client.Question;
    index: number; 
    answers: Record<string, any>;
    handleAnswerChange: (questionId: string, value: any) => void; 
    submitted: boolean;
}) => {
        const isFillInBlankCorrect = () => {
            if (question.type !== "FILL_IN_THE_BLANK") return false;
            
            const userAnswers = answers[question._id!] || {};
            const correctAnswers = question.correctAnswer || [];

            if (correctAnswers.length === 0) return false;

            return correctAnswers.every((correctAns, idx) => {
                const userAns = userAnswers[idx] || "";
                return correctAns.trim().toLowerCase() === userAns.trim().toLowerCase();
            });
        };

        return (
            <Card className="mb-4">
                <Card.Header className="d-flex align-items-center">
                    <h5 className="mb-0">
                        Question {index + 1}
                    </h5>
                    <span className="ms-auto badge bg-secondary">
                        {question.points} Points
                    </span>
                </Card.Header>
                
                <Card.Body>
                    <div className="mb-3" dangerouslySetInnerHTML={{ __html: question.text || "" }} />

                    {(question.type === "MULTIPLE_CHOICE" || question.type === "TRUE_FALSE") && (
                        <Form>
                            {(question.choices || []).map((choice: any, idx: number) => {
                                const isSelected = answers[question._id!] === choice.text;

                                return (
                                    <div key={idx} className={`form-check mb-2 p-2 rounded border ${isSelected ? "border-primary bg-light" : "border-transparent"}`}>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name={`question-${question._id}`}
                                            id={`question-${question._id}-choice-${idx}`}
                                            checked={isSelected}
                                            onChange={() => handleAnswerChange(question._id!, choice.text)}
                                            disabled={submitted}
                                        />
                                        <label
                                            className="form-check-label ms-2"
                                            htmlFor={`question-${question._id}-choice-${idx}`}
                                        >
                                            {choice.text}
                                        </label>
                                    </div>
                                );
                            })}
                        </Form>
                    )}

                    {question.type === "FILL_IN_THE_BLANK" && (
                        <div>
                            {(question.correctAnswer && question.correctAnswer.length > 0) ? (
                                question.correctAnswer.map((_: any, idx: number) => {
                                const val = (answers[question._id!] || {})[idx] || "";
                                return (
                                    <Form.Group
                                        key={idx}
                                        as={Row}
                                        className="mb-3 align-items-center"
                                    >
                                        <Form.Label column sm={3} className="fw-bold">
                                            Blank {idx + 1}:
                                        </Form.Label>

                                        <Col sm={9}>
                                            <Form.Control
                                                type="text"
                                                value={val}
                                                onChange={(e) => {
                                                    const curAnswers = typeof answers[question._id!] === 'object'
                                                        ? { ...answers[question._id!] }
                                                        : {};
                                                    curAnswers[idx] = e.target.value;
                                                    handleAnswerChange(question._id!, curAnswers);
                                                }}
                                                disabled={submitted}
                                            />
                                        </Col>
                                    </Form.Group>
                                );
                            })
                            ) : (
                                <div className="text-secondary">No blanks defined for this question.</div>
                            )}
                        </div>
                    )}
                </Card.Body>

                {submitted && (
                    <Card.Footer className={`bg-opacity-10 ${
                        (question.type === "FILL_IN_THE_BLANK" ? isFillInBlankCorrect() : 
                        (question.choices || []).find((c: any) => c.isCorrect)?.text === answers[question._id!])
                        ? "bg-success" : "bg-danger"
                    }`}>
                        <div className="fw-bold">
                            {question.type === "FILL_IN_THE_BLANK" 
                                ? (isFillInBlankCorrect() ? <span className="text-success"><FaCheckCircle className="me-2"/>Correct</span> : <span className="text-danger"><FaTimesCircle className="me-2"/>Incorrect</span>)
                                : ((question.choices || []).find((c: any) => c.isCorrect)?.text === answers[question._id!] 
                                    ? <span className="text-success"><FaCheckCircle className="me-2"/>Correct</span> 
                                    : <span className="text-danger"><FaTimesCircle className="me-2"/>Incorrect</span>)
                            }
                        </div>
                        
                        <div className="mt-2 text-muted small">
                            <strong>Correct Answer(s): </strong>
                            {question.type === "FILL_IN_THE_BLANK" 
                                ? (question.correctAnswer || []).join(", ") 
                                : (question.choices || []).find((c: any) => c.isCorrect)?.text}
                        </div>
                    </Card.Footer>
                )}
            </Card>
        );
    };

export default function QuizPreview() {
    const { cid, qid } = useParams();
    const router = useRouter();

    const [quiz, setQuiz] = useState<client.Quiz | null>(null);
    const [questions, setQuestions] = useState<client.Question[]>([]);
    const [loading, setLoading] = useState(true);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (!qid) return;
            try {
                const quizData = await client.findQuizById(qid as string);
                const questionsData = await client.findQuestionsForQuiz(qid as string);
                setQuiz(quizData);
                setQuestions(questionsData);
            } catch (err) {
                console.error("Error fetching quiz preview data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [qid]);

    const handleAnswerChange = (questionId: string, value: any) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = () => {
        let totalScore = 0;
        questions.forEach((question) => {
            const userAnswer = answers[question._id!];
            if (!userAnswer) return;

            if (question.type === "MULTIPLE_CHOICE" || question.type === "TRUE_FALSE") {
                const correctChoice = question.choices?.find((choice) => choice.isCorrect);
                if (correctChoice && correctChoice.text === userAnswer) {
                    totalScore += question.points;
                }
            } else if (question.type === "FILL_IN_THE_BLANK") {
                const userAnswerObj = userAnswer || {};
                const correctAnswers = question.correctAnswer || [];

                let allCorrect = true;
                if (correctAnswers.length > 0) {
                    correctAnswers.forEach((correctAns, idx) => {
                        const userAns = userAnswerObj[idx] || "";

                        if (correctAns.trim().toLowerCase() !== userAns.trim().toLowerCase()) {
                            allCorrect = false;
                        }
                    });
                } else {
                    allCorrect = false;
                }

                if (allCorrect) {
                    totalScore += question.points;
                }
            }
        });
        setScore(totalScore);
        setSubmitted(true);
    };

    if (loading || !quiz) {
        return (
            <div className="p-5 text-center">
                <Spinner animation="border" variant="secondary" />
                <div className="mt-2 text-secondary">Loading quiz preview...</div>
            </div>
        );
    }

    const isOneQuestionAtATime = quiz.oneQuestionAtATime;

    return (
        <Container className="p-4">
            <h3 className="mb-4">Quiz Preview: {quiz.title}</h3>

            {submitted && (
                <div className="mb-4">
                    <h5>Your Score: {score} / {questions.reduce((sum, q) => sum + q.points, 0)}</h5>
                </div>
            )}

            {!submitted && (
                <div className="bg-light p-3 border rounded mb-4 d-flex justify-content-between align-items-center">
                    <span>Started: {new Date().toLocaleString()}</span>
                    <span className="text-danger fw-bold">Quiz Instructions</span>
                </div>
            )}

            <Row>
                <Col md={8} className="mx-auto">
                    {questions.length === 0 && (
                        <div className="text-center text-secondary">
                            No questions available in this quiz.
                        </div>
                    )}

                    {isOneQuestionAtATime ? (
                        <div>
                            {questions.length > 0 && (
                                <QuestionItem
                                    question={questions[currentQuestionIndex]}
                                    index={currentQuestionIndex}
                                    answers={answers}
                                    handleAnswerChange={handleAnswerChange}
                                    submitted={submitted}
                                />
                            )}

                            <div className="d-flex justify-content-between">
                                <Button
                                    variant="secondary"
                                    disabled={currentQuestionIndex === 0}
                                    onClick={() => setCurrentQuestionIndex((idx) => idx - 1)}
                                >
                                    Previous
                                </Button>

                                {currentQuestionIndex < questions.length - 1 ? (
                                    <Button
                                        variant="secondary"
                                        onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                    >
                                        Next
                                    </Button>
                                ) : (
                                    !submitted && (
                                        <Button variant="primary" onClick={handleSubmit}>
                                            Submit Quiz
                                        </Button>
                                    )
                                )}
                            </div>
                        </div>
                    ) : (
                        <div>
                            {questions.map((q, idx) => (
                                <QuestionItem
                                    key={q._id} 
                                    question={q} 
                                    index={idx} 
                                    answers={answers} 
                                    handleAnswerChange={handleAnswerChange} 
                                    submitted={submitted}
                                />
                            ))}
                            
                            {!submitted && questions.length > 0 && (
                                <div className="d-flex justify-content-end mt-4 border-top pt-3">
                                    <Button variant="primary" onClick={handleSubmit}>
                                        Submit Quiz
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </Col>

                <Col md={3}>
                    <div className="sticky-top" style={{ top: "20px" }}>
                        <div className="border rounded p-3 bg-white">
                            <h5 className="mb-3">Questions</h5>
                            <div className="d-flex flex-wrap gap-2">
                                {questions.map((q, idx) => (
                                    <Button
                                        key={q._id}
                                        variant={
                                            answers[q._id!] 
                                            ? "success"
                                            : (idx === currentQuestionIndex && isOneQuestionAtATime ? "primary" : "outline-secondary")
                                        }
                                        style={{ width: "35px", height: "35px", padding: 0 }}
                                        onClick={() => isOneQuestionAtATime && setCurrentQuestionIndex(idx)}
                                        disabled={submitted}
                                    >
                                        {submitted && (answers[q._id!] ? <FaCheckCircle style={{fontSize: "0.8em"}}/> : "?")}
                                        {!submitted && (idx + 1)}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}