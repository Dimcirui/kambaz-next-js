"use client";

import { useState } from "react";
import { Button, Form, InputGroup, Nav, Table } from "react-bootstrap";
import { FaCheck, FaTimes, FaEdit } from "react-icons/fa";
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
    
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const handleCreate = async () => {
        if (!newFolderName.trim()) return;
        try {
            await client.createFolder(cid, newFolderName);
            setNewFolderName("");
            onFoldersChange();
        } catch (err) {
            alert("Failed to create folder");
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.size === 0) return;
        if (!confirm(`Are you sure you want to delete ${selectedIds.size} folders? Posts in these folders will lose their category.`)) return;

        try {
            await Promise.all(
                Array.from(selectedIds).map(id => client.deleteFolder(id))
            );
            setSelectedIds(new Set());
            onFoldersChange();
        } catch (err) {
            alert("Failed to delete some folders");
        }
    };

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const startEdit = (folder: client.PazzaFolder) => {
        setEditingId(folder._id);
        setEditName(folder.name);
    };

    const saveEdit = async (fid: string) => {
        if (!editName.trim()) return;
        try {
            await client.updateFolder(fid, editName);
            setEditingId(null);
            onFoldersChange();
        } catch (err) {
            alert("Failed to update folder");
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName("");
    };

    return (
        <div className="bg-white rounded shadow-sm h-100 d-flex flex-column">
            {/* Top Navigation */}
            <div className="border-bottom px-3 pt-3 bg-light">
                <Nav variant="tabs" defaultActiveKey="folders">
                    <Nav.Item>
                        <Nav.Link disabled>General Settings</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="folders" active className="fw-bold text-dark bg-white border-bottom-0">
                            Manage Folders
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link disabled>Manage Enrollment</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link disabled>Statistics</Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>

            <div className="p-4 overflow-auto">
                <h3 className="mb-4 fw-bold">Configure Class Folders</h3>
                
                <p className="text-secondary mb-4 small">
                    Folders allow you to keep class content organized. When students and instructors add a new post, 
                    they will be required to specify at least one folder for their post.
                </p>

                {/* --- Add New Folder Section --- */}
                <div className="mb-5">
                    <h5 className="fw-bold mb-3 text-white bg-primary p-2 rounded d-inline-block">
                        Create new folders
                    </h5>
                    <div className="p-3 bg-light border rounded">
                        <Form.Label className="text-muted small">
                            Add folders that are relevant for your class. (e.g. hw1, project, exam)
                        </Form.Label>
                        <InputGroup className="mb-3" style={{ maxWidth: "500px" }}>
                            <Form.Control
                                placeholder="Add a folder..."
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                            />
                            <Button variant="primary" onClick={handleCreate} disabled={!newFolderName.trim()}>
                                Add Folder
                            </Button>
                        </InputGroup>
                    </div>
                </div>

                {/* --- Manage Folders List --- */}
                <div>
                    <h5 className="fw-bold mb-3 text-dark">Manage folders:</h5>
                    <p className="text-muted small mb-3">
                        Rename, delete, or edit folder names. Select folders to delete multiple at once.
                    </p>
                    
                    {/* Delete Button (Visible only when items selected) */}
                    <div className="mb-2" style={{ height: "38px" }}>
                        {selectedIds.size > 0 && (
                            <Button variant="danger" size="sm" onClick={handleBulkDelete}>
                                Delete {selectedIds.size} Selected Folder(s)
                            </Button>
                        )}
                    </div>

                    <Table hover className="align-middle" style={{ maxWidth: "800px" }}>
                        <tbody>
                            {folders.map((folder) => (
                                <tr key={folder._id}>
                                    {/* Checkbox Column */}
                                    <td style={{ width: "40px" }}>
                                        <Form.Check 
                                            type="checkbox" 
                                            checked={selectedIds.has(folder._id)}
                                            onChange={() => toggleSelection(folder._id)}
                                        />
                                    </td>

                                    {/* Name / Edit Input Column */}
                                    <td>
                                        {editingId === folder._id ? (
                                            <Form.Control
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                autoFocus
                                            />
                                        ) : (
                                            <span className="badge bg-secondary-subtle text-dark border fs-6 fw-normal px-3 py-2">
                                                {folder.name}
                                            </span>
                                        )}
                                    </td>

                                    {/* Actions Column */}
                                    <td style={{ width: "180px" }} className="text-end">
                                        {editingId === folder._id ? (
                                            <div className="d-flex gap-2 justify-content-end">
                                                <Button variant="success" size="sm" onClick={() => saveEdit(folder._id)}>
                                                    <FaCheck className="me-1" /> Save
                                                </Button>
                                                <Button variant="secondary" size="sm" onClick={cancelEdit}>
                                                    <FaTimes className="me-1" /> Cancel
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button 
                                                variant="outline-secondary" 
                                                size="sm" 
                                                className="border-0 text-muted"
                                                onClick={() => startEdit(folder)}
                                            >
                                                <FaEdit className="me-1" /> Edit
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {folders.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center text-muted py-4">
                                        No folders yet. Create one above!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    );
}