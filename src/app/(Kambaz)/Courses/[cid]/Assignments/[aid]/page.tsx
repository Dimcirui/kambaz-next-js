"use client";
import { Badge, Button, Col, Form, FormCheck, FormControl, Row, FormLabel, FormSelect, InputGroup, CloseButton, Container } from "react-bootstrap";
import { useParams } from "next/navigation";
import * as db from "../../../../Database";


export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  type Assignment = { id: string; title: string; course: string; available: string; due: string; points: number; };

  const assignments: Assignment[] = db.assignments
    .filter((assignment) => assignment.course === cid && assignment._id === aid)
    .map((assignment) => ({
      ...assignment,
      id: assignment._id,
    }));

  // Convert "Month Day at HH:MM am/pm" to "YYYY-MM-DDTHH:MM"
  // Because datetime-local doesn't support "Month Day at HH:MM am/pm" format
  const formatDate = (dateString: string): string => {
    const regex = /(\w+)\s+(\d+)\s+at\s+(\d+):(\d+)\s+(am|pm)/i;
    const match = dateString.match(regex);
    
    if (!match) {
      console.error('Invalid date format:', dateString);
      return '';
    }
    
    const [, month, day, hour, minute, period] = match;

    // Convert month name to month number
    const months: { [key: string]: string } = {
      'January': '01', 'February': '02', 'March': '03', 'April': '04',
      'May': '05', 'June': '06', 'July': '07', 'August': '08',
      'September': '09', 'October': '10', 'November': '11', 'December': '12'
    };
    
    // Convert 12-hour format to 24-hour format
    let hours = parseInt(hour);
    if (period.toLowerCase() === 'pm' && hours !== 12) {
      hours += 12;
    } else if (period.toLowerCase() === 'am' && hours === 12) {
      hours = 0;
    }
    
    const year = new Date().getFullYear(); // Use current year
    const monthNum = months[month];
    const dayPadded = day.padStart(2, '0');
    const hoursPadded = hours.toString().padStart(2, '0');
    const minutePadded = minute.padStart(2, '0');
    
    return `${year}-${monthNum}-${dayPadded}T${hoursPadded}:${minutePadded}`;
  };

  return (
    <Container className="p-4" id="wd-assignments-editor">
      {assignments.map((assignment: Assignment) => (
        <div key={assignment.id}>
          <Row className="mb-3" controlId="wd-name">
            <Col>
              <FormLabel htmlFor="wd-name"> Assignment Name </FormLabel><br />
              <FormControl id="wd-name" defaultValue={assignment.title} />
            </Col>
          </Row>

          <Row className="mb-3" controlId="wd-description">
            <Col>
              <FormControl id="wd-description" as="textarea" style={{ height: '350px' }} defaultValue={`
              The assignment is available online

              Submit a link to the landing page of your Web application running on Netlify.

              The landing page should include the following:
              · Your full name and section
              · Links to each of the lab assignments
              · Link to Kanbas application
              · Links to all relevant source code repositories

              The Kanbas application should include a link to navigate back to the landing page.`} />
            </Col>
          </Row><br />

          <Form>
            <Row className="mb-3" controlId="wd-points">
              <FormLabel htmlFor="wd-points" column sm={3} className="text-sm-end pt-0">
                Points
              </FormLabel>
              <Col sm={9}>
                <FormControl id="wd-points" defaultValue={assignment.points} />
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

            <Row className="mb-3" controlId="wd-assign-to-and-due-date">
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

                  <Row className="mb-3" controlId="dueDate">
                    <FormLabel htmlFor="wd-due-date" className="fw-bold">Due</FormLabel>
                    <InputGroup>
                      <FormControl id="wd-due-date" type="datetime-local" defaultValue={formatDate(assignment.due)} />
                    </InputGroup>
                  </Row>

                  <Row>
                    <Col>
                      <Row controlId="availableFrom">
                        <FormLabel htmlFor="wd-available-from" className="fw-bold">Available from</FormLabel>
                        <InputGroup>
                          <FormControl id="wd-available-from" type="datetime-local" defaultValue={formatDate(assignment.available)} />
                        </InputGroup>
                      </Row>
                    </Col>
                    <Col>
                      <Row controlId="untilDate">
                        <FormLabel htmlFor="wd-until-date" className="fw-bold">Until</FormLabel>
                        <InputGroup>
                          <FormControl id="wd-until-date" type="datetime-local" />
                        </InputGroup>
                      </Row>
                    </Col>
                  </Row>

                </div>
              </Col>
            </Row>

          </Form>
        </div>
      ))}
    </Container>

    // <Container className="p-4" id="wd-assignments-editor">
    //   <Row className="mb-3" controlId="wd-name">
    //     <Col>
    //     <FormLabel htmlFor="wd-name"> Assignment Name </FormLabel><br />
    //     <FormControl id="wd-name" defaultValue="A1 - ENV + HTML" />
    //     </Col>
    //   </Row>

    //   <Row className="mb-3" controlId="wd-description">
    //     <Col>
    //     <FormControl id="wd-description" as="textarea" style={{height: '350px' }} defaultValue={`
    //     The assignment is available online

    //     Submit a link to the landing page of your Web application running on Netlify.

    //     The landing page should include the following: 
    //     · Your full name and section 
    //     · Links to each of the lab assignments 
    //     · Link to Kanbas application
    //     · Links to all relevant source code repositories

    //     The Kanbas application should include a link to navigate back to the landing page.`} />
    //     </Col>
    //   </Row><br />

    //   <Form>
    //     <Row className="mb-3" controlId="wd-points">
    //       <FormLabel htmlFor="wd-points" column sm={3} className="text-sm-end pt-0">
    //         Points
    //       </FormLabel>
    //       <Col sm={9}>
    //         <FormControl id="wd-points" defaultValue={100} />
    //       </Col>
    //     </Row>
    //     <Row className="mb-3" controlId="wd-group">
    //       <FormLabel htmlFor="wd-group" column sm={3} className="text-sm-end pt-0">
    //         Assignment Group
    //       </FormLabel>
    //       <Col sm={9}>
    //         <FormSelect id="wd-group" aria-label="Assignment Group" defaultValue="assignments">
    //             <option value="assignments">ASSIGNMENTS</option>
    //             <option value="quizzes">QUIZZES</option>
    //             <option value="exams">EXAMS</option>
    //         </FormSelect>
    //       </Col>
    //     </Row>
    //     <Row className="mb-3" controlId="wd-display-grade-as">
    //       <FormLabel htmlFor="wd-display-grade-as" column sm={3} className="text-sm-end pt-0">
    //         Display Grade as
    //       </FormLabel>
    //       <Col sm={9}>
    //         <FormSelect id="wd-display-grade-as" aria-label="Display Grade as" defaultValue="percentage">
    //             <option value="percentage">Percentage</option>
    //             <option value="value">VALUE</option>
    //             <option value="rank">RANK</option>
    //         </FormSelect>
    //       </Col>
    //     </Row>

    //     <Row className="mb-3" controlId="wd-submission-type-options">
    //         <FormLabel htmlFor="wd-submission-type" column sm={3} className="text-sm-end pt-0">
    //           Submission Type
    //         </FormLabel>
    //         <Col sm={9}>
    //           <div className="border rounded p-3">
    //             <FormSelect id="wd-submission-type" defaultValue="online" className="mb-3">
    //               <option value="online">Online</option>
    //               <option value="on-paper">On Paper</option>
    //             </FormSelect>
    //             <FormLabel className="fw-bold">Online Entry Options</FormLabel><br />
    //             <FormCheck type="checkbox" id="wd-text-entry" label="text-entry" /><br />
    //             <FormCheck type="checkbox" id="wd-website-url" label="website-url" defaultChecked /><br />
    //             <FormCheck type="checkbox" id="wd-media-recordings" label="media-recordings" /><br />
    //             <FormCheck type="checkbox" id="wd-student-annotation" label="student-annotation" /><br />
    //             <FormCheck type="checkbox" id="wd-file-upload" label="file-uploads" />
    //           </div>
    //         </Col>
    //     </Row>

    //     <Row className="mb-3" controlId="wd-assign-to-and-due-date">
    //         <FormLabel column sm={3} className="text-sm-end pt-0">
    //           Assign
    //         </FormLabel>
    //         <Col sm={9}>
    //           <div className="border rounded p-3">
    //             <Row className="mb-3" controlId="assignTo">
    //               <FormLabel className="fw-bold">Assign to</FormLabel>
    //               <div className="form-control" style={{ height: 'auto' }}>
    //                 <Badge bg="light" text="dark" className="d-inline-flex align-items-center border me-1">
    //                   Everyone
    //                   <CloseButton variant="secondary" style={{ fontSize: '0.6rem' }} className="ms-1 p-0" />
    //                 </Badge>
    //               </div>
    //             </Row>
                
    //             <Row className="mb-3" controlId="dueDate">
    //               <FormLabel htmlFor="wd-due-date" className="fw-bold">Due</FormLabel>
    //               <InputGroup>
    //                 <FormControl id="wd-due-date" type="datetime-local" defaultValue="2024-05-13T23:59" />
    //               </InputGroup>
    //             </Row>

    //             <Row>
    //               <Col>
    //                 <Row controlId="availableFrom">
    //                   <FormLabel htmlFor="wd-available-from" className="fw-bold">Available from</FormLabel>
    //                   <InputGroup>
    //                     <FormControl id="wd-available-from" type="datetime-local" defaultValue="2024-05-06T00:00" />
    //                   </InputGroup>
    //                 </Row>
    //               </Col>
    //               <Col>
    //                 <Row controlId="untilDate">
    //                   <FormLabel htmlFor="wd-until-date" className="fw-bold">Until</FormLabel>
    //                   <InputGroup>
    //                     <FormControl id="wd-until-date" type="datetime-local" />
    //                   </InputGroup>
    //                 </Row>
    //               </Col>
    //             </Row>
    //           </div>
    //         </Col>
    //       </Row>
    //     </Form>


    //     <div className="d-flex justify-content-end">
    //       <Button variant="light" className="me-2">Cancel</Button>
    //       <Button variant="danger">Save</Button>
    //     </div>
    // </Container>

    // <div id="wd-assignments-editor">
    //       <div id="wd-assignments-editor">
    //   <label htmlFor="wd-name">Assignment Name</label><br />
    //   <input id="wd-name" defaultValue="A1 - ENV + HTML" /><br /><br />
    //   <textarea id="wd-description" style={{ width: '14%', height: '140px' }}>
    //     The assignment is available online Submit a link to the landing page of your Web application running on Netlify. The landing page should include the following: Your full name and section Links to each of the lab assignments Link to Kanbas application
    //     Links to all relevant source code repositories
    //     The Kanbas application should include a link to navigate back to the landing page.
    //   </textarea>
    //   <br />
    //   <table>
    //     <tr>
    //       <td align="right" valign="top">
    //         <label htmlFor="wd-points">Points</label>
    //       </td>
    //       <td>
    //         <input id="wd-points" defaultValue={100} />
    //       </td>
    //     </tr>
    //     {/* Complete on your own */}
    //     <tr>
    //       <td align="right" valign="top">
    //         <label htmlFor="wd-group">Assignment Group</label>
    //       </td>
    //       <td>
    //         <select id="wd-group">
    //             <option value="assignments" selected>ASSIGNMENTS</option>
    //             <option value="quizzes">QUIZZES</option>
    //             <option value="exams">EXAMS</option>
    //         </select>
    //       </td>
    //     </tr>
    //     <tr>
    //       <td align="right" valign="top">
    //         <label htmlFor="wd-display-grade-as">Display Grade as</label>
    //       </td>
    //       <td>
    //         <select id="wd-display-grade-as">
    //             <option value="percentage" selected>Percentage</option>
    //             <option value="value">VALUE</option>
    //             <option value="rank">RANK</option>
    //         </select>
    //       </td>
    //     </tr>
    //     <tr>
    //       <td align="right" valign="top">
    //         <label htmlFor="wd-submission-type">Submission Type</label>
    //       </td>
    //       <td>
    //         <select id="wd-submission-type">
    //             <option value="online" selected>Online</option>
    //             <option value="on-paper">On Paper</option>
    //         </select>
    //       </td>
    //     </tr>
    //   </table>

    //   <div style={{ paddingLeft: '140px' }}>
    //       <label>Online Entry Options</label>
    //       <div style={{ paddingLeft: '20px' }}>
    //       <label><input type="checkbox" name="online-entry-options" id="wd-text-entry" value="text-entry" /> Text Entry</label><br />
    //       <label><input type="checkbox" name="online-entry-options" id="wd-website-url" value="website-url" /> Website URL</label><br />
    //       <label><input type="checkbox" name="online-entry-options" id="wd-media-recordings" value="media-recordings" /> Media Recordings</label><br />
    //       <label><input type="checkbox" name="online-entry-options" id="wd-student-annotation" value="student-annotation" /> Student Annotation</label><br />
    //       <label><input type="checkbox" name="online-entry-options" id="wd-file-upload" value="file-uploads" /> File Uploads</label><br />
    //       </div>
    //   </div>

    //   <br />
    //   <br />
    //   <div style={{ paddingLeft: '80px' }}>
    //   <label htmlFor="wd-assign-to" >Assign Assign to</label><br />
    //     <div style={{ paddingLeft: '80px' }}>
    //     <input id="wd-assign-to" defaultValue="Everyone" /><br />
    //     <br />
    //     <label htmlFor="wd-due-date">Due</label><br />
    //     <input id="wd-due-date" type="date" defaultValue="2024-05-13" /><br />
    //     <br />
    //     <label htmlFor="wd-available-from">Available from</label><br />
    //     <input id="wd-available-from" type="date" defaultValue="2024-05-06" /><br />
    //     <br />
    //     <label htmlFor="wd-available-until">Until</label><br />
    //     <input id="wd-available-until" type="date" defaultValue="2024-05-20" /><br />
    //     </div>
    //   <br />
    //   </div>

    //   <div style={{ textAlign: 'right' }}>
    //     <button>Cancel</button>
    //     <button>Save</button>
    //   </div>
    // </div>
);}
