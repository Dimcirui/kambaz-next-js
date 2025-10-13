"use client"
import Link from "next/link";
import "./style.css";
import AssignmentsControls from "./AssignmentsControls";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import AssignmentControlButtons from "./AssignmentControlButtons";
import { BsGripVertical } from "react-icons/bs";
import LessonControlButtons from "../Modules/LessonControlButtons";
import { GoTriangleDown } from "react-icons/go";
import AssignmentIcon from "./AssignmentIcon";
import { useParams } from "next/navigation";
import * as db from "../../../Database";

export default function Assignments() {
  const { cid } = useParams();
  type Assignment = { id: string; title: string; course: string; available: string; due: string; points: number; };

  const assignments: Assignment[] = db.assignments
    .filter((assignment) => assignment.course === cid)
    .map((assignment) => ({
      ...assignment,
      id: assignment._id,
    }));
  
  return (
    <div>
      <AssignmentsControls /><br /><br /><br /><br />
      <ListGroup className="rounded-0" id="wd-assignment-list">
        <ListGroupItem className="wd-assignment-list-item p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 wd-assignment-bg">
            <BsGripVertical />
            <GoTriangleDown className="me-2"/>
            ASSIGNMENTS
            <AssignmentControlButtons />
          </div>

          <ListGroup className="wd-lessons rounded-0">
            {assignments.map((assignment: Assignment) => (
              <ListGroupItem key={assignment.id} className="wd-lesson p-3 ps-1">
                <div className="d-flex align-items-center">
                  <AssignmentIcon />
                    <div className="flex-grow-1">
                      <div>
                        <Link 
                          href={`/Courses/${cid}/Assignments/${assignment.id}`} 
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
                  <LessonControlButtons />
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
    
    // <div>
    //   <AssignmentsControls /><br /><br /><br /><br />
    //   <ListGroup className="rounded-0" id="wd-assignment-list">
    //     <ListGroupItem className="wd-assignment-list-item p-0 mb-5 fs-5 border-gray">
    //       <div className="wd-title p-3 ps-2 wd-assignment-bg"> 
    //         <BsGripVertical />
    //         <GoTriangleDown className="me-2"/>
    //         ASSIGNMENTS
    //         <AssignmentControlButtons />
    //       </div>
    //       <ListGroup className="wd-lessons rounded-0">
    //         <ListGroupItem className="wd-lesson p-3 ps-1">
    //           <div className="d-flex align-items-center">
    //             <AssignmentIcon />
    //               <div className="flex-grow-1">
    //                 <div><Link href="/Courses/1234/Assignments/123" className="wd-assignment-link"><strong>A1</strong></Link></div>
    //                 <div>
    //                   <span className="text-danger">Multiple Modules</span>
    //                   <span className="text-muted"> | <strong>Not available until</strong> May 6 at 12:00am |</span>
    //                 </div>
    //                 <div className="text-muted small">
    //                   <strong>Due</strong> May 13 at 11:59pm | 100 pts
    //                 </div>
    //               </div>
    //             <LessonControlButtons />
    //           </div>
    //         </ListGroupItem>
    //         <ListGroupItem className="wd-lesson p-3 ps-1">
    //           <div className="d-flex align-items-center">
    //             <AssignmentIcon />
    //               <div className="flex-grow-1">
    //                 <div><Link href="/Courses/1234/Assignments/123" className="wd-assignment-link"><strong>A2</strong></Link></div>
    //                 <div>
    //                   <span className="text-danger">Multiple Modules</span>
    //                   <span className="text-muted"> | <strong>Not available until</strong> May 13 at 12:00am |</span>
    //                 </div>
    //                 <div className="text-muted small">
    //                   <strong>Due</strong> May 20 at 11:59pm | 100 pts
    //                 </div>
    //               </div>
    //             <LessonControlButtons />
    //           </div>
    //         </ListGroupItem>            <ListGroupItem className="wd-lesson p-3 ps-1">
    //           <div className="d-flex align-items-center">
    //             <AssignmentIcon />
    //               <div className="flex-grow-1">
    //                 <div><Link href="/Courses/1234/Assignments/123" className="wd-assignment-link"><strong>A3</strong></Link></div>
    //                 <div>
    //                   <span className="text-danger">Multiple Modules</span>
    //                   <span className="text-muted"> | <strong>Not available until</strong> May 20 at 12:00am |</span>
    //                 </div>
    //                 <div className="text-muted small">
    //                   <strong>Due</strong> May 27 at 11:59pm | 100 pts
    //                 </div>
    //               </div>
    //             <LessonControlButtons />
    //           </div>
    //         </ListGroupItem>
    //       </ListGroup>
    //     </ListGroupItem>
    //   </ListGroup>
    // </div>

    // <div id="wd-assignments">
    //   <input placeholder="Search for Assignments"
    //          id="wd-search-assignment" />
    //   <button id="wd-add-assignment-group">+ Group</button>
    //   <button id="wd-add-assignment">+ Assignment</button>
    //   <h3 id="wd-assignments-title">
    //     ASSIGNMENTS 40% of Total <button>+</button> </h3>
    //   <ul id="wd-assignment-list">
    //     <li className="wd-assignment-list-item">
    //       <Link href="/Courses/1234/Assignments/123" className="wd-assignment-link">
    //         A1 - ENV + HTML
    //       </Link> </li>
    //       Multiple Modules | <strong>Not available until</strong> May 6 at 12:00 am |<br/>
    //       <strong>Due</strong> May 13 at 11:59 pm | 100 pts
    //     <li className="wd-assignment-list-item">
    //       <Link href="/Courses/1234/Assignments/124" className="wd-assignment-link">
    //         A2 - CSS + BOOTSTRAP
    //       </Link> </li>
    //       Multiple Modules | <strong>Not available until</strong> May 13 at 12:00 am |<br/>
    //       <strong>Due</strong> May 20 at 11:59 pm | 100 pts
    //       {/* Complete On Your Own */}
    //     <li className="wd-assignment-list-item">
    //       <Link href="/Courses/1234/Assignments/125" className="wd-assignment-link">
    //         A3 - JAVASCRIPT + REACT
    //       </Link> </li>
    //       Multiple Modules | <strong>Not available until</strong> May 20 at 12:00 am |<br/>
    //       <strong>Due</strong> May 27 at 11:59 pm | 100 pts
    //   </ul>
    // </div>
);}
