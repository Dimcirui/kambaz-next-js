import Link from "next/link";
import Image from "next/image";
import { Card, CardBody, CardImg, CardText, CardTitle, Button, Row, Col } from "react-bootstrap";

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Row xs={1} md={5} className="g-4">
            <Col className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
              <Link href="/Courses/1234/Home"
                    className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/reactjs.jpg" width="100%" height={160}/>
                <CardBody>
                <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS1234 React JS</CardTitle>
                <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                  Full Stack software developer</CardText>
                <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
              </Card>
            </Col>

            <Col className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
              <Link href="/Courses/1235/Home"
                    className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/apcspcore.jpg" width="100%" height={160}/>
                <CardBody>
                <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS1235 APCSP</CardTitle>
                <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                  AP Computer Science Principles</CardText>
                <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
              </Card>
            </Col>

            <Col className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
              <Link href="/Courses/1236/Home"
                    className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/csintro.jpg" width="100%" height={160}/>
                <CardBody>
                <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS1236 CS Intro</CardTitle>
                <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                  Computer Science Introduction</CardText>
                <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
              </Card>
            </Col>

            <Col className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
              <Link href="/Courses/1237/Home"
                    className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/cybersecurity.jpg" width="100%" height={160}/>
                <CardBody>
                <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS1237 Cybersecurity</CardTitle>
                <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                  Cybersecurity fundamentals</CardText>
                <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
              </Card>
            </Col>

            <Col className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
              <Link href="/Courses/1238/Home"
                    className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/fullstack.jpg" width="100%" height={160}/>
                <CardBody>
                <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS1238 Full Stack Web Development</CardTitle>
                <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                  Full Stack web application developer</CardText>
                <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
              </Card>
            </Col>

            <Col className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
              <Link href="/Courses/1239/Home"
                    className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/machinelearning.jpg" width="100%" height={160}/>
                <CardBody>
                <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS1239 Machine Learning</CardTitle>
                <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                  Machine Learning basics</CardText>
                <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
              </Card>
            </Col>

            <Col className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
              <Link href="/Courses/1240/Home"
                    className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/newmedia.jpg" width="100%" height={160}/>
                <CardBody>
                <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS1240 React JS</CardTitle>
                <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                  Full Stack software developer</CardText>
                <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
              </Card>
            </Col>

            <Col className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
              <Link href="/Courses/1241/Home"
                    className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/datascience.jpg" width="100%" height={160}/>
                <CardBody>
                <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS1241 New Media design</CardTitle>
                <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                  AP Computer Science Principles</CardText>
                <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
);}
