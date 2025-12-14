"use client"
import { Button } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function AssignmentsControls() {
  const {cid} = useParams();

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="position-relative" style={{ width: "300px" }}>
          <FaSearch 
            className="position-absolute" 
            style={{ left: "15px", top: "50%", transform: "translateY(-50%)", zIndex: 10 }}
          />
          <input 
            placeholder="Search..." 
            className="form-control form-control-lg wd-assignment-bg w-100" 
            style={{ paddingLeft: "40px" }}
          />
        </div>
      </div>

      <div id="wd-assignments-controls" className="text-nowrap">
        <Link href={`/Courses/${cid}/Assignments/new`}>
          <Button variant="danger" size="lg" className="me-1 float-end" id="wd-add-assignment-btn">
            <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
            Assignment
          </Button>
        </Link>
        <Button variant="secondary" size="lg" className="me-2 float-end" id="wd-add-group-btn">
          <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
          Group
        </Button>
      </div>
    </div>
);}
