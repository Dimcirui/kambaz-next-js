'use client';
import React, { useState } from "react";
import { FormControl } from "react-bootstrap";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function WorkingWithObjects() {
    const [assignment, setAssignment] = useState({
        id: 1, title: "NodeJS Assignment",
        description: "Create a NodeJS server with ExpressJS",
        due: "2021-10-10", completed: false, score: 0,
    });
    const ASSIGNMENT_API_URL = `${HTTP_SERVER}/lab5/assignment`
    
    const [module, setModule] = useState({
        id: "L5",
        name: "NodeJS Server",
        description: "Learning about Node.js.",
        course: "CS5610"
    });
    const MODULE_API_URL = `${HTTP_SERVER}/lab5/module`
    
    return (
        <div id="wd-working-with-objects">
      <h3>Working With Objects</h3>


      <h4>Retrieving Objects</h4>
      <a id="wd-retrieve-assignments" className="btn btn-primary"
         href={`${HTTP_SERVER}/lab5/assignment`}>
        Get Assignment
      </a><hr/>

      <h4>Retrieving Properties</h4>
      <a id="wd-retrieve-assignment-title" className="btn btn-primary"
         href={`${HTTP_SERVER}/lab5/assignment/title`}>
        Get Title
      </a><hr/>

      <h4>Modifying Properties</h4>
      <h5>Modifying Title</h5>
      <a id="wd-update-assignment-title"
         className="btn btn-primary float-end"
         href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}>
        Update Title </a>
      <FormControl className="w-75" id="wd-assignment-title"
        defaultValue={assignment.title} onChange={(e) =>
            setAssignment({ ...assignment, title: e.target.value })}/>
      <hr />

        <h5>Modifying Completed</h5>
        <a id="wd-update-assignment-completed"
            className="btn btn-primary float-end"
            href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}>
            Update Completed </a>
        <FormControl className="w-75" id="wd-assignment-completed"
            defaultValue={assignment.completed.toString()}
            type="text"
            onChange={(e) =>
                setAssignment({ ...assignment, completed: e.target.value === 'true' })} />
        <hr />
            
        <h5>Modifying Score</h5>
        <a id="wd-u[date-assignment-score"
            className="btn btn-primary float-end"
            href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}>
            Update Score </a>
        <FormControl className="w-75" id="wd-assignment-score"
            defaultValue={assignment.score}
            type="number"
            onChange={(e) =>
                setAssignment({ ...assignment, score: Number(e.target.value) })} />
        <hr />
        
        <h3>Module Object</h3>
        <h4>Retrieving Module Object</h4>
        <a id="wd-retrieve-module" className="btn btn-primary"
            href={MODULE_API_URL}>
            Get Module
        </a>
        <hr />

        <h4>Retrieving Module Properties</h4>
        <a id="wd-retrieve-module-name" className="btn btn-primary"
            href={`${MODULE_API_URL}/name`}>
            Get Module Name
        </a>
        <a id="wd-retrieve-module-description" className="btn btn-primary ms-2"
            href={`${MODULE_API_URL}/description`}>
            Get Module Description
        </a>

        <h4>Modifying Module Properties</h4>
        <a id="wd,update-module-name"
            className="btn btn-primary float-end"
            href={`${MODULE_API_URL}/name/${module.name}`}>
            Update Module Name </a>
        <FormControl className="w-75" id="wd-module-name"
            defaultValue={module.name}
            onChange={(e) =>
                setModule({ ...module, name: e.target.value })} />
        <hr />

        <a id="wd,update-module-description"
            className="btn btn-primary float-end"
            href={`${MODULE_API_URL}/description/${module.description}`}>
            Update Module Description </a>
        <FormControl className="w-75" id="wd-module-description"
            defaultValue={module.description}
            onChange={(e) =>
                setModule({ ...module, description: e.target.value })} />
        <hr />
    </div>
);}

