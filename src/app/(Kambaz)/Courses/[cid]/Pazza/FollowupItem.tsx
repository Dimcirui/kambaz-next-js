"use client";

import { useState } from "react";
import { Button, Card, Form, Badge } from "react-bootstrap";
import { FaCheck, FaReply, FaUserCircle } from "react-icons/fa";

interface Reply {
  author: string;
  text: string;
  date: string;
}

interface Followup {
  _id?: string;
  author: string;
  text: string;
  date: string;
  resolved: boolean;
  replies: Reply[];
}

interface FollowupItemProps {
  followup: Followup;
  onResolveToggle: () => void;
  onReply: (text: string) => void;
}

export default function FollowupItem({ followup, onResolveToggle, onReply }: FollowupItemProps) {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);

  const handleSubmitReply = () => {
    if (!replyText.trim()) return;
    onReply(replyText);
    setReplyText("");
    setShowReplyInput(false);
  };

  return (
    <Card className="mb-3 border-0 bg-light shadow-sm">
      <Card.Body>
        {/* --- Header: Resolved Status & Author --- */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="d-flex align-items-center gap-2">
            <span className="fw-bold text-dark">{followup.author}</span>
            <span className="text-muted small">{new Date(followup.date).toLocaleString()}</span>
          </div>
          
          <div 
            className={`cursor-pointer badge ${followup.resolved ? "bg-success" : "bg-danger"}`}
            style={{ cursor: "pointer" }}
            onClick={onResolveToggle}
          >
            {followup.resolved ? <><FaCheck className="me-1"/> Resolved</> : "Unresolved"}
          </div>
        </div>

        {/* --- Discussion Content --- */}
        <div className="mb-3 text-dark">
          {followup.text}
        </div>

        {/* --- Replies List (Nested) --- */}
        {followup.replies.length > 0 && (
          <div className="ps-3 border-start border-3 border-secondary mb-3">
            {followup.replies.map((reply, idx) => (
              <div key={idx} className="mb-2 bg-white p-2 rounded">
                <div className="d-flex gap-2 text-muted small mb-1">
                  <FaUserCircle /> <strong>{reply.author}</strong>
                  <span>{new Date(reply.date).toLocaleDateString()}</span>
                </div>
                <div>{reply.text}</div>
              </div>
            ))}
          </div>
        )}

        {/* --- Reply Input Area --- */}
        {showReplyInput ? (
          <div className="mt-2">
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Compose a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="mb-2"
            />
            <div className="d-flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => setShowReplyInput(false)}>Cancel</Button>
              <Button size="sm" variant="primary" onClick={handleSubmitReply}>Reply</Button>
            </div>
          </div>
        ) : (
          <Button 
            variant="link" 
            className="p-0 text-decoration-none text-muted"
            onClick={() => setShowReplyInput(true)}
          >
            <FaReply className="me-1"/> Reply to this discussion
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}