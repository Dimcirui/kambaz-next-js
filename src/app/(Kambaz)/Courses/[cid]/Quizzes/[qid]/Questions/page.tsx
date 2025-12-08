"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Nav, Spinner } from "react-bootstrap";
import * as client from "../../client";
import { FaPlus, FaTrash } from "react-icons/fa6";
import QuestionEditor from "./QuestionEditor";

export default function QuizQuestionsPage() {
  const params = useParams();
  const cid = params.cid as string;
  const qid = params.qid as string;
  const pathname = usePathname();
  const activeTab = pathname?.includes("/Questions")
    ? "questions"
    : "details";

  const [questions, setQuestions] = useState<client.Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  const fetchQuestions = async () => {
    if (!qid) return;
    try {
        const data = await client.findQuestionsForQuiz(qid);
        setQuestions(data);
    } catch (error) {
        console.error("Error fetching questions:", error);
        setQuestions([]);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [qid]);

  const handleNewQuestion = async () => {
    const newQuestion: client.Question = {
        title: "New Question",
        quizId: qid,
        points: 0,
        text: "",
        type: "MULTIPLE_CHOICE",
        choices: [],
        correctAnswer: [],
    };

    const createdQuestion = await client.createQuestion(qid, newQuestion);
    await fetchQuestions();
    setEditingQuestionId(createdQuestion._id);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    const confirmed = confirm("Are you sure you want to delete this question?");
    if (!confirmed) return;
        await client.deleteQuestion(questionId);
        fetchQuestions();
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <Nav variant="tabs" activeKey={activeTab} className="mb-3">
        <Nav.Item>
          <Nav.Link
            as={Link}
            href={`/Courses/${cid}/Quizzes/${qid}/Editor`}
            eventKey="details"
          >
            Details
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            href={`/Courses/${cid}/Quizzes/${qid}/Questions`}
            eventKey="questions"
          >
            Questions
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Title Button */}
      <div className="text-center mb-4">
        <Button variant="secondary" onClick={handleNewQuestion}>
            <FaPlus className="me-2" /> New Question
        </Button>
      </div>

      {questions.length === 0 && (
        <div className="text-center p-5 text-secondary">
            No questions added yet. Click &quot;New Question&quot; to add one.
        </div>
      )}

      {/* Question List */}
        <div id="wd-question-list">
            {questions.map((q) => (
                <div key={q._id} className="mb-3 p-3 border rounded">
                    {editingQuestionId === q._id ? (
                        // Edit
                        <QuestionEditor
                            question={q}
                            onSave={() => {
                                setEditingQuestionId(null);
                                fetchQuestions();
                            }}
                            onCancel={() => {
                                setEditingQuestionId(null);
                                fetchQuestions();
                            }}
                        />
                    ) : (
                        // View
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <div className="d-flex align-items-center mb-2">
                                    <span className="fw-bold">{q.title}</span>
                                    <span className="badge bg-secondary">{q.type.replace(/_/g, " ")}</span>
                                </div>

                                <div className="text-muted text-truncate" style={{ maxWidth: "600px" }}>
                                    {q.text}
                                </div>

                                <div className="text-end"></div>
                                    <div className="fw-bold mb-2">{q.points} pts</div>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => setEditingQuestionId(q._id!)}
                                    >
                                        <i className="bi bi-pencil-fill me-1"></i> Edit
                                    </Button>

                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDeleteQuestion(q._id!)}
                                    >
                                        <FaTrash />
                                    </Button>
                                </div>
                            </div>
                        )}
                </div>
            ))}
        </div>
    </div>
  );
}
