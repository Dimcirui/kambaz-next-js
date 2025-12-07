/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(Kambaz)/Courses/[cid]/Quizzes/[qid]/Editor/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Form, Row, Col, Spinner } from "react-bootstrap";
import * as client from "../../client";

type FormState = {
  title: string;
  description: string;
  quizType: string;
  assignmentGroup: string;
  shuffleAnswers: boolean;
  timeLimitEnabled: boolean;
  timeLimitMinutes: number;
  due: string;
  availableDate: string;
  untilDate: string;
};

export default function QuizEditorPage() {
  const { cid, qid } = useParams();
  const router = useRouter();

  const [quiz, setQuiz] = useState<client.Quiz | null>(null);
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    quizType: "",
    assignmentGroup: "",
    shuffleAnswers: false,
    timeLimitEnabled: false,
    timeLimitMinutes: 0,
    due: "",
    availableDate: "",
    untilDate: "",
  });
  const [loading, setLoading] = useState(true);

  const loadQuiz = async () => {
    if (!qid) return;
    setLoading(true);
    try {
      const data = await client.findQuizById(qid as string);
      setQuiz(data);
      setForm({
        title: data.title ?? "",
        description: data.description ?? "",
        quizType: data.quizType ?? "",
        assignmentGroup: data.assignmentGroup ?? "",
        shuffleAnswers: data.shuffleAnswers ?? false,
        timeLimitEnabled: (data.timeLimit ?? 0) > 0,
        timeLimitMinutes: data.timeLimit ?? 0,
        // 假设后端存的是 ISO 字符串，这里只取日期部分
        due: data.due ? data.due.substring(0, 10) : "",
        availableDate: data.availableDate
          ? data.availableDate.substring(0, 10)
          : "",
        untilDate: data.untilDate
          ? data.untilDate.substring(0, 10)
          : "",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuiz();
  }, [qid]);

  const handleChange = (field: keyof FormState, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // 构造要发给后端的 Quiz 对象，保留其它字段
  const buildPayload = (): client.Quiz => {
    if (!quiz) {
      // typescript 安抚一下，实际上有 quiz 才能点保存
      throw new Error("Quiz not loaded");
    }
    return {
      ...quiz,
      title: form.title,
      description: form.description,
      quizType: form.quizType,
      assignmentGroup: form.assignmentGroup,
      shuffleAnswers: form.shuffleAnswers,
      timeLimit: form.timeLimitEnabled ? Number(form.timeLimitMinutes) : 0,
      due: form.due || undefined,
      availableDate: form.availableDate || undefined,
      untilDate: form.untilDate || undefined,
    };
  };

  const handleSave = async () => {
    const payload = buildPayload();
    const updated = await client.updateQuiz(payload);
    setQuiz(updated);
    // 保存后回到详情页
    router.push(`/Courses/${cid}/Quizzes/${qid}`);
  };

  const handleSaveAndPublish = async () => {
    const payload = buildPayload();
    // 你们后端如果有 isPublished 字段，这里可以加上
    (payload as any).published = true;
    await client.updateQuiz(payload);
    // 考虑再调用一个专门 publish 的 API，这里先简单处理
    router.push(`/Courses/${cid}/Quizzes`);
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Quizzes`);
  };

  if (loading || !quiz) {
    return (
      <div className="p-3">
        <Spinner animation="border" size="sm" /> Loading quiz editor...
      </div>
    );
  }

  return (
    <div className="p-3">
      <h2>Edit Quiz: {quiz.title}</h2>

      <Form className="mt-3">
        <Form.Group className="mb-3" controlId="quizTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="quizDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="quizType">
              <Form.Label>Quiz Type</Form.Label>
              <Form.Control
                type="text"
                value={form.quizType}
                onChange={(e) => handleChange("quizType", e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3" controlId="assignmentGroup">
              <Form.Label>Assignment Group</Form.Label>
              <Form.Control
                type="text"
                value={form.assignmentGroup}
                onChange={(e) =>
                  handleChange("assignmentGroup", e.target.value)
                }
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="shuffleAnswers">
              <Form.Check
                type="checkbox"
                label="Shuffle answers"
                checked={form.shuffleAnswers}
                onChange={(e) =>
                  handleChange("shuffleAnswers", e.target.checked)
                }
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3" controlId="timeLimitEnabled">
              <Form.Check
                type="checkbox"
                label="Time limit"
                checked={form.timeLimitEnabled}
                onChange={(e) =>
                  handleChange("timeLimitEnabled", e.target.checked)
                }
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3" controlId="timeLimitMinutes">
              <Form.Label>Time (minutes)</Form.Label>
              <Form.Control
                type="number"
                value={form.timeLimitMinutes}
                disabled={!form.timeLimitEnabled}
                onChange={(e) =>
                  handleChange("timeLimitMinutes", Number(e.target.value))
                }
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="due">
              <Form.Label>Due</Form.Label>
              <Form.Control
                type="date"
                value={form.due}
                onChange={(e) => handleChange("due", e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3" controlId="availableDate">
              <Form.Label>Available from</Form.Label>
              <Form.Control
                type="date"
                value={form.availableDate}
                onChange={(e) =>
                  handleChange("availableDate", e.target.value)
                }
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3" controlId="untilDate">
              <Form.Label>Until</Form.Label>
              <Form.Control
                type="date"
                value={form.untilDate}
                onChange={(e) => handleChange("untilDate", e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>

      <div className="d-flex gap-2 mt-3">
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
        <Button variant="success" onClick={handleSaveAndPublish}>
          Save &amp; Publish
        </Button>
      </div>
    </div>
  );
}
