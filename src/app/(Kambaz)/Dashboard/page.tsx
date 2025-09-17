import Link from "next/link";
import Image from "next/image";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image src="/images/reactjs.jpg" width={200} height={150} alt="React JS course cover" />
            <div>
              <h5> CS1234 React JS </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/Courses/1235" className="wd-dashboard-course-link">
            <Image src="/images/apcspcore.jpg" width={200} height={150} alt="APCSP course cover" />
            <div>
              <h5> CS1235 APCSP </h5>
              <p className="wd-dashboard-course-title">
                AP Computer Science Principles
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/Courses/1236" className="wd-dashboard-course-link">
            <Image src="/images/csintro.jpg" width={200} height={150} alt="CS Intro course cover" />
            <div>
              <h5> CS1236 CS Intro </h5>
              <p className="wd-dashboard-course-title">
                Computer Science Introduction
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/Courses/1237" className="wd-dashboard-course-link">
            <Image src="/images/cybersecurity.jpg" width={200} height={150} alt="Cybersecurity course cover" />
            <div>
              <h5> CS1237 Cybersecurity </h5>
              <p className="wd-dashboard-course-title">
                Cybersecurity fundamentals
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/Courses/1238" className="wd-dashboard-course-link">
            <Image src="/images/fullstack.jpg" width={200} height={150} alt="Full Stack Web Development course cover" />
            <div>
              <h5> CS1238 Full Stack Web Development </h5>
              <p className="wd-dashboard-course-title">
                Full Stack web application developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/Courses/1239" className="wd-dashboard-course-link">
            <Image src="/images/machinelearning.jpg" width={200} height={150} alt="Machine Learning course cover" />
            <div>
              <h5> CS1239 Machine Learning </h5>
              <p className="wd-dashboard-course-title">
                Machine Learning basics
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/Courses/1240" className="wd-dashboard-course-link">
            <Image src="/images/newmedia.jpg" width={200} height={150} alt="New Media course cover" />
            <div>
              <h5> CS1240 React JS </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/Courses/1241" className="wd-dashboard-course-link">
            <Image src="/images/datascience.jpg" width={200} height={150} alt="Data Science course cover" />
            <div>
              <h5> CS1241 New Media design </h5>
              <p className="wd-dashboard-course-title">
                New Media design principles
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
);}
