"use client";
import { setModules, addModule, editModule, updateModule, deleteModule }
  from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
// import * as db from "../../../Database";
import * as client from "../../client";
import { FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import ModulesControls from "./ModulesControls";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";
import { BsGripVertical } from "react-icons/bs";
import { v4 as uuidv4 } from "uuid";

export default function Modules() {
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const { modules } = useSelector((state: any) => state.modulesReducer);
  const dispatch = useDispatch();
  const onUpdateModule = async (module: any) => {
    dispatch(updateModule({ ...module, editing: false }));
    await client.updateModule(cid as string, module);
  };

  const onRemoveModule = async (moduleId: string) => {
    await client.deleteModule(cid as string, moduleId);
    // dispatch(setModules(modules.filter((m: any) => m._id !== moduleId)));
    dispatch(deleteModule(moduleId));
  };
  const onCreateModuleForCourse = async () => {
    if (!cid) return;
    const newModule = { name: moduleName, course: cid };
    const amodule = await client.createModuleForCourse(cid as string, newModule);
    // dispatch(setModules([...modules, module]));
    dispatch(addModule(amodule));
  };

  const fetchModules = async () => {
    const modules = await client.findModulesForCourse(cid as string);
    dispatch(setModules(modules));
  };
  useEffect(() => {
    fetchModules();
  }, []);

  return (
    <div className="wd-modules d-flex flex-column">
      <div className="mb-3">
      <ModulesControls moduleName={moduleName} setModuleName={setModuleName}
        addModule={onCreateModuleForCourse} />
      </div>

      <div>
      <ListGroup className="rounded-0" id="wd-modules">
        {modules
          // .filter((module: any) => module.course === cid)
          .map((module: any) => (
            <ListGroupItem key={module._id || module.name} 
                           className={`wd-module p-0 mb-5 fs-5 border-gray ${!module.lessons ? 'wd-module-no-lessons' : ''}`}>
              <div className="wd-title p-3 ps-2 bg-secondary d-flex align-items-center">
                <BsGripVertical className="me-2 fs-3" />
                <span className="flex-grow-1">
                    {!module.editing && module.name}
                    { module.editing && (
                      <FormControl className="w-50 d-inline-block"
                        value={module.name}
                        onChange={(e) =>
                          dispatch(updateModule({ ...module, name: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            onUpdateModule(module);
                          }
                        }}
                        onBlur={() => {onUpdateModule(module);}}
                        autoFocus
                      />
                    )}
                </span>
                
                <ModuleControlButtons moduleId={module._id}
                          deleteModule={(moduleId) => onRemoveModule(moduleId)}
                          editModule={(moduleId) => dispatch(editModule(moduleId))} />

              </div>

              <div>
              {module.lessons && (
                <ListGroup className="wd-lessons rounded-0">
                  {module.lessons.map((lesson: any) => (
                    <ListGroupItem key={lesson.id} className="wd-lesson p-3 ps-1">
                      <BsGripVertical className="me-2 fs-3" /> {lesson.name} <LessonControlButtons />
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )}
              </div>

            </ListGroupItem>
        ))}
        </ListGroup>
      </div>
    </div>
);}
