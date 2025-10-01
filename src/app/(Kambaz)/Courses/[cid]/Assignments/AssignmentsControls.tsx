import { Button } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
export default function ModulesControls() {
  return (
    <div>
      <div className="float-start mt-3 mb-3">
            <FaSearch className="position-relative me-2" style={{ position: "relative", left: "35px" }}/>
            <input placeholder="Search..." className="form-control form-control-lg wd-assignment-bg" style={{ width: "300px", display: "inline-block", paddingLeft: "40px" }}/>
        </div>
    <div id="wd-modules-controls" className="text-nowrap">
      <Button variant="danger" size="lg" className="me-1 float-end" id="wd-add-module-btn">
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
        Assignment
      </Button>
      <Button variant="secondary" size="lg" className="me-2 float-end" id="wd-view-progress-btn">
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
        Group
      </Button>
    </div>
    </div>
);}
