"use client"
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { addAssignment, deleteAssignment, setAssignments, updateAssignment }
  from "./reducer";

import Link from "next/link";
import "./style.css";
import AssignmentsControls from "./AssignmentsControls";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import AssignmentControlButtons from "./AssignmentControlButtons";
import { BsGripVertical } from "react-icons/bs";
import LessonControlButtons from "../Modules/LessonControlButtons";
import { GoTriangleDown } from "react-icons/go";
import { FaTrash } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import AssignmentIcon from "./AssignmentIcon";

import * as client from "../../client";

export default function Assignments() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);

  
  useEffect(() => {
    const fetchAssignments = async () => {
      if (!cid) return;
      const assignments = await client.findAssignmentsForCourse(cid);
      dispatch(setAssignments(assignments));
    };
    fetchAssignments();
  }, [cid, dispatch]);

  const handleDeleteAssignment = async (assignmentId: string) => {
    await client.deleteAssignment(assignmentId);
    dispatch(deleteAssignment(assignmentId));
  };
  
  const courseAssignments = assignments.filter(
    (assignment: any) => assignment.course === cid
  );

  return (
    <div id="wd-assignments">
      <AssignmentsControls />

      <ListGroup className="rounded-0" id="wd-assignments">
        <ListGroupItem className="wd-assignment-list-item p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 wd-assignment-bg">
            <BsGripVertical />
            <GoTriangleDown className="me-2"/>
            ASSIGNMENTS
            <AssignmentControlButtons />
          </div>

        <ListGroup className="wd-lessons rounded-0">
          {courseAssignments.map((assignment: any) => (
            <ListGroupItem key={assignment.id} className="wd-lesson p-3 ps-1">
              <div className="d-flex align-items-center">
                <AssignmentIcon />
                  <div className="flex-grow-1">
                    <div>
                      <Link 
                        href={`/Courses/${cid}/Assignments/${assignment._id}`} 
                        className="wd-assignment-link"><strong>{assignment.title}</strong>
                      </Link>
                      </div>
                    <div>
                      <span className="text-danger">Multiple Modules</span>
                      <span className="text-muted"> | <strong>Not available until</strong> {assignment.available} |</span>
                    </div>
                    <div className="text-muted small">
                      <strong>Due</strong> {assignment.due} | {assignment.points} pts
                    </div>
                  </div>

                  <div className="float-end ms-2 d-flex align-items-center">
                    <FaTrash
                      className="text-danger me-2 mb-1"
                      // onClick={() => dispatch(deleteAssignment(assignment._id))}
                      onClick={() => handleDeleteAssignment(assignment._id)}
                    />
                    <IoEllipsisVertical className="fs-4" />
                  </div>

              </div>
            </ListGroupItem>
          ))}
        </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
);}
