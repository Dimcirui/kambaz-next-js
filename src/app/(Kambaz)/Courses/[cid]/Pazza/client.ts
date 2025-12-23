import axios from "axios";

const REMOTE_SERVER = process.env.NEXT_PUBLIC_REMOTE_SERVER || "http://localhost:4000";

export interface PazzaPost {
  _id: string;
  course: string;
  title: string;
  details: string;
  type: "QUESTION" | "NOTE";
  folders: string[];
  author: string;
  date: string;
  views: number;
  
  studentAnswer?: any;
  instructorAnswer?: any;
  followups?: any[];
}

export const findPostsForCourse = async (cid: string) => {
  const response = await axios.get(`${REMOTE_SERVER}/api/courses/${cid}/pazza`);
  return response.data;
};

export const createPost = async (cid: string, post: any) => {
  const response = await axios.post(`${REMOTE_SERVER}/api/courses/${cid}/pazza`, post);
  return response.data;
};

// 后续还会用到 update 和 delete，先预留
export const updatePost = async (pid: string, post: any) => {
    const response = await axios.put(`${REMOTE_SERVER}/api/pazza/${pid}`, post);
    return response.data;
};

export const deletePost = async (pid: string) => {
    const response = await axios.delete(`${REMOTE_SERVER}/api/pazza/${pid}`);
    return response.data;
};