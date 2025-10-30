"use client";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Modules from "../Modules/page";
import CourseStatus from "./Status";

export default function Home() {
  const { cid } = useParams();
  const router = useRouter();

  const { enrolledCourses } = useSelector((state: any) => state.enrollmentsReducer);

  const isEnrolled = enrolledCourses.includes(cid as string);

  useEffect(() => {
    if (!isEnrolled) {
      router.push("/(Kambaz)/Courses");
    }
  }, [isEnrolled, router]);

  return (
    <div id="wd-home">
      <div className="d-flex" id="wd-home">
        <div className="flex-fill me-3">
          <Modules />
        </div>
        <div className="d-none d-lg-block">
          <CourseStatus />
        </div>
      </div>
    </div>
);}
