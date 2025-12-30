"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Col, Container, Form, Row, Spinner, Badge, Nav, Dropdown } from "react-bootstrap";
import { FaSearch, FaPlus, FaQuestion, FaStickyNote, FaUser, FaRegcircle, FaBars } from "react-icons/fa";
import * as client from "./client";
import PostEditor from "./PostEditor";
import AnswerSection from "./AnswerSection";
import FollowupSection from "./FollowupSection";
import ManageFolders from "./ManageFolders";
import ClassAtAGlance from "./ClassAtAGlance";

const styles = {
  topHeaderBg: "#3b5998", 
  topHeaderColor: "#ffffff",
  
  tabInactiveBg: "#f6f6f6",
  tabActiveBg: "#ffffff",
  tabBorder: "#dddddd",
  
  sidebarBg: "#f2f2f2",
  
  postSelectedBg: "#e1ecf4",
  postSelectedBorder: "#2976a3",
  
  questionIconColor: "#cf6d29",
  noteIconColor: "#2976a3",
};

export default function Pazza() {
  const { cid } = useParams();
  
  const [posts, setPosts] = useState<client.PazzaPost[]>([]);
  const [folders, setFolders] = useState<client.PazzaFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<client.PazzaPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("ALL");
  const [filterType, setFilterType] = useState("All Posts");
  
  const [activeTab, setActiveTab] = useState<"QA" | "MANAGE">("QA");
  const [showEditor, setShowEditor] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

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
      console.error("Failed to load posts/folders:", error);
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

  const getSnippet = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || "";
    return text.substring(0, 80) + (text.length > 80 ? "..." : "");
  };

  if (loading) {
    return <div className="p-5 text-center"><Spinner animation="border" /></div>;
  }

  if (activeTab === "MANAGE") {
      return (
          <Container fluid className="h-100 d-flex flex-column bg-light p-0">
             <div className="px-3 py-2 d-flex justify-content-between align-items-center" 
                  style={{ backgroundColor: styles.topHeaderBg, color: styles.topHeaderColor }}>
                <div className="fw-bold fs-5">{cid} Piazza</div>
                <Nav className="small">
                    <Nav.Link onClick={() => setActiveTab("QA")} className="text-white-50">Q & A</Nav.Link>
                    <Nav.Link className="text-white fw-bold active">Manage Class</Nav.Link>
                </Nav>
             </div>
             <div className="p-0 flex-grow-1 bg-white overflow-auto">
                 <ManageFolders cid={cid as string} folders={folders} onFoldersChange={fetchData} />
             </div>
          </Container>
      );
  }

  return (
    <Container fluid className="h-100 d-flex flex-column p-0">

      {/* --- Header --- */}
      <div className="px-3 py-1 d-flex justify-content-between align-items-center shadow-sm" 
           style={{ backgroundColor: styles.topHeaderBg, color: styles.topHeaderColor, height: "50px", zIndex: 10 }}>
        
        <div className="d-flex align-items-center gap-3">
             <span className="fw-bold fs-5" style={{ letterSpacing: "1px" }}>piazza</span>
             <span className="opacity-50">|</span>
             <span className="fw-bold">{cid}</span>
        </div>

        <div className="d-flex align-items-center gap-4 small fw-bold">
            <span className="cursor-pointer text-white border-bottom border-2 border-white pb-1">Q & A</span>
            <span className="cursor-pointer text-white-50 hover-text-white">Resources</span>
            <span className="cursor-pointer text-white-50 hover-text-white">Statistics</span>
            {currentUser?.role === "FACULTY" && (
                <span className="cursor-pointer text-white-50 hover-text-white" onClick={() => setActiveTab("MANAGE")}>Manage Class</span>
            )}
        </div>

        <div className="d-flex align-items-center gap-2 small">
            <FaUser />
            <span>{currentUser?.username || "Guest"}</span>
        </div>
      </div>

      <Row className="flex-grow-1" style={{ minHeight: "0" }}>
        
        {/* --- Left Sidebar --- */}
        <Col md={3} className="d-flex flex-column border-end" style={{ backgroundColor: styles.sidebarBg }}>
            
            {/* Header: New Post + Search */}
            <div className="p-2 border-bottom d-flex gap-2 align-items-center bg-white">
                <Button 
                    variant="primary" 
                    size="sm"
                    className="fw-bold text-nowrap" 
                    onClick={() => { setShowEditor(true); setSelectedPost(null); }}
                >
                    New Post
                </Button>
                
                <div className="position-relative flex-grow-1">
                    <Form.Control 
                        size="sm"
                        placeholder="Search or add a post..." 
                        className="bg-light"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Dropdown */}
            <div className="px-2 py-1 border-bottom bg-light d-flex justify-content-between align-items-center" style={{ fontSize: "0.85rem" }}>
                <Dropdown>
                    <Dropdown.Toggle variant="link" id="dropdown-basic" className="text-dark text-decoration-none p-0 fw-bold border-0 shadow-none" size="sm">
                        {filterType}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setFilterType("All Posts")}>All Posts</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilterType("Unread Posts")}>Unread Posts</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilterType("Unresolved Posts")}>Unresolved Posts</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilterType("Following")}>Following</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                
                <div className="text-muted cursor-pointer">
                    <FaBars />
                </div>
            </div>

            {/* Post List */}
            <div className="overflow-auto flex-grow-1 bg-white">
                {filteredPosts.length === 0 && <div className="text-center p-4 text-muted small">No posts found.</div>}
                
                {filteredPosts.map((post) => {
                    const isSelected = selectedPost?._id === post._id && !showEditor;
                    return (
                        <div 
                            key={post._id}
                            onClick={() => { setSelectedPost(post); setShowEditor(false); }}
                            className="p-2 border-bottom cursor-pointer position-relative"
                            style={{ 
                                backgroundColor: isSelected ? styles.postSelectedBg : "white",
                                minHeight: "60px"
                            }}
                        >
                            {isSelected && (
                                <div className="position-absolute top-0 start-0 bottom-0" 
                                     style={{ width: "4px", backgroundColor: styles.postSelectedBorder }}></div>
                            )}

                            <div className="ps-2">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <div className="d-flex align-items-center text-truncate fw-bold" style={{ maxWidth: "80%", fontSize: "0.9rem" }}>
                                        {post.type === "QUESTION" ? 
                                            <FaQuestion className="me-2 flex-shrink-0" style={{ color: styles.questionIconColor, fontSize: "0.8rem" }} /> : 
                                            <FaStickyNote className="me-2 flex-shrink-0" style={{ color: styles.noteIconColor, fontSize: "0.8rem" }} />
                                        }
                                        <span className="text-truncate text-dark">{post.title}</span>
                                    </div>
                                    <small className="text-secondary" style={{ fontSize: "0.7rem" }}>
                                        {new Date(post.date).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}
                                    </small>
                                </div>
                                <div className="text-secondary text-truncate small ps-3" style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                                    {getSnippet(post.details)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Col>

        {/* --- Right Content --- */}
        <Col md={9} className="d-flex flex-column h-100 bg-white">
            
            {/* Folder Tabs */}
            <div className="px-3 pt-2 border-bottom bg-light d-flex align-items-end" style={{ minHeight: "40px" }}>
                <div 
                    className={`px-3 py-1 small fw-bold border border-bottom-0 rounded-top me-1 cursor-pointer ${selectedFolder === "ALL" ? "bg-white text-dark" : "text-secondary"}`}
                    style={{ 
                        backgroundColor: selectedFolder === "ALL" ? styles.tabActiveBg : styles.tabInactiveBg,
                        borderColor: styles.tabBorder,
                        top: "1px", position: "relative"
                    }}
                    onClick={() => setSelectedFolder("ALL")}
                >
                    All Posts
                </div>
                {folders.map((folder) => (
                    <div 
                        key={folder._id}
                        className={`px-3 py-1 small fw-bold border border-bottom-0 rounded-top me-1 cursor-pointer ${selectedFolder === folder.name ? "bg-white text-dark" : "text-secondary"}`}
                        style={{ 
                            backgroundColor: selectedFolder === folder.name ? styles.tabActiveBg : styles.tabInactiveBg,
                            borderColor: styles.tabBorder,
                            top: "1px", position: "relative",
                            whiteSpace: "nowrap"
                        }}
                        onClick={() => setSelectedFolder(folder.name)}
                    >
                        {folder.name}
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="flex-grow-1 overflow-auto p-0">
                {showEditor ? (
                    <div className="p-4">
                        <PostEditor 
                            onCancel={() => setShowEditor(false)}
                            onSave={handleCreatePost}
                            availableFolders={folders.map(f => f.name)} 
                        />
                    </div>
                ) : selectedPost ? (
                    <div className="p-4 h-100">
                        <div className="mb-3">
                            <h3 className="mb-2 fw-bold text-dark">{selectedPost.title}</h3>
                            <div className="d-flex gap-1">
                                {selectedPost.folders.map(f => (
                                    <Badge key={f} bg="light" text="dark" className="border fw-normal">{f}</Badge>
                                ))}
                            </div>
                        </div>
                        
                        <div className="d-flex align-items-center text-muted mb-4 pb-2 border-bottom small">
                            {selectedPost.type === "QUESTION" ? 
                                <span className="badge bg-danger me-2">Question</span> : 
                                <span className="badge bg-primary me-2">Note</span>
                            }
                            <span className="fw-bold text-dark me-2">{selectedPost.author}</span>
                            <span>posted on {new Date(selectedPost.date).toLocaleString()}</span>
                            <span className="ms-auto text-primary cursor-pointer" onClick={handleDeletePost}>Delete</span>
                        </div>

                        <div className="mb-5 ql-editor" style={{ padding: 0 }} dangerouslySetInnerHTML={{ __html: selectedPost.details }} />

                        <AnswerSection 
                            title="Student Answer" 
                            variant="student" 
                            answer={selectedPost.studentAnswer} 
                            onSave={(text) => handleUpdateAnswer("STUDENT", text)} 
                            isEditable={currentUser?.role === "STUDENT" || currentUser?.role === "FACULTY"} 
                        />
                        <AnswerSection 
                            title="Instructor Answer" 
                            variant="instructor" 
                            answer={selectedPost.instructorAnswer} 
                            onSave={(text) => handleUpdateAnswer("INSTRUCTOR", text)} 
                            isEditable={currentUser?.role === "FACULTY"} 
                        />
                        
                        <hr className="my-5" />
                        <FollowupSection followups={selectedPost.followups || []} onUpdate={handleUpdateFollowups} />
                    </div>
                ) : (
                    <ClassAtAGlance posts={posts} />
                )}
            </div>
        </Col>
      </Row>
    </Container>
  );
}