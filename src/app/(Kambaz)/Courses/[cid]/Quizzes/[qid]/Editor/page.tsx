'use client';

import { useParams } from "next/navigation";
import { useState } from "react";
import { Container, Nav, Tab } from "react-bootstrap";


export default function QuizEditor() {
    const { cid, qid } = useParams();
    const [key, setKey] = useState("questions");

    return (
        <Container id="wd-quiz-editor" className="p-4">
            <h2>Quiz Editor</h2>

            <Tab.Container activeKey={key} onSelect={(k) => setKey(k || "questions")}>
                <Nav variant="tabs" className="mb-3">
                    <Nav.Item>
                        <Nav.Link eventKey="questions">Questions</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="settings">Settings</Nav.Link>
                    </Nav.Item>
                </Nav>

                <Tab.Content>
                    <Tab.Pane eventKey="questions">
                        <div>Questions Editor for Quiz ID: {qid} in Course ID: {cid}</div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="settings">
                        <div>Settings Editor for Quiz ID: {qid} in Course ID: {cid}</div>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </Container>
    );
}