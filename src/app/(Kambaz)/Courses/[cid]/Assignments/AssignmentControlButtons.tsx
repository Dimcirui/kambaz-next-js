import "./style.css";
import { FaPlus } from "react-icons/fa6";
import { IoEllipsisVertical } from "react-icons/io5";

export default function AssignmentControlButtons() {
    return (
    <div className="float-end">
      <div className="percentage-badge me-2">
      40% of Total
      </div>
      <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
      <IoEllipsisVertical className="fs-4" />
    </div> 
    );
}