/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Col, Row, Spinner, Table } from "react-bootstrap";
import { FaPencil } from "react-icons/fa6";
import * as client from "../client";

export default function QuizDetailsPage() {
  const params = useParams();
  const cid = params.cid as string;
  const qid = params.qid as string;
  const router = useRouter();

  const [quiz, setQuiz] = useState<client.Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  const loadQuiz = async () => {
    if (!qid) return;
    setLoading(true);
    try {
      const data = await client.findQuizById(qid);
      setQuiz(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuiz();
  }, [qid]);

  if (loading || !quiz) {
    return (
      <div className="p-4">
        <Spinner animation="border" size="sm" /> Loading quiz...
      </div>
    );
  }

  const isPublished = (quiz as any).published ?? false;

  return (
    <div className="p-4">
      {/* 标题 */}
      <h2 className="mb-3">{quiz.title}</h2>

      {/* 右上角按钮：Published / Preview / Edit / Questions */}
      <Row className="mb-4">
        <Col className="text-end">
          <Button
            variant={isPublished ? "secondary" : "outline-secondary"}
            className="me-2"
            disabled
          >
            {isPublished ? "Published" : "Unpublished"}
          </Button>
          <Button variant="light" className="me-2">
            Preview
          </Button>
          <Button
            variant="secondary"
            className="me-2"
            onClick={() =>
              router.push(`/Courses/${cid}/Quizzes/${qid}/Editor`)
            }
          >
            <FaPencil className="me-2" />
            Edit
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() =>
              router.push(`/Courses/${cid}/Quizzes/${qid}/Questions`)
            }
          >
            Questions
          </Button>
        </Col>
      </Row>

      {/* 简单 summary 表格，字段用你们已有的 Quiz 结构 */}
      <h4 className="mb-3">{quiz.title}</h4>
      <Table borderless>
        <tbody>
          <tr>
            <td className="fw-semibold">Quiz Type</td>
            <td>{(quiz as any).quizType ?? "Graded Quiz"}</td>
          </tr>
          <tr>
            <td className="fw-semibold">Points</td>
            <td>{(quiz as any).points ?? 0}</td>
          </tr>
          <tr>
            <td className="fw-semibold">Assignment Group</td>
            <td>{(quiz as any).assignmentGroup ?? "Quizzes"}</td>
          </tr>
          <tr>
            <td className="fw-semibold">Shuffle Answers</td>
            <td>{quiz.shuffleAnswers ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <td className="fw-semibold">Time Limit</td>
            <td>
              {quiz.timeLimit && quiz.timeLimit > 0
                ? `${quiz.timeLimit} minutes`
                : "None"}
            </td>
          </tr>
          <tr>
            <td className="fw-semibold">Due</td>
            <td>{(quiz as any).due ?? "None"}</td>
          </tr>
          <tr>
            <td className="fw-semibold">Available from</td>
            <td>{(quiz as any).availableDate ?? "None"}</td>
          </tr>
          <tr>
            <td className="fw-semibold">Until</td>
            <td>{(quiz as any).untilDate ?? "None"}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
