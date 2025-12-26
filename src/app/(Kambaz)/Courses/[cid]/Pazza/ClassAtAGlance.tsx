"use client";

import { Card, ProgressBar, Row, Col, ListGroup } from "react-bootstrap";
import { FaCheckCircle, FaExclamationCircle, FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";
import { PazzaPost } from "./client";

interface ClassAtAGlanceProps {
  posts: PazzaPost[];
}

export default function ClassAtAGlance({ posts }: ClassAtAGlanceProps) {
  const totalPosts = posts.length;
  
  const unansweredCount = posts.filter(
    (p) => p.type === "QUESTION" && !p.instructorAnswer && !p.studentAnswer
  ).length;

  const instructorResponseCount = posts.filter((p) => p.instructorAnswer).length;

  const studentResponseCount = posts.filter((p) => p.studentAnswer).length;

  const enrollmentCount = 106; 

  return (
    <div className="h-100 p-4 bg-white shadow-sm overflow-auto">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 text-secondary">
           Class at a Glance
        </h2>
        <small className="text-muted">Updated just now</small>
      </div>

      {/* --- Top Section: Status Indicators --- */}
      <Card className="mb-4 border-0 bg-light">
        <Card.Body>
           <div className="mb-2 text-success fw-bold">
               <FaCheckCircle className="me-2" />
               no unread posts
           </div>
           
           <div className={`mb-2 fw-bold ${unansweredCount > 0 ? "text-danger" : "text-success"}`}>
               {unansweredCount > 0 ? (
                   <>
                       <FaExclamationCircle className="me-2" />
                       {unansweredCount} unanswered question{unansweredCount > 1 ? "s" : ""}
                   </>
               ) : (
                   <>
                       <FaCheckCircle className="me-2" />
                       no unanswered questions
                   </>
               )}
           </div>

           <div className="text-success fw-bold">
               <FaCheckCircle className="me-2" />
               no unanswered followups
           </div>
        </Card.Body>
      </Card>

      <Row>
          {/* --- Left Column: Enrollment --- */}
          <Col md={12} lg={6} className="mb-4">
              <h5 className="text-secondary mb-3">Student Enrollment</h5>
              <div className="p-3 border rounded">
                  <div className="d-flex justify-content-between mb-2">
                      <strong>{enrollmentCount} enrolled</strong>
                      <span className="text-muted">out of 150 (estimated)</span>
                  </div>
                  <ProgressBar now={(enrollmentCount / 150) * 100} variant="success" className="mb-3" />
                  <small className="text-muted">
                      Join the class to participate in discussions.
                  </small>
              </div>
          </Col>

          {/* --- Right Column: Statistics --- */}
          <Col md={12} lg={6} className="mb-4">
              <h5 className="text-secondary mb-3">Statistics</h5>
              <ListGroup variant="flush" className="border rounded">
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>Total Posts</span>
                      <span className="badge bg-secondary rounded-pill">{totalPosts}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>Total Contributions</span>
                      <span className="badge bg-secondary rounded-pill">
                          {totalPosts + instructorResponseCount + studentResponseCount}
                      </span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>
                          <FaChalkboardTeacher className="me-2 text-warning" />
                          Instructors' Responses
                      </span>
                      <span className="fw-bold">{instructorResponseCount}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>
                          <FaUserGraduate className="me-2 text-primary" />
                          Students' Responses
                      </span>
                      <span className="fw-bold">{studentResponseCount}</span>
                  </ListGroup.Item>
              </ListGroup>
          </Col>
      </Row>

      {/* --- Footer Note --- */}
      <div className="mt-4 p-3 bg-secondary-subtle rounded text-center text-muted small">
          Introducing AI-Generated Summaries for Followups and Folders (Coming Soon)
      </div>
    </div>
  );
}