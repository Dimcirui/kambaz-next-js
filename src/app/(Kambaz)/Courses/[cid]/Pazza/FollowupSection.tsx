"use client";

import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import FollowupItem from "./FollowupItem";

interface Followup {
  _id?: string;
  author: string;
  text: string;
  date: string;
  resolved: boolean;
  replies: any[];
}

interface FollowupSectionProps {
  followups: Followup[];
  onUpdate: (newFollowups: Followup[]) => void;
}

export default function FollowupSection({ followups, onUpdate }: FollowupSectionProps) {
  const [newDiscussionText, setNewDiscussionText] = useState("");

  const handleCreateDiscussion = () => {
    if (!newDiscussionText.trim()) return;

    const newFollowup: Followup = {
      author: "Me", 
      text: newDiscussionText,
      date: new Date().toISOString(),
      resolved: false,
      replies: []
    };

    onUpdate([...followups, newFollowup]);
    setNewDiscussionText("");
  };

  const toggleResolve = (index: number) => {
    const updated = [...followups];
    updated[index].resolved = !updated[index].resolved;
    onUpdate(updated);
  };

  const handleReply = (index: number, text: string) => {
    const updated = [...followups];
    updated[index].replies.push({
      author: "Me",
      text: text,
      date: new Date().toISOString()
    });
    onUpdate(updated);
  };

  const handleDeleteFollowup = (index: number) => {
    if (!window.confirm("Delete this discussion?")) return;
    
    const updated = [...followups];
    updated.splice(index, 1);
    onUpdate(updated);
  };

  return (
    <div className="mt-5">
      <h5 className="mb-3 text-secondary">Follow-up Discussions</h5>

      {/* Render list */}
      {followups.map((followup, idx) => (
        <div key={idx} className="position-relative">
            <FollowupItem 
                followup={followup}
                onResolveToggle={() => toggleResolve(idx)}
                onReply={(text) => handleReply(idx, text)}
            />
            <Button 
                variant="link" 
                className="text-danger p-0 position-absolute" 
                style={{ top: '10px', right: '100px' }}
                onClick={() => handleDeleteFollowup(idx)}
            >
                Delete
            </Button>
        </div>
      ))}

      {/* Bottom Input Area */}
      <div className="bg-white p-3 border rounded shadow-sm mt-3">
        <Form.Group className="mb-2">
          <Form.Control
            as="textarea"
            rows={1}
            placeholder="Start a new followup discussion..."
            value={newDiscussionText}
            onChange={(e) => setNewDiscussionText(e.target.value)}
          />
        </Form.Group>
        <div className="d-flex justify-content-end">
            <Button 
                variant="primary" 
                size="sm" 
                disabled={!newDiscussionText.trim()}
                onClick={handleCreateDiscussion}
            >
                Post Discussion
            </Button>
        </div>
      </div>
    </div>
  );
}