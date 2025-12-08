'use client';

import { useState } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { FaCheck, FaPlus, FaTrash } from "react-icons/fa6";
import * as client from "../../client";


export default function QuestionEditor({
    question,
    onSave,
    onCancel,
} : {
    question: client.Question;
    onSave: () => void;
    onCancel: () => void;
}) {
    const [editedQuestion, setEditedQuestion] = useState<client.Question>({
        ...question,
        choices: question.choices || [],
        correctAnswer: question.correctAnswer || [],
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setEditedQuestion({ ...editedQuestion, [name]: value });
    };

    // Choice and true/false questions
    const handleOptionsChange = (index: number, field: string, value: any) => {
        const newOptions = [...(editedQuestion.choices || [])];
        if (field === "isCorrect") {
            newOptions.forEach((choice) => (choice.isCorrect = false));
            newOptions[index].isCorrect = value;
        } else {
            newOptions[index] = { ...newOptions[index], [field]: value };
        }
        setEditedQuestion({ ...editedQuestion, choices: newOptions });
    };

    const addOption = () => {
        setEditedQuestion({
            ...editedQuestion,
            choices: [...(editedQuestion.choices || []), { text: "", isCorrect: false }],
        });
    };

    const removeOptions = (index: number) => {
        const newOptions = (editedQuestion.choices || []).filter((_, i) => i !== index);
        setEditedQuestion({ ...editedQuestion, choices: newOptions });
    };

    // Fill in question
    const handleBlankAnswerChange = (index: number, value: string) => {
        const newAnswers = [...(editedQuestion.correctAnswer || [])];
        newAnswers[index] = value;
        setEditedQuestion({ ...editedQuestion, correctAnswer: newAnswers });
    };

    const addBlankAnswer = () => {
        setEditedQuestion({
            ...editedQuestion,
            correctAnswer: [...(editedQuestion.correctAnswer || []), ""],
        });
    };

    const removeBlankAnswer = (index: number) => {
        const newAnswers = (editedQuestion.correctAnswer || []).filter((_, i) => i !== index);
        setEditedQuestion({ ...editedQuestion, correctAnswer: newAnswers });
    };

    // Saving
    const handleSave = async () => {
        if (editedQuestion._id) {
            await client.updateQuestion(editedQuestion);
        }
        onSave();
    };

    return (
        <div className="border p-3 mb-4">
            {/* Header */}
            <Row className="mb-3 align-items-center">
                <Col md={3}>
                    <Form.Control
                        name="title"
                        value={editedQuestion.title}
                        onChange={handleChange}
                        placeholder="Question Title"
                    />
                </Col>

                <Col md={3}>
                    <Form.Select
                        name="type"
                        value={editedQuestion.type}
                        onChange={(e: any) =>
                            setEditedQuestion({
                                ...editedQuestion,
                                type: e.target.value,
                                choices: [],
                                correctAnswer: [],
                            })
                        }
                    >
                        <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                        <option value="TRUE_FALSE">True / False</option>
                        <option value="FILL_IN_THE_BLANK">Fill in the Blank</option>
                    </Form.Select>
                </Col>

                <Col md={3}>
                    <InputGroup>
                        <InputGroup.Text>Points</InputGroup.Text>
                        <Form.Control
                            name="points"
                            type="number"
                            value={editedQuestion.points}
                            onChange={handleChange}
                        />
                    </InputGroup>
                </Col>
            </Row>

            <Form.Group className="mb-3" controlId="questionText">
                <Form.Label>Question:</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    name="text"
                    value={editedQuestion.text}
                    onChange={handleChange}
                />
            </Form.Group>

            <div className="mb-4">
                <h5>Answers:</h5>
                {/* Multiple Choice */}
                {editedQuestion.type === "MULTIPLE_CHOICE" && (
                    <div>
                        {editedQuestion.choices?.map((choice, index) => (
                            <InputGroup key={index} className="mb-2">
                                <InputGroup.Text className="bg-white">
                                    <input
                                        type="radio"
                                        className="form-check-input mt-0"
                                        name="correctAnswer"
                                        checked={choice.isCorrect}
                                        onChange={() => handleOptionsChange(index, "isCorrect", true)}
                                        style={{ cursor: "pointer" }}
                                        aria-label="Mark as correct answer"
                                    />
                                </InputGroup.Text>
                                
                                <Form.Control
                                    value={choice.text}
                                    onChange={(e: any) =>
                                        handleOptionsChange(index, "text", e.target.value)
                                    }
                                />

                                <Button
                                    variant="outline-danger"
                                    onClick={() => removeOptions(index)}
                                >
                                    <FaTrash />
                                </Button>

                                {choice.isCorrect && (
                                    <InputGroup.Text className="bg-success text-white">
                                        <FaCheck />
                                    </InputGroup.Text>
                                )}
                            </InputGroup>
                        ))}
                        <div className="text-end">
                            <Button variant="secondary" onClick={addOption}>
                                <FaPlus className="me-2" /> Add Another Answer
                            </Button>
                        </div>
                    </div>
                )}

                {/* True-False */}
                {editedQuestion.type === "TRUE_FALSE" && (
                    <div>
                        {["True", "False"].map((val) => {
                            const isSelected =
                                editedQuestion.choices?.find((o) => o.text === val)
                                    ?.isCorrect || false;
                            
                            return (
                                <Form.Check
                                    key={val}
                                    type="radio"
                                    label={val}
                                    name="trueFalseAnswer"
                                    className={`mb-2 p-2 rounded ${
                                        isSelected ? "bg-success-subtle border border-success" : ""
                                    }`}
                                    checked={isSelected}
                                    onChange={() => {
                                        setEditedQuestion({
                                            ...editedQuestion,
                                            choices: [
                                                { text: "True", isCorrect: val === "True" },
                                                { text: "False", isCorrect: val === "False" },
                                            ],
                                        });
                                    }}
                                />
                            );
                        })}
                    </div>
                )}

                {/* Fill in the Blank */}
                {editedQuestion.type === "FILL_IN_THE_BLANK" && (
                    <div>
                        <p className="text-muted">
                            Enter all acceptable answers for the blank(s).
                        </p>
                        {editedQuestion.correctAnswer?.map((answer, index) => (
                            <InputGroup key={index} className="mb-2">
                                <InputGroup.Text>Answer</InputGroup.Text>
                                <Form.Control
                                    value={answer}
                                    onChange={(e: any) => handleBlankAnswerChange(index, e.target.value)}
                                />
                                <Button
                                    variant="outline-danger"
                                    onClick={() => removeBlankAnswer(index)}
                                >
                                    <FaTrash />
                                </Button>
                            </InputGroup>
                        ))}
                        <div className="text-end">
                            <Button
                                variant="link"
                                className="text-danger text-decoration-none"
                                onClick={addBlankAnswer}
                            >
                                <FaPlus className="me-2" /> Add Correct Answer
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Save and Cancel */}
            <div className="d-flex gap-2">
                <Button variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save
                </Button>
            </div>
        </div>
    );
}