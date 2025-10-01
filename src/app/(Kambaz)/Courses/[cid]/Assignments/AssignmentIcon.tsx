import { BsGripVertical } from "react-icons/bs";
import { LuNotebookPen } from "react-icons/lu";

export default function AssignmentIcon() {
    return (
        <div className="me-3">
            <BsGripVertical className="me-2"/>
            <LuNotebookPen color="green"/>
        </div>
    );
}