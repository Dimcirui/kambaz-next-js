// path: src/app/(Kambaz)/Courses/[cid]/Quizzes/[qid]/Questions/page.tsx
"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Nav } from "react-bootstrap";

export default function QuizQuestionsPage() {
  const params = useParams();
  const cid = params.cid as string;
  const qid = params.qid as string;
  const pathname = usePathname();
  const activeTab = pathname?.includes("/Questions")
    ? "questions"
    : "details";

  return (
    <div className="p-4">
      <Nav variant="tabs" activeKey={activeTab} className="mb-3">
        <Nav.Item>
          <Nav.Link
            as={Link}
            href={`/Courses/${cid}/Quizzes/${qid}/Editor`}
            eventKey="details"
          >
            Details
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            href={`/Courses/${cid}/Quizzes/${qid}/Questions`}
            eventKey="questions"
          >
            Questions
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <h2>Quiz Questions</h2>
      {/* 这里实现题目列表、编辑等功能 */}
    </div>
  );
}
