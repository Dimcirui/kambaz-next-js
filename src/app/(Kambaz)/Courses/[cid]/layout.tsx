"use client";
import { ReactNode } from "react";
import CourseNavigation from "./Navigation";
import { FaAlignJustify } from "react-icons/fa6";
import { courses } from "../../Database";
import Breadcrumb from "./Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { toggleNavigation } from "./reducer";

export default function CoursesLayout({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const { showNavigation } = useSelector((state: any) => state.uiReducer);

  const { cid } = useParams();
  const { courses } = useSelector((state: any) => state.coursesReducer);
  const course = courses.find((course: any) => course._id === cid);

  return (
      <div id="wd-courses">
        <h2 className="text-danger">
            <FaAlignJustify
              className="me-4 fs-4 mb-1"
              onClick={() => dispatch(toggleNavigation())}
            />
            {course?.name}
            <Breadcrumb course={course} />
        </h2> <hr />
        <div className="d-flex">
          { showNavigation && (
            <div className="d-none d-md-block">
              <CourseNavigation />
            </div>
          )}
          <div className="flex-fill">
            {children}
          </div></div>
      </div>

);}
