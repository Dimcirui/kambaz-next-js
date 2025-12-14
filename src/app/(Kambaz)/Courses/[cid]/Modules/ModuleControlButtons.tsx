import { useSelector } from "react-redux";
import { FaPlus, FaPencil } from "react-icons/fa6";
import GreenCheckmark from "./GreenCheckmark";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";

export default function ModuleControlButtons({ moduleId, deleteModule, editModule }: {
  moduleId: string; deleteModule: (moduleId: string) => void;
  editModule: (moduleId: string) => void }) {
    
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isFacultyOrAdmin = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";
    
  return (
    <div className="float-end">
      {isFacultyOrAdmin && (
        <>
          <FaPencil onClick={() => editModule(moduleId)} className="text-primary me-3" />
          <FaTrash className="text-danger me-2 mb-1" onClick={() => deleteModule(moduleId)}/>
        </>
      )}
      <GreenCheckmark />
      {isFacultyOrAdmin && (
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
      )}
      <IoEllipsisVertical className="fs-4" />
    </div> 
  );
}