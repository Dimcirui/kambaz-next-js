import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const USERS_API = `${HTTP_SERVER}/api/users`;
const ASSIGNMENTS_API = `${HTTP_SERVER}/api/assignments`;
// const MODULES_API = `${HTTP_SERVER}/api/modules`;
// const ENROLLMENTS_API = `${HTTP_SERVER}/api/enrollments`;
// const PEOPLE_API = `${HTTP_SERVER}/api/people`;

// --- Course Functions ---
export const fetchAllCourses = async () => {
  const { data } = await axios.get(COURSES_API);
  return data;
};

export const createCourse = async (course: any) => {
  const { data } = await axiosWithCredentials.post(`${USERS_API}/current/courses`, course);
  return data;
};

export const deleteCourse = async (id: string) => {
  const { data } = await axios.delete(`${COURSES_API}/${id}`);
  return data;
};

export const updateCourse = async (course: any) => {
  const { data } = await axios.put(`${COURSES_API}/${course._id}`, course);
  return data;
};

export const findMyCourses = async () => {
  const { data } = await axiosWithCredentials.get(`${USERS_API}/current/courses`);
  return data;
};

export const findMyEnrollments = async () => {
  const { data } = await axiosWithCredentials.get(`${USERS_API}/current/enrollments`);
  return data;
};

// --- Module Functions ---
export const createModuleForCourse = async (courseId: string, module: any) => {
  const response = await axios.post(`${COURSES_API}/${courseId}/modules`, module);
  return response.data;
};

export const findModulesForCourse = async (courseId: string) => {
  const response = await axios.get(`${COURSES_API}/${courseId}/modules`);
  return response.data;
};

export const updateModule = async (courseId: string, module: any) => {
  const { data } = await axios.put(`${COURSES_API}/${courseId}/modules/${module._id}`, module);
  return data;
};

export const deleteModule = async (courseId: string, moduleId: string) => {
  const response = await axios.delete(`${COURSES_API}/${courseId}/modules/${moduleId}`);
  return response.data;
};

// --- Assignment Functions ---
export const findAssignmentsForCourse = async (courseId: string) => {
  const response = await axios.get(`${COURSES_API}/${courseId}/assignments`);
  return response.data;
};

export const createAssignment = async (courseId: string, assignment: any) => {
  const response = await axios.post(`${COURSES_API}/${courseId}/assignments`, assignment);
  return response.data;
};

export const updateAssignment = async (assignment: any) => {
  const response = await axios.put(`${ASSIGNMENTS_API}/${assignment._id}`, assignment);
  return response.data;
};

export const deleteAssignment = async (assignmentId: string) => {
  const response = await axios.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
  return response.data;
};

// --- Enrollment / User Functions ---
export const enrollInCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.post(`${USERS_API}/current/courses/${courseId}`);
  return response.data;
};

export const unenrollFromCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.delete(`${USERS_API}/current/courses/${courseId}`);
  return response.data;
};

export const findUsersInCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/users`);
  return data;
};

export const facultyEnrollUser = async (courseId: string, userId: string) => {
  const response = await axiosWithCredentials.post(`${USERS_API}/${userId}/courses/${courseId}`);
  return response.data;
};

export const facultyUnenrollUser = async (courseId: string, userId: string) => {
  const response = await axiosWithCredentials.delete(`${USERS_API}/${userId}/courses/${courseId}`);
  return response.data;
};

// --- User Management ---
export const findAllUsers = async () => {
  const { data } = await axios.get(USERS_API);
  return data;
};

export const createUser = async (user: any) => {
  const { data } = await axios.post(USERS_API, user);
  return data;
};

export const updateUser = async (user: any) => {
  const response = await axios.put(`${USERS_API}/${user._id}`, user);
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await axios.delete(`${USERS_API}/${userId}`);
  return response.data;
};

export const findUsersByRole = async (role: string) => {
  const { data } = await axios.get(`${USERS_API}?role=${role}`);
  return data;
};

export const findUsersByPartialName = async (name: string) => {
  const { data } = await axios.get(`${USERS_API}?name=${name}`);
  return data;
};