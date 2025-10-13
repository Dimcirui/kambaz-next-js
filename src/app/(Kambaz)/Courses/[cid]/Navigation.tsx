"use client"
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

export default function CourseNavigation() {
  const pathname = usePathname();
  const params = useParams();
  const cid = params.cid;
  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];

  return (
    // <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
    //   <Link href="/Courses/1234/Home" id="wd-course-home-link"
    //     className="list-group-item active border-0"> Home </Link>
    //   <Link href="/Courses/1234/Modules" id="wd-course-modules-link"
    //     className="list-group-item text-danger border-0"> Modules </Link>
    //   <Link href="/Courses/1234/Piazza" id="wd-course-piazza-link"
    //     className="list-group-item text-danger border-0"> Piazza </Link>
    //   <Link href="/Courses/1234/Zoom" id="wd-course-zoom-link"
    //     className="list-group-item text-danger border-0"> Zoom </Link>
    //   <Link href="/Courses/1234/Assignments" id="wd-course-assignments-link"
    //     className="list-group-item text-danger border-0"> Assignments </Link>
    //   <Link href="/Courses/1234/Quizzes" id="wd-course-quizzes-link"
    //     className="list-group-item text-danger border-0"> Quizzes </Link>
    //   <Link href="/Courses/1234/Grades" id="wd-course-grades-link"
    //     className="list-group-item text-danger border-0"> Grades </Link>
    //   <Link href="/Courses/1234/People/Table" id="wd-course-people-link"
    //     className="list-group-item text-danger border-0" > People </Link>
    //   <Link href="/Courses/1234/Settings" id="wd-course-settings-link"
    //     className="list-group-item text-danger border-0"> Settings </Link>
    // </div>
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => (
        <Link
          key={link}
          href={`/Courses/${cid}/${link}`}
          id={`wd-course-${link.toLowerCase()}-link`}
          className={`list-group-item${pathname.includes(link) ? " active" : " text-danger"} border-0`}
        >
          {link}
        </Link>
      ))}
    </div>
);}

