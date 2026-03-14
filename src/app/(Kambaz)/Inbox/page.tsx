"use client";

import { Container, ListGroup, Card, Badge } from "react-bootstrap";
import { FaInbox, FaEnvelope } from "react-icons/fa";

export default function Inbox() {
  const messages = [
    { id: 1, from: "System", subject: "Welcome to Kambaz", date: "2024-03-01", unread: true },
    { id: 2, from: "Instructor", subject: "Assignment 1 Reminder", date: "2024-03-05", unread: false },
  ];

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Inbox</h2>
      </div>
      <Row>
        <Col md={4}>
           <Card className="shadow-sm">
             <ListGroup variant="flush">
                <ListGroup.Item action active className="d-flex justify-content-between align-items-center">
                    <div><FaInbox className="me-2" /> Inbox</div>
                    <Badge bg="light" text="dark">1</Badge>
                </ListGroup.Item>
                <ListGroup.Item action>Sent</ListGroup.Item>
                <ListGroup.Item action>Archived</ListGroup.Item>
             </ListGroup>
           </Card>
        </Col>
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body className="p-0">
               <ListGroup variant="flush">
                  {messages.map(msg => (
                    <ListGroup.Item key={msg.id} action className={msg.unread ? "fw-bold" : ""}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <FaEnvelope className={`me-2 ${msg.unread ? "text-primary" : "text-muted"}`} />
                          {msg.from}
                        </div>
                        <small className="text-muted">{msg.date}</small>
                      </div>
                      <div className="ps-4 small text-secondary">{msg.subject}</div>
                    </ListGroup.Item>
                  ))}
               </ListGroup>
               {messages.length === 0 && (
                 <div className="p-5 text-center text-muted">
                    Your inbox is empty.
                 </div>
               )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

// Helper to fix the Row/Col import if not available globally
import { Row, Col } from "react-bootstrap";
