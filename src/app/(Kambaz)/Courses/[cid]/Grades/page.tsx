"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Table, Container, Spinner } from "react-bootstrap";
import * as client from "../../client";
import { useSelector } from "react-redux";

export default function Grades() {
  const { cid } = useParams();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      if (!currentUser || !cid) return;
      try {
        const data = await client.findGradesForStudent(currentUser._id);
        // Filter grades for the current course if assignments are nested correctly
        // Or assume the backend returns all and we filter here
        const courseGrades = data.filter((grade: any) => grade.assignment && grade.assignment.course === cid);
        setGrades(courseGrades);
      } catch (error) {
        console.error("Failed to fetch grades", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, [cid, currentUser]);

  if (loading) return <div className="p-5 text-center"><Spinner animation="border" /></div>;

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Grades</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Assignment</th>
            <th>Grade</th>
            <th>Weight</th>
          </tr>
        </thead>
        <tbody>
          {grades.length > 0 ? grades.map((grade) => (
            <tr key={grade._id}>
              <td>{grade.assignment.title}</td>
              <td className="text-center">{grade.grade}%</td>
              <td className="text-center">{grade.assignment.points} pts</td>
            </tr>
          )) : (
            <tr>
              <td colSpan={3} className="text-center">No grades available for this course.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}
