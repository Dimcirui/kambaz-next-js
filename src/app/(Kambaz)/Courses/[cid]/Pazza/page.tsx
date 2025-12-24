"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Col, Container, Form, Nav, Row, Spinner, Badge, Card } from "react-bootstrap";
import { FaSearch, FaPlus, FaQuestionCircle, FaStickyNote, FaUser, FaTrash } from "react-icons/fa";
import * as client from "./client";
import PostEditor from "./PostEditor";
import AnswerSection from "./AnswerSection";
import FollowupSection from "./FollowupSection";
import ManageFolders from "./ManageFolders";

export default function Pazza() {
  const { cid } = useParams();
  
  const [posts, setPosts] = useState<client.PazzaPost[]>([]);
  const [folders, setFolders] = useState<client.PazzaFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<client.PazzaPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("ALL");
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [activeTab, setActiveTab] = useState<"QA" | "MANAGE">("QA");
  const [showEditor, setShowEditor] = useState(false);

  const fetchData = async () => {
    if (!cid) return;
    try {
      const [postsData, foldersData] = await Promise.all([
          client.findPostsForCourse(cid as string),
          client.findFoldersForCourse(cid as string),
      ]);
      setPosts(postsData);
      setFolders(foldersData);
    } catch (error) {
      console.error(error);
    }

    try {
      const userData = await client.fetchProfile();
      setCurrentUser(userData);
    } catch (error) {
      console.warn("Fetch profile failed, falling back to guest mode.");
      setCurrentUser({ _id: "guest", username: "Guest User", role: "STUDENT" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [cid]);

  const handleCreatePost = async (newPostData: any) => {
    if (!cid || !currentUser) return;
    try {
        const postWithAuthor = {
            ...newPostData,
            author: currentUser.username || currentUser.firstName,
        };
        const createdPost = await client.createPost(cid as string, postWithAuthor);
        await fetchData();
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
        author: currentUser.username,
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

        fetchData(); 
        
    } catch (error) {
        console.error("Failed to update answer", error);
        alert("Failed to save answer.");
    }
  };

  const handleDeletePost = async () => {
    if (!selectedPost) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this post? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
        await client.deletePost(selectedPost._id);
        
        setSelectedPost(null);
        fetchData();
        alert("Post deleted successfully.");
    } catch (error) {
        console.error("Failed to delete post:", error);
        alert("Could not delete the post. Please try again.");
    }
};

  const handleUpdateFollowups = async (newFollowups: any[]) => {
    if (!selectedPost || !cid || !currentUser) return;

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

  if (activeTab === "MANAGE") {
      return (
          <Container fluid className="h-100 d-flex flex-column">
             {/* Top Navigation */}
             <div className="border-bottom p-3 bg-white">
                <Nav variant="tabs" activeKey={activeTab}>
                    <Nav.Item>
                        <Nav.Link onClick={() => setActiveTab("QA")}>Q&A</Nav.Link>
                    </Nav.Item>
                    {currentUser?.role === "FACULTY" && (
                        <Nav.Item>
                            <Nav.Link onClick={() => setActiveTab("MANAGE")}>Manage Class</Nav.Link>
                        </Nav.Item>
                    )}
                </Nav>
             </div>
             <div className="p-4 bg-light flex-grow-1">
                 <ManageFolders 
                    cid={cid as string} 
                    folders={folders} 
                    onFoldersChange={fetchData} 
                 />
             </div>
          </Container>
      );
  }

  return (
    <Container fluid className="h-100 d-flex flex-column">
      {/* --- Top: Navigation & Filters --- */}
      <div className="border-bottom p-3 bg-light">
        <div className="d-flex justify-content-between align-items-center mb-3">
             <h3 className="mb-0">Pazza Q&A - {cid}</h3>
             <Nav variant="pills" activeKey={activeTab}>
                <Nav.Item>
                    <Nav.Link onClick={() => setActiveTab("QA")} active>Q&A</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link onClick={() => setActiveTab("MANAGE")}>Manage Class</Nav.Link>
                </Nav.Item>
             </Nav>
        </div>
        
        {/* Folder Filters */}
        <div className="d-flex gap-2 overflow-auto pb-2">
            <Button 
                variant={selectedFolder === "ALL" ? "dark" : "outline-secondary"}
                size="sm"
                onClick={() => setSelectedFolder("ALL")}
            >
                ALL
            </Button>
            {folders.map((folder) => (
                <Button 
                    key={folder._id} 
                    variant={selectedFolder === folder.name ? "dark" : "outline-secondary"}
                    size="sm"
                    onClick={() => setSelectedFolder(folder.name)}
                    className="text-nowrap"
                >
                    {folder.name}
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

            {/* Posts List */}
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
                    availableFolders={folders.map(f => f.name)}
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

                    <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={handleDeletePost}
                        title="Delete Post"
                    >
                        <FaTrash className="me-1" /> Delete
                    </Button>

                    <div className="d-flex align-items-center text-muted mb-4 border-bottom pb-3">
                        <FaUser className="me-2" />
                        <span className="fw-bold me-3">{selectedPost.author}</span>
                        <span className="me-3">|</span>
                        <span>{new Date(selectedPost.date).toLocaleString()}</span>
                        <span className="ms-auto">Views: {selectedPost.views}</span>
                    </div>

                    <div 
                        className="mb-5 ql-editor"
                        style={{ padding: 0 }}
                        dangerouslySetInnerHTML={{ __html: selectedPost.details }} 
                    />

                    <AnswerSection 
                        title="Student Answer"
                        variant="student"
                        answer={selectedPost.studentAnswer}
                        onSave={(text) => handleUpdateAnswer("STUDENT", text)}
                        isEditable={currentUser?.role === "STUDENT"}
                    />

                    <AnswerSection 
                        title="Instructor Answer"
                        variant="instructor"
                        answer={selectedPost.instructorAnswer}
                        onSave={(text) => handleUpdateAnswer("INSTRUCTOR", text)}
                        isEditable={currentUser?.role === "FACULTY" || currentUser?.role === "TA"}
                    />

                    <hr className="my-5" />
                    <FollowupSection 
                        followups={selectedPost.followups || []} 
                        onUpdate={handleUpdateFollowups}
                    />
                </div>
            ) : (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted p-5">
                    <h4>Select a post or create a new one</h4>
                    {folders.length === 0 && <p className="text-danger">Tip: Go to &quot;Manage Class&quot; to create some folders first!</p>}
                </div>
            )}
        </Col>
      </Row>
    </Container>
  );
}