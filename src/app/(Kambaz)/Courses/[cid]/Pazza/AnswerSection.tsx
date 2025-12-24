"use client";

import { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { FaEdit, FaUserCircle } from "react-icons/fa";
import RichTextEditor from "./RichTextEditor";

interface Answer {
  text: string;
  author: string;
  date: string;
}

interface AnswerSectionProps {
  title: string;
  answer: Answer | undefined;
  onSave: (text: string) => void;
  isEditable: boolean;
  variant?: "student" | "instructor";
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
              <RichTextEditor 
                  value={text} 
                  onChange={setText} 
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
            <div 
                    className="mb-3 ql-editor"
                    style={{ padding: 0 }}
                    dangerouslySetInnerHTML={{ __html: answer.text }}
                />
            
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