/* eslint-disable @typescript-eslint/no-explicit-any */
// path: src/app/(Kambaz)/Courses/[cid]/Quizzes/[qid]/Editor/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  Button,
  Col,
  Row,
  Form,
  Spinner,
  Nav,
} from "react-bootstrap";
import * as client from "../../client";

type FormState = {
  title: string;
  description: string;
  points: number;
  shuffleAnswers: boolean;
  timeLimitEnabled: boolean;
  timeLimitMinutes: number;
  due: string;
  availableDate: string;
  untilDate: string;
};

export default function QuizEditorPage() {
  const params = useParams();
  const cid = params.cid as string;
  const qid = params.qid as string;
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = pathname?.includes("/Questions")
    ? "questions"
    : "details";

  const [quiz, setQuiz] = useState<client.Quiz | null>(null);
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    points: 0,
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
      const data = await client.findQuizById(qid);
      setQuiz(data);
      setForm({
        title: data.title ?? "",
        description: data.description ?? "",
        points: (data as any).points ?? 0,
        shuffleAnswers: data.shuffleAnswers ?? false,
        timeLimitEnabled: (data.timeLimit ?? 0) > 0,
        timeLimitMinutes: data.timeLimit ?? 0,
        due: (data as any).due ? (data as any).due.substring(0, 10) : "",
        availableDate: (data as any).availableDate
          ? (data as any).availableDate.substring(0, 10)
          : "",
        untilDate: (data as any).untilDate
          ? (data as any).untilDate.substring(0, 10)
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

  // Construct the Quiz object to send to the backend
  const buildPayload = (): client.Quiz => {
    if (!quiz) {
      throw new Error("Quiz not loaded");
    }

    return {
      ...quiz,
      title: form.title,
      description: form.description,
      points: form.points,
      shuffleAnswers: form.shuffleAnswers,
      timeLimit: form.timeLimitEnabled ? Number(form.timeLimitMinutes) : 0,
      due: form.due || undefined,
      availableDate: form.availableDate || undefined,
      untilDate: form.untilDate || undefined,
    } as client.Quiz;
  };

  const handleSave = async () => {
    const payload = buildPayload();
    const updated = await client.updateQuiz(payload);
    setQuiz(updated);
    router.push(`/Courses/${cid}/Quizzes/${qid}`); // Go back to details page
  };

  const handleSaveAndPublish = async () => {
    const payload = {
      ...buildPayload(),
      published: true,
    } as client.Quiz;
    await client.updateQuiz(payload);
    router.push(`/Courses/${cid}/Quizzes`); // Go back to list page 
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Quizzes`); // Go back to list page
  };

  if (loading || !quiz) {
    return (
      <div className="p-4">
        <Spinner animation="border" size="sm" /> Loading quiz editor...
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Tabs：Details / Questions */}
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

      <h2 className="mb-3">Edit Quiz Details</h2>

      <Form>
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
          <Col md={4}>
            <Form.Group className="mb-3" controlId="points">
              <Form.Label>Points</Form.Label>
              <Form.Control
                type="number"
                value={form.points}
                onChange={(e) =>
                  handleChange("points", Number(e.target.value) || 0)
                }
              />
            </Form.Group>
          </Col>

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
            <Form.Group className="mb-3" controlId="timeLimitMinutes">
              <Form.Label>Time limit</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Check
                  type="checkbox"
                  className="me-2"
                  checked={form.timeLimitEnabled}
                  onChange={(e) =>
                    handleChange("timeLimitEnabled", e.target.checked)
                  }
                />
                <Form.Control
                  type="number"
                  value={form.timeLimitMinutes}
                  disabled={!form.timeLimitEnabled}
                  onChange={(e) =>
                    handleChange(
                      "timeLimitMinutes",
                      Number(e.target.value) || 0
                    )
                  }
                />
                <span className="ms-2">minutes</span>
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="due">
              <Form.Label>Due date</Form.Label>
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
                onChange={(e) =>
                  handleChange("untilDate", e.target.value)
                }
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
