"use client";

import { useState } from "react";
import { Button, Card, Form, Nav, Alert, Badge } from "react-bootstrap";
import RichTextEditor from "./RichTextEditor";

interface PostEditorProps {
  onCancel: () => void;
  onSave: (post: any) => void;
  availableFolders: string[];
}

export default function PostEditor({ onCancel, onSave, availableFolders }: PostEditorProps) {
  const [postType, setPostType] = useState<"QUESTION" | "NOTE">("QUESTION");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleFolderChange = (folder: string) => {
    if (selectedFolders.includes(folder)) {
      setSelectedFolders(selectedFolders.filter((f) => f !== folder));
    } else {
      setSelectedFolders([...selectedFolders, folder]);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setError("Summary is required.");
      return;
    }
    if (selectedFolders.length === 0) {
      setError("Please select at least one folder.");
      return;
    }
    if (!details.trim()) {
      setError("Details are required.");
      return;
    }

    const newPost = {
      title,
      details,
      type: postType,
      folders: selectedFolders,
      author: "Me", // hardcoded for now
    };

    onSave(newPost);
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm h-100">
      <h3 className="mb-4">New Post</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* 1. Post Type Tabs */}
      <div className="mb-3">
        <span className="fw-bold me-3">Post Type:</span>
        <div className="btn-group" role="group">
          <input
            type="radio"
            className="btn-check"
            id="type-question"
            checked={postType === "QUESTION"}
            onChange={() => setPostType("QUESTION")}
          />
          <label className={`btn ${postType === "QUESTION" ? "btn-danger" : "btn-outline-secondary"}`} htmlFor="type-question">
            Question
          </label>

          <input
            type="radio"
            className="btn-check"
            id="type-note"
            checked={postType === "NOTE"}
            onChange={() => setPostType("NOTE")}
          />
          <label className={`btn ${postType === "NOTE" ? "btn-warning" : "btn-outline-secondary"}`} htmlFor="type-note">
            Note
          </label>
        </div>
      </div>

      {/* 2. Post To (Simplified) */}
      <div className="mb-3 text-muted small">
        <strong>Post To:</strong> Entire Class (Default)
      </div>

      {/* 3. Select Folders */}
      <Form.Group className="mb-3 p-3 bg-light border rounded">
        <Form.Label className="fw-bold">Select Folder(s):</Form.Label>
        <div className="d-flex flex-wrap gap-3">
          {availableFolders.filter(f => f !== "ALL").map((folder) => (
            <Form.Check
              key={folder}
              type="checkbox"
              id={`folder-${folder}`}
              label={folder}
              checked={selectedFolders.includes(folder)}
              onChange={() => handleFolderChange(folder)}
            />
          ))}
        </div>
      </Form.Group>

      {/* 4. Summary (Title) */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">Summary</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter a one line summary (Title)..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Form.Group>

      {/* 5. Details */}
      <Form.Group className="mb-4">
        <Form.Label className="fw-bold">Details</Form.Label>
        <RichTextEditor 
            value={details} 
            onChange={setDetails} 
            placeholder="Enter detailed description..." 
        />

        <Form.Text className="text-muted mt-2 d-block">
          * Supported: Bold, Italic, Lists, Images, etc.
        </Form.Text>
      </Form.Group>

      {/* Buttons */}
      <div className="d-flex gap-2 justify-content-end border-top pt-3">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Post My {postType === "QUESTION" ? "Question" : "Note"}
        </Button>
      </div>
    </div>
  );
}