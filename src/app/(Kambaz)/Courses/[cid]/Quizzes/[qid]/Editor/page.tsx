/* eslint-disable @typescript-eslint/no-explicit-any */
// path: src/app/(Kambaz)/Courses/[cid]/Quizzes/[qid]/Editor/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
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

  quizType: string;
  assignmentGroup: string;

  shuffleAnswers: boolean;
  timeLimitEnabled: boolean;
  timeLimitMinutes: number;

  multipleAttempts: boolean;
  howManyAttempts: number;
  showCorrectAnswers: boolean;
  accessCode: string;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;

  due: string;
  availableDate: string;
  untilDate: string;
};

export default function QuizEditorPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const cid = params.cid as string;
  const qid = params.qid as string;
  const isNew = searchParams.get("new") === "true";
  const activeTab = pathname?.includes("/Questions") ? "questions" : "details";

  const [quiz, setQuiz] = useState<client.Quiz | null>(null);
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    points: 0,
    quizType: "Graded Quiz",
    assignmentGroup: "Quizzes",
    shuffleAnswers: true,
    timeLimitEnabled: true,
    timeLimitMinutes: 20,
    multipleAttempts: false,
    howManyAttempts: 1,
    showCorrectAnswers: false,
    accessCode: "",
    oneQuestionAtATime: true,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
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
        quizType: data.quizType ?? "Graded Quiz",
        assignmentGroup: data.assignmentGroup ?? "Quizzes",
        shuffleAnswers: data.shuffleAnswers ?? false,
        timeLimitEnabled: (data.timeLimit ?? 0) > 0,
        timeLimitMinutes: data.timeLimit ?? 0,
        multipleAttempts: data.multipleAttempts ?? false,
        howManyAttempts: data.howManyAttempts ?? 1,
        showCorrectAnswers: data.showCorrectAnswers ?? false,
        accessCode: data.accessCode ?? "",
        oneQuestionAtATime: data.oneQuestionAtATime ?? false,
        webcamRequired: data.webcamRequired ?? false,
        lockQuestionsAfterAnswering: data.lockQuestionAfterAnswering ?? false,
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
      quizType: form.quizType,
      assignmentGroup: form.assignmentGroup,
      shuffleAnswers: form.shuffleAnswers,
      timeLimit: form.timeLimitEnabled ? Number(form.timeLimitMinutes) : 0,
      multipleAttempts: form.multipleAttempts,
      howManyAttempts: form.howManyAttempts,
      showCorrectAnswers: form.showCorrectAnswers,
      accessCode: form.accessCode,
      oneQuestionAtATime: form.oneQuestionAtATime,
      webcamRequired: form.webcamRequired,
      lockQuestionsAfterAnswering: form.lockQuestionsAfterAnswering,
      due: form.due || undefined,
      availableDate: form.availableDate || undefined,
      untilDate: form.untilDate || undefined,
    };
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

  const handleCancel = async () => {
    if (isNew && qid) {
      try {
        await client.deleteQuiz(qid);
      } catch (error) {
        console.error("Error deleting new quiz on cancel:", error);
      }
    }
    router.push(`/Courses/${cid}/Quizzes`);
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

        <Form.Group className="mb-3" controlId="quizType">
          <Form.Label>Quiz Type</Form.Label>
          <Form.Select
            value={form.quizType}
            onChange={(e) => handleChange("quizType", e.target.value)}
          >
            <option value="Graded Quiz">Graded Quiz</option>
            <option value="Practice Quiz">Practice Quiz</option>
            <option value="Graded Survey">Graded Survey</option>
            <option value="Ungraded Survey">Ungraded Survey</option>
          </Form.Select>
        </Form.Group>

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

        <Form.Group className="mb-3" controlId="assignmentGroup">
          <Form.Label>Assignment Group</Form.Label>
          <Form.Select
            value={form.assignmentGroup}
            onChange={(e) => handleChange("assignmentGroup", e.target.value)}
          >
            <option value="Quizzes">Quizzes</option>
            <option value="Exams">Exams</option>
            <option value="Assignments">Assignments</option>
            <option value="Projects">Projects</option>
          </Form.Select>
        </Form.Group>

        <h5 className="mb-3">Options</h5>

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

        <Row>
            <Col md={2}>
                <Form.Check
                  type="checkbox"
                  label="Time limit"
                  className="me-2"
                  checked={form.timeLimitEnabled}
                  onChange={(e) =>
                    handleChange("timeLimitEnabled", e.target.checked)
                  }
                  />
            </Col>
            <Col md={2}>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="number"
                    style={{ width: "60px" }}
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
            </Col>
        </Row>

        <Form.Group className="mb-3" controlId="multipleAttempts">
          <Form.Check
            type="checkbox"
            label="Allow multiple attempts"
            checked={form.multipleAttempts}
            onChange={(e) =>
              handleChange("multipleAttempts", e.target.checked)
            }
          />
          {form.multipleAttempts && (
            <div className="mt-2">
              <Form.Label>Number of attempts allowed</Form.Label>
              <Form.Control
                type="number"
                value={form.howManyAttempts}
                onChange={(e) =>
                  handleChange("howManyAttempts", Number(e.target.value) || 0)
                }
              />
            </div>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="showCorrectAnswers">
          <Form.Check
            type="checkbox"
            label="Show correct answers after quiz is completed"
            checked={form.showCorrectAnswers}
            onChange={(e) =>
              handleChange("showCorrectAnswers", e.target.checked)
            }
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="accessCode">
          <Form.Label>Access Code</Form.Label>
          <Form.Control
            type="text"
            value={form.accessCode}
            onChange={(e) => handleChange("accessCode", e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="oneQuestionAtATime">
          <Form.Check
            type="checkbox"
            label="One question at a time"
            checked={form.oneQuestionAtATime}
            onChange={(e) =>
              handleChange("oneQuestionAtATime", e.target.checked)
            }
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="webcamRequired">
          <Form.Check
            type="checkbox"
            label="Webcam required"
            checked={form.webcamRequired}
            onChange={(e) =>
              handleChange("webcamRequired", e.target.checked)
            }
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="lockQuestionsAfterAnswering">
          <Form.Check
            type="checkbox"
            label="Lock questions after answering"
            checked={form.lockQuestionsAfterAnswering}
            onChange={(e) =>
              handleChange("lockQuestionsAfterAnswering", e.target.checked)
            }
          />
        </Form.Group>

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
