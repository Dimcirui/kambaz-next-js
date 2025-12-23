"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Col, Container, Form, Nav, Row, Spinner, Badge, Card } from "react-bootstrap";
import { FaSearch, FaPlus, FaQuestionCircle, FaStickyNote, FaUser } from "react-icons/fa";
import * as client from "./client";
import PostEditor from "./PostEditor";
import AnswerSection from "./AnswerSection";
import FollowupSection from "./FollowupSection";

export default function Pazza() {
  const { cid } = useParams();
  
  const [posts, setPosts] = useState<client.PazzaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<client.PazzaPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("ALL");
  const [showEditor, setShowEditor] = useState(false);

  const folders = ["ALL", "hw1", "hw2", "project", "exam", "logistics", "other"];

  const fetchPosts = async () => {
    if (!cid) return;
    try {
      const data = await client.findPostsForCourse(cid as string);
      setPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [cid]);

  const handleCreatePost = async (newPostData: any) => {
    if (!cid) return;
    try {
        const createdPost = await client.createPost(cid as string, newPostData);
        await fetchPosts();
        setSelectedPost(createdPost);
        setShowEditor(false);
    } catch (error) {
        console.error("Failed to create post", error);
        alert("Failed to create post. Check console.");
    }
  };

  const handleUpdateAnswer = async (type: "STUDENT" | "INSTRUCTOR", text: string) => {
    if (!selectedPost || !cid) return;

    const answerData = {
        text: text,
        author: "Me", // hardcoded for now
        date: new Date().toISOString()
    };

    const updates = type === "STUDENT" 
        ? { studentAnswer: answerData } 
        : { instructorAnswer: answerData };

    try {
        await client.updatePost(selectedPost._id, updates);
        
        setSelectedPost({
            ...selectedPost,
            ...updates
        });

        fetchPosts(); 
        
    } catch (error) {
        console.error("Failed to update answer", error);
        alert("Failed to save answer.");
    }
  };

  const handleUpdateFollowups = async (newFollowups: any[]) => {
    if (!selectedPost || !cid) return;

    try {
        await client.updatePost(selectedPost._id, { followups: newFollowups });
        
        setSelectedPost({
            ...selectedPost,
            followups: newFollowups
        });

    } catch (error) {
        console.error("Failed to update followups", error);
        alert("Failed to update discussion.");
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder === "ALL" || post.folders.includes(selectedFolder);
    return matchesSearch && matchesFolder;
  });

  if (loading) {
    return <div className="p-5 text-center"><Spinner animation="border" /></div>;
  }

  return (
    <Container fluid className="h-100 d-flex flex-column">
      {/* --- Top: Navigation & Filters --- */}
      <div className="border-bottom p-3 bg-light">
        <h3 className="mb-3">Pazza Q&A - {cid}</h3>
        
        {/* Folder Filters */}
        <div className="d-flex gap-2 overflow-auto pb-2">
            {folders.map((folder) => (
                <Button 
                    key={folder} 
                    variant={selectedFolder === folder ? "dark" : "outline-secondary"}
                    size="sm"
                    onClick={() => setSelectedFolder(folder)}
                    className="text-nowrap"
                >
                    {folder.toUpperCase()}
                </Button>
            ))}
        </div>
      </div>

      <Row className="flex-grow-1" style={{ minHeight: "600px" }}>
        
        {/* --- Left Sidebar: List of Posts --- */}
        <Col md={4} lg={3} className="border-end p-0 bg-white d-flex flex-column">
            {/* Search Bar & New Post Button */}
            <div className="p-2 border-bottom bg-secondary-subtle">
                <Button 
                    variant="primary" 
                    className="w-100 mb-2 fw-bold" 
                    onClick={() => { 
                        setShowEditor(true); 
                        setSelectedPost(null);
                    }}
                >
                    <FaPlus className="me-2" /> New Post
                </Button>
                <div className="position-relative">
                    <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                    <Form.Control 
                        placeholder="Search posts..." 
                        className="ps-5"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Posts List (Scrollable) */}
            <div className="overflow-auto flex-grow-1">
                {filteredPosts.length === 0 && (
                    <div className="text-center p-4 text-muted small">No posts found.</div>
                )}
                
                {filteredPosts.map((post) => (
                    <div 
                        key={post._id}
                        onClick={() => {
                            setSelectedPost(post);
                            setShowEditor(false);
                        }}
                        className={`p-3 border-bottom cursor-pointer ${selectedPost?._id === post._id && !showEditor ? "bg-primary-subtle border-start border-primary border-4" : "hover-bg-light"}`}
                        style={{ cursor: "pointer" }}
                    >
                        <div className="d-flex justify-content-between align-items-start mb-1">
                            <div className="fw-bold text-truncate" style={{ maxWidth: "80%" }}>
                                {post.type === "QUESTION" ? <FaQuestionCircle className="text-danger me-1" /> : <FaStickyNote className="text-warning me-1" />}
                                {post.title}
                            </div>
                            <small className="text-muted text-nowrap">
                                {new Date(post.date).toLocaleDateString()}
                            </small>
                        </div>
                        <div className="small text-muted text-truncate mb-1">
                            {post.details.replace(/<[^>]+>/g, '')}
                        </div>
                        <div className="d-flex gap-1 mt-2">
                             {post.folders.map(f => (
                                 <Badge key={f} bg="secondary" style={{fontSize: "0.6rem"}}>{f}</Badge>
                             ))}
                        </div>
                    </div>
                ))}
            </div>
        </Col>

        {/* --- Right Content: Post Details --- */}
        <Col md={8} lg={9} className="p-0 bg-light overflow-auto">
            {showEditor ? (
                <PostEditor 
                    onCancel={() => setShowEditor(false)}
                    onSave={handleCreatePost}
                    availableFolders={folders}
                />
            ) : selectedPost ? (
                <div className="bg-white p-4 h-100 shadow-sm">
                    <div className="d-flex align-items-center mb-3">
                        <h2 className="mb-0 flex-grow-1">
                            {selectedPost.type === "QUESTION" && <span className="badge bg-danger me-2">Q</span>}
                            {selectedPost.type === "NOTE" && <span className="badge bg-warning text-dark me-2">Note</span>}
                            {selectedPost.title}
                        </h2>
                    </div>

                    <div className="d-flex align-items-center text-muted mb-4 border-bottom pb-3">
                        <FaUser className="me-2" />
                        <span className="fw-bold me-3">{selectedPost.author}</span>
                        <span className="me-3">|</span>
                        <span>{new Date(selectedPost.date).toLocaleString()}</span>
                        <span className="ms-auto">Views: {selectedPost.views}</span>
                    </div>

                    <div className="mb-5" style={{ whiteSpace: "pre-wrap" }}>
                        {selectedPost.details}
                    </div>

                    <AnswerSection 
                        title="Student Answer"
                        variant="student"
                        answer={selectedPost.studentAnswer}
                        onSave={(text) => handleUpdateAnswer("STUDENT", text)}
                        isEditable={true}
                    />

                    <AnswerSection 
                        title="Instructor Answer"
                        variant="instructor"
                        answer={selectedPost.instructorAnswer}
                        onSave={(text) => handleUpdateAnswer("INSTRUCTOR", text)}
                        isEditable={true} // hardcoded true for testing, the real value should be role === "FACULTY"
                    />

                    <hr className="my-5" />
                    <FollowupSection 
                        followups={selectedPost.followups || []} 
                        onUpdate={handleUpdateFollowups}
                    />
                </div>
            ) : (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted p-5">
                    <h4>Select a post to view details</h4>
                    <p>or click &quot;New Post&quot; to start a discussion</p>
                </div>
            )}
        </Col>
      </Row>
    </Container>
  );
}