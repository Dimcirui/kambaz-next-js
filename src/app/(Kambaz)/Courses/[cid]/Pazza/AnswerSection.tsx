"use client";

import { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { FaEdit, FaUserCircle } from "react-icons/fa";

// 定义回答的数据结构
interface Answer {
  text: string;
  author: string;
  date: string;
}

interface AnswerSectionProps {
  title: string; // "Student Answer" 或 "Instructor Answer"
  answer: Answer | undefined; // 可能还没有回答
  onSave: (text: string) => void;
  isEditable: boolean; // 是否允许当前用户编辑
  variant?: "student" | "instructor"; // 样式变体
}

export default function AnswerSection({ 
  title, 
  answer, 
  onSave, 
  isEditable = true,
  variant = "student" 
}: AnswerSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(answer?.text || "");

  const handleStartAnswering = () => {
    setIsEditing(true);
    setText("");
  };

  const handleSave = () => {
    onSave(text);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setText(answer?.text || "");
  };

  const headerBg = variant === "instructor" ? "bg-warning-subtle" : "bg-primary-subtle";
  const borderColor = variant === "instructor" ? "border-warning" : "border-primary";

  return (
    <Card className={`mb-4 shadow-sm border-0`}>
      <Card.Header className={`fw-bold d-flex justify-content-between align-items-center ${headerBg}`}>
        <span>{title}</span>
        {answer && !isEditing && isEditable && (
          <Button variant="link" size="sm" className="text-dark p-0" onClick={() => setIsEditing(true)}>
            <FaEdit /> Edit
          </Button>
        )}
      </Card.Header>

      <Card.Body>
        {isEditing ? (
          /* --- Edit Mode --- */
          <div>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={5}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write your answer here..."
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" size="sm" onClick={handleCancel}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={handleSave}>Submit Answer</Button>
            </div>
          </div>
        ) : answer ? (
          /* --- View Mode (Existing Answer) --- */
          <div>
            <div className="mb-3" style={{ whiteSpace: "pre-wrap" }}>
              {answer.text}
            </div>
            <div className="d-flex align-items-center text-muted small border-top pt-2">
              <FaUserCircle className="me-1" />
              <span className="fw-bold me-2">{answer.author}</span>
              <span>answered on {new Date(answer.date).toLocaleString()}</span>
            </div>
          </div>
        ) : (
          /* --- Null State (No Answer) --- */
          <div className="text-center py-3 text-muted">
            <p className="mb-2">No answer yet.</p>
            {isEditable && (
              <Button variant="outline-primary" size="sm" onClick={handleStartAnswering}>
                Compose {title}
              </Button>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}