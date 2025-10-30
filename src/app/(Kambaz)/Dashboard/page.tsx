"use client"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse } from "../Courses/reducer";
import { setEnrollments, enrollCourse, unenrollCourse } from "./reducer";

import { FormControl } from "react-bootstrap";
import React from "react";
import Link from "next/link";
import * as db from "../Database";
import { Card, CardBody, CardImg, CardText, CardTitle, Button, Row, Col } from "react-bootstrap";

export default function Dashboard() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = db;

  const { courses } = useSelector((state: any) => state.coursesReducer);
  const { enrolledCourses } = useSelector((state: any) => state.enrollmentsReducer);
  const dispatch = useDispatch();
  const [course, setCourse] = useState<any>({
    _id: "0", name: "New Course", number: "New Number",
    startDate: "2023-09-10", endDate: "2023-12-15",
    image: "/images/reactjs.jpg", description: "New Description"
  });

  const [showAllCourses, setShowAllCourses] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const userEnrollments = db.enrollments
        .filter((e: any) => e.user === currentUser._id)
        .map((e: any) => e.course);

      dispatch(setEnrollments(userEnrollments));
    } else {
      dispatch(setEnrollments([]));
    }
  }, [currentUser, dispatch]);

  const visibleCourses = showAllCourses ? courses : courses.filter((c: any) => enrolledCourses.includes(c._id));

  return (
    <div className="p-4" id="wd-dashboard">

      <h1 id="wd-dashboard-title">Dashboard</h1>

      <Button
        variant="primary"
        className="float-end"
        onClick={() => setShowAllCourses(!showAllCourses)}
      >
        {showAllCourses ? "Show Enrolled Courses" : "Enrollments"}
      </Button>

      {currentUser && currentUser.role === "FACULTY" && (
        <div id="wd-dashboard-editor">
          <h5>New Course
            <Button className="btn btn-primary float-end"
                    id="wd-add-new-course-click"
                    onClick={() => dispatch(addNewCourse(course))} >
                Add
            </Button>
            <Button className="btn btn-warning float-end me-2"
                    onClick={() => dispatch(updateCourse(course))} id="wd-update-course-click">
                Update
            </Button>

          </h5>
          <FormControl value={course.name} 
                      className="mb-2"
                      onChange={(e) => setCourse({ ...course, name: e.target.value }) } />
          <FormControl value={course.description}
                      as="textarea"
                      rows={3}
                      onChange={(e) => setCourse({ ...course, description: e.target.value }) } />
          <hr />
        </div>
      )}

      <div id="wd-dashboard-courses">
        <h2 id="wd-dashboard-published-courses">
          {showAllCourses ? "All Courses" : "Enrolled Courses"} ({visibleCourses.length})
        </h2> <hr />

        <div id="wd-dashboard-course-list">
            <Row xs={1} md={5} className="g-4">

              {visibleCourses.map((course: any) => {
                const isEnrolled = enrolledCourses.includes(course._id);

                return (
                  <React.Fragment key={course._id}>
                    <Col>
                      <Card className="h-100">

                      <Link href={`/Courses/${course._id}/Home`}
                        className="wd-dashboard-course-link text-decoration-none text-dark"
                        onClick={(e) => {
                          if (!isEnrolled && currentUser?.role !== "FACULTY") {
                            e.preventDefault();
                            alert("You must enroll in this course to access its content.");
                          }
                        }}
                      >
                        <CardImg variant="top" src="/images/reactjs.jpg" width="100%" height={160}/>
                        <CardBody>
                        <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">{course.name}</CardTitle>
                        <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                          {course.description}</CardText>
                        <Button variant="primary">Go</Button>

                        {currentUser && currentUser.role === "FACULTY" && (
                          <React.Fragment>
                            <Button onClick={(event) => {
                              event.preventDefault();
                              dispatch(deleteCourse(course._id));
                            }} className="btn btn-danger float-end"
                            id="wd-delete-course-click">
                              Delete
                            </Button>
                            <Button id="wd-edit-course-click"
                                    onClick={(event) => {
                                      event.preventDefault();
                                      setCourse(course);
                                    }}
                                    className="btn btn-warning me-2 float-end" >
                                Edit
                            </Button>
                          </React.Fragment>
                        )}

                        {currentUser && currentUser.role === "STUDENT" && (
                          <React.Fragment>
                            {isEnrolled ? (
                              <Button
                                variant="danger"
                                className="float-end"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  dispatch(unenrollCourse(course._id));
                                }}
                              >
                                Unenroll
                              </Button>
                            ) : (
                              <Button
                                variant="success"
                                className="float-end"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  dispatch(enrollCourse(course._id));
                                }}
                              >
                                Enroll
                              </Button>
                            )}
                          </React.Fragment>
                        )}

                      </CardBody>
                    </Link>
                    </Card>
                  </Col>
                </React.Fragment>
              )})}
            </Row>
        </div>
      </div>
    </div>
  );}
