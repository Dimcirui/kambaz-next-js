"use client";

import { Container, Row, Col, Card } from "react-bootstrap";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Calendar() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const date = new Date();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Calendar</h2>
        <div className="d-flex align-items-center gap-3">
          <FaChevronLeft className="cursor-pointer" />
          <h4 className="mb-0">{month} {year}</h4>
          <FaChevronRight className="cursor-pointer" />
        </div>
      </div>
      <Card className="shadow-sm">
        <Card.Body className="p-0">
          <Row className="g-0 border-bottom bg-light text-center fw-bold py-2">
            {days.map(day => (
              <Col key={day} className="py-2 border-end">{day}</Col>
            ))}
          </Row>
          {/* Simple dummy grid for visualization */}
          {[...Array(5)].map((_, i) => (
            <Row key={i} className="g-0 border-bottom" style={{ height: "120px" }}>
              {[...Array(7)].map((_, j) => (
                <Col key={j} className="border-end p-2 text-end text-muted small">
                  {i * 7 + j + 1 <= 31 ? i * 7 + j + 1 : ""}
                </Col>
              ))}
            </Row>
          ))}
        </Card.Body>
      </Card>
      <div className="mt-4 p-3 bg-light rounded text-center text-muted">
        <FaCalendarAlt className="me-2" />
        No upcoming events or assignments for this month.
      </div>
    </Container>
  );
}
