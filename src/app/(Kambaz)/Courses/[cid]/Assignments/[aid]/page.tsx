"use client";
import { Badge, Button, Col, Form, FormCheck, FormControl, Row, FormLabel, FormSelect, InputGroup, CloseButton, Container } from "react-bootstrap";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { addAssignment, updateAssignment } from "../reducer";
import { useState, useEffect } from "react";
import * as client from "../../../client";


export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const { assignmentTemplate, assignments } = useSelector((state: any) => state.assignmentsReducer);

  const [currentAssignment, setCurrentAssignment] = useState<any>(null);

  useEffect(() => {
    if (aid === "new") {
      setCurrentAssignment({ ...assignmentTemplate, course: cid });
    } else {
      const foundAssignment = assignments.find((a: any) => a._id === aid) || assignmentTemplate;
      setCurrentAssignment(foundAssignment);
    }
  }, [aid, assignments, assignmentTemplate, cid]);

  // Convert "Month Day at HH:MM am/pm" to "YYYY-MM-DDTHH:MM"
  // Because datetime-local doesn't support "Month Day at HH:MM am/pm" format
  const formatDate = (dateString: string = ""): string => {
    if (!dateString) {
        return new Date().toISOString().slice(0, 16); 
    }
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;
    if (isoRegex.test(dateString)) {
        return dateString.slice(0, 16);
    }
    const simpleDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (simpleDateRegex.test(dateString)) {
        return `${dateString}T00:00`; 
    }
    const regex = /(\w+)\s+(\d+)\s+at\s+(\d+):(\d+)\s+(am|pm)/i;
    const match = dateString.match(regex);
    if (!match) {
      console.warn("Unrecognized date format:", dateString);
      return new Date().toISOString().slice(0, 16);
    }
    const [, month, day, hour, minute, period] = match;
    const months: { [key: string]: string } = {
      'January': '01', 'February': '02', 'March': '03', 'April': '04',
      'May': '05', 'June': '06', 'July': '07', 'August': '08',
      'September': '09', 'October': '10', 'November': '11', 'December': '12'
    };
    let hours = parseInt(hour);
    if (period.toLowerCase() === 'pm' && hours !== 12) hours += 12;
    else if (period.toLowerCase() === 'am' && hours === 12) hours = 0;
    const year = new Date().getFullYear(); 
    const monthNum = months[month];
    const dayPadded = day.padStart(2, '0');
    const hoursPadded = hours.toString().padStart(2, '0');
    const minutePadded = minute.toString().padStart(2, '0');
    return `${year}-${monthNum}-${dayPadded}T${hoursPadded}:${minutePadded}`;
  };

  const handleChange = (e: any) => {
    setCurrentAssignment({
      ...currentAssignment,
      [e.target.id]: e.target.value
    });
  };

  // const handleSave = () => {
  //   if (aid === "new") {
  //     dispatch(addAssignment(currentAssignment));
  //   } else {
  //     dispatch(updateAssignment(currentAssignment));
  //   }
  //   router.push(`/Courses/${cid}/Assignments`);
  // };

  const handleSave = async () => {
    if (aid === "new") {
      const newAssignment = await client.createAssignment(cid, currentAssignment);
      dispatch(addAssignment(newAssignment));
    } else {
      const updatedAssignment = await client.updateAssignment(currentAssignment);
      dispatch(updateAssignment(updatedAssignment));
    }
    router.push(`/Courses/${cid}/Assignments`);
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Assignments`);
  }

  if (!currentAssignment) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="p-4" id="wd-assignments-editor">
      <Row className="mb-3">
        <Col>
          <FormLabel htmlFor="title"> Assignment Name </FormLabel>
          <FormControl
            id="title"
            value={currentAssignment.title}
            onChange={handleChange}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <FormLabel htmlFor="description"> Assignment Description </FormLabel>
          <FormControl
            id="description"
            as="textarea"
            style={{ height: '350px' }}
            value={currentAssignment.description}
            placeholder="New Description"
            onChange={handleChange}
          />
        </Col>
      </Row>

      <Form>
        <Row className="mb-3">
          <FormLabel htmlFor="points" column sm={3} className="text-sm-end pt-0">
            Points
          </FormLabel>
          <Col sm={9}>
            <FormControl
              id="points"
              value={currentAssignment.points}
              onChange={handleChange}
            />
          </Col>
        </Row>

        <Row className="mb-3" controlId="wd-group">
          <FormLabel htmlFor="wd-group" column sm={3} className="text-sm-end pt-0">
            Assignment Group
          </FormLabel>
          <Col sm={9}>
            <FormSelect id="wd-group" aria-label="Assignment Group" defaultValue="assignments">
              <option value="assignments">ASSIGNMENTS</option>
              <option value="quizzes">QUIZZES</option>
              <option value="exams">EXAMS</option>
            </FormSelect>
          </Col>
        </Row>

        <Row className="mb-3" controlId="wd-display-grade-as">
          <FormLabel htmlFor="wd-display-grade-as" column sm={3} className="text-sm-end pt-0">
            Display Grade as
          </FormLabel>
          <Col sm={9}>
            <FormSelect id="wd-display-grade-as" aria-label="Display Grade as" defaultValue="percentage">
              <option value="percentage">Percentage</option>
              <option value="value">VALUE</option>
              <option value="rank">RANK</option>
            </FormSelect>
          </Col>
        </Row>

        <Row className="mb-3" controlId="wd-submission-type-options">
          <FormLabel htmlFor="wd-submission-type" column sm={3} className="text-sm-end pt-0">
            Submission Type
          </FormLabel>
          <Col sm={9}>
            <div className="border rounded p-3">
              <FormSelect id="wd-submission-type" defaultValue="online" className="mb-3">
                <option value="online">Online</option>
                <option value="on-paper">On Paper</option>
              </FormSelect>
              <FormLabel className="fw-bold">Online Entry Options</FormLabel><br />
              <FormCheck type="checkbox" id="wd-text-entry" label="text-entry" /><br />
              <FormCheck type="checkbox" id="wd-website-url" label="website-url" defaultChecked /><br />
              <FormCheck type="checkbox" id="wd-media-recordings" label="media-recordings" /><br />
              <FormCheck type="checkbox" id="wd-student-annotation" label="student-annotation" /><br />
              <FormCheck type="checkbox" id="wd-file-upload" label="file-uploads" />
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <FormLabel column sm={3} className="text-sm-end pt-0">
            Assign
          </FormLabel>
          <Col sm={9}>
            <div className="border rounded p-3">

              <Row className="mb-3" controlId="assignTo">
                <FormLabel className="fw-bold">Assign to</FormLabel>
                <div className="form-control" style={{ height: 'auto' }}>
                  <Badge bg="light" text="dark" className="d-inline-flex align-items-center border me-1">
                    Everyone
                    <CloseButton variant="secondary" style={{ fontSize: '0.6rem' }} className="ms-1 p-0" />
                  </Badge>
                </div>
              </Row>

              <Row className="mb-3">
                <FormLabel htmlFor="due" className="fw-bold">Due</FormLabel>
                <InputGroup>
                  <FormControl
                    id="due"
                    type="datetime-local"
                    value={formatDate(currentAssignment.due)}
                    onChange={handleChange}
                  />
                </InputGroup>
              </Row>

              <Row>
                <Col>
                  <Row>
                    <FormLabel htmlFor="available" className="fw-bold">Available from</FormLabel>
                    <InputGroup>
                      <FormControl
                        id="available"
                        type="datetime-local"
                        value={formatDate(currentAssignment.available)}
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </Row>
                </Col>
                <Col>
                  <Row>
                    <FormLabel htmlFor="until" className="fw-bold">Until</FormLabel>
                    <InputGroup>
                      <FormControl
                      id="until"
                      type="datetime-local"
                      value={formatDate(currentAssignment.until)}
                      onChange={handleChange}
                    />
                    </InputGroup>
                  </Row>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Form>

      <hr />
      
      <div className="d-flex justify-content-end">
        <Button variant="light" className="me-2" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleSave}>
          Save
        </Button>
      </div>
    </Container>
);}
