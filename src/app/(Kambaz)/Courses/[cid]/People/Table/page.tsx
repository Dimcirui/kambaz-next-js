"use client"
import { Table, Button, Row, Col, FormSelect, Container } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { useParams } from "next/navigation";
// import * as db from "../../../../Database";
import * as client from "../../../../Courses/client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUsers, deleteUser, addUser } from "../reducer";

export default function PeopleTable() {
    const { cid } = useParams();
    // const { users, enrollments } = db;
    const dispatch = useDispatch();

    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const { users: enrolledUsers } = useSelector(
        (state: any) => state.peopleReducer
    );

    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [unassignedUsers, setUnassignedUsers] = useState<any[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string>("");

    const fetchAllData = async () => {
        if (!cid) return;
            const enrolled = await client.findUsersInCourse(cid as string);
            dispatch(setUsers(enrolled));

            const all = await client.findAllUsers();
            setAllUsers(all);

            const enrolledIds = new Set(enrolled.map((u: any) => u._id));
            const unassigned = all.filter(
                (u: any) => !enrolledIds.has(u._id)
            );
            setUnassignedUsers(unassigned);
            if (unassigned.length > 0) {
                setSelectedUserId(unassigned[0]._id);
            }
        };

    useEffect(() => {
        fetchAllData();
    }, [cid, dispatch]);

    // useEffect(() => {
    //     const fetchUsersInCourse = async () => {
    //         if (cid) {
    //             const users = await client.findUsersInCourse(cid);
    //             dispatch(setUsers(users));
    //         }
    //     };
    //     fetchUsersInCourse();
    // }, [cid, dispatch]);

    const handleEnroll = async () => {
        if (cid && selectedUserId) {
            await client.facultyEnrollUser(cid as string, selectedUserId);

            const enrolledUser = allUsers.find(u => u._id === selectedUserId);
            if (enrolledUser) {
                dispatch(addUser(enrolledUser));
            }
            setUnassignedUsers(unassignedUsers.filter(u => u._id !== selectedUserId));
            setSelectedUserId(unassignedUsers[0]?._id || "");
        }
    };

    const handleUnenroll = async (userId: string) => {
        if (cid) {
            await client.facultyUnenrollUser(cid as string, userId);
            dispatch(deleteUser(userId));

            const unenrolledUser = allUsers.find(u => u._id === userId);
            if (unenrolledUser) {
                setUnassignedUsers([...unassignedUsers, unenrolledUser]);
            }
        }
    }
    
    return (
    <div id="wd-people-table">
        {currentUser?.role === "FACULTY" && (
            <div className="mb-4">
            <h3>Enroll a User</h3>
            <Row>
                <Col md={10}>
                <FormSelect
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                >
                    <option value="">Select a user to enroll</option>
                    {unassignedUsers.map((user) => (
                    <option key={user._id} value={user._id}>
                        {user.firstName} {user.lastName} ({user.loginId})
                    </option>
                    ))}
                </FormSelect>
                </Col>
                <Col md={2} className="d-grid">
                <Button
                    variant="success"
                    onClick={handleEnroll}
                    disabled={!selectedUserId}
                >
                    Enroll
                </Button>
                </Col>
            </Row>
            <hr />
            </div>
        )}

        <h3>Enrolled Users</h3>
        <Table striped>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Login ID</th>
                    <th>Section</th>
                    <th>Role</th>
                    <th>Last Activity</th>
                    <th>Total Activity</th>
                </tr>
            </thead>
            
            <tbody>
                {enrolledUsers.map((user: any) => (
                    <tr key={user._id}>
                    <td className="wd-full-name text-nowrap">
                        <FaUserCircle className="me-2 fs-1 text-secondary" />
                        <span className="wd-first-name">{user.firstName}</span>
                        <span className="wd-last-name">{user.lastName}</span>
                    </td>
                    <td className="wd-login-id">{user.loginId}</td>
                    <td className="wd-section">{user.section}</td>
                    <td className="wd-role">{user.role}</td>

                    {currentUser?.role === "FACULTY" && (
                        <td>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleUnenroll(user._id)}
                            disabled={currentUser?._id === user._id}
                        >
                            Unenroll
                        </Button>
                        </td>
                    )}
                    </tr>
                ))}
                {/* {users
                    // .filter((usr) =>
                    // enrollments.some((enrollment) => enrollment.user === usr._id && enrollment.course === cid)
                    // )
                    .map((user: any) => (
                    <tr key={user._id}>
                        <td className="wd-full-name text-nowrap">
                        <FaUserCircle className="me-2 fs-1 text-secondary" />
                        <span className="wd-first-name">{user.firstName}</span>
                        <span className="wd-last-name">{user.lastName}</span>
                        </td>
                        <td className="wd-login-id">{user.loginId}</td>
                        <td className="wd-section">{user.section}</td>
                        <td className="wd-role">{user.role}</td>
                        <td className="wd-last-activity">{user.lastActivity}</td>
                        <td className="wd-total-activity">{user.totalActivity}</td>
                        {currentUser?.role === "FACULTY" && (
                            <td>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDeleteUser(user._id)}
                            >
                                Delete
                            </Button>
                            </td>
                        )}
                    </tr>
                ))} */}
            </tbody>
        </Table>
    </div>
    );
}