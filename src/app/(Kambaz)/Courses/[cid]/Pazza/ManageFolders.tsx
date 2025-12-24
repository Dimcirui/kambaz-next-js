"use client";

import { useState, useEffect } from "react";
import { Button, Form, ListGroup, InputGroup } from "react-bootstrap";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import * as client from "./client";

interface ManageFoldersProps {
    cid: string;
    folders: client.PazzaFolder[];
    onFoldersChange: () => void;
}

export default function ManageFolders({ cid, folders, onFoldersChange }: ManageFoldersProps) {
    const [newFolderName, setNewFolderName] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");

    const handleCreate = async () => {
        if (!newFolderName.trim()) return;
        await client.createFolder(cid, newFolderName);
        setNewFolderName("");
        onFoldersChange();
    };

    const handleDelete = async (fid: string) => {
        if (!confirm("Are you sure? Posts in this folder might lose their tag.")) return;
        await client.deleteFolder(fid);
        onFoldersChange();
    };

    const startEdit = (folder: client.PazzaFolder) => {
        setEditingId(folder._id);
        setEditName(folder.name);
    };

    const saveEdit = async (fid: string) => {
        if (!editName.trim()) return;
        await client.updateFolder(fid, editName);
        setEditingId(null);
        onFoldersChange();
    };

    return (
        <div className="p-4 bg-white rounded shadow-sm">
            <h3 className="mb-4">Manage Class Folders</h3>
            
            {/* Add New Folder */}
            <div className="mb-4 p-3 bg-light border rounded">
                <Form.Label className="fw-bold">Create New Folder</Form.Label>
                <InputGroup>
                    <Form.Control
                        placeholder="e.g. Week 1, Midterm, Project..."
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                    />
                    <Button variant="primary" onClick={handleCreate} disabled={!newFolderName.trim()}>
                        Add Folder
                    </Button>
                </InputGroup>
            </div>

            {/* List of Folders */}
            <h5 className="mb-3">Current Folders</h5>
            <ListGroup>
                {folders.length === 0 && <div className="text-muted p-2">No folders defined yet.</div>}
                
                {folders.map((folder) => (
                    <ListGroup.Item key={folder._id} className="d-flex justify-content-between align-items-center">
                        {editingId === folder._id ? (
                            /* Edit Mode */
                            <div className="d-flex w-100 gap-2">
                                <Form.Control 
                                    value={editName} 
                                    onChange={(e) => setEditName(e.target.value)} 
                                />
                                <Button variant="success" size="sm" onClick={() => saveEdit(folder._id)}><FaCheck /></Button>
                                <Button variant="secondary" size="sm" onClick={() => setEditingId(null)}><FaTimes /></Button>
                            </div>
                        ) : (
                            /* View Mode */
                            <>
                                <span className="fw-bold">{folder.name}</span>
                                <div>
                                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => startEdit(folder)}>
                                        <FaEdit />
                                    </Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(folder._id)}>
                                        <FaTrash />
                                    </Button>
                                </div>
                            </>
                        )}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
}