import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Paper,
    CircularProgress,
    Alert,
    Box,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    Avatar,
    Button,
    TextField,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useBlog, useBlogComments, useUserById } from "../hooks/useBlogData";
import { Link } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { marked } from "marked";
const APP_URL = import.meta.env.VITE_API_URL; 

const COMMENTS_API = `${APP_URL}/api/comments`;

const SingleBlog: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { blog, loading: blogLoading, error: blogError } = useBlog(id);
    const { comments, loading: commentsLoading, error: commentsError } = useBlogComments(id);
    const { user: clerkUser } = useUser();
    const { getToken, isSignedIn } = useAuth();
    const navigate = useNavigate();

    // Check if user exists in backend (user table)
    const { user: backendUser, loading: userLoading } = useUserById(clerkUser?.id);

    const [commentText, setCommentText] = useState("");
    const [commentLoading, setCommentLoading] = useState(false);
    const [commentError, setCommentError] = useState<string | null>(null);
    const [showCommentForm, setShowCommentForm] = useState(false);

    // Header with blog icon and title
    const Header = (
        <AppBar position="static" color="primary" elevation={2}>
            <Toolbar>
                <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700 }}>
                    <Link to={"/blogs"} style={{ color: "inherit", textDecoration: "none" }}>
                        FellowBlog
                    </Link>
                </Typography>
            </Toolbar>
        </AppBar>
    );

    if (blogLoading || commentsLoading) {
        return (
            <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
                {Header}
                <Container maxWidth="md" sx={{ mt: 4 }}>
                    <Paper sx={{ p: 3, textAlign: "center" }}>
                        <CircularProgress />
                    </Paper>
                </Container>
            </Box>
        );
    }

    if (blogError || commentsError) {
        return (
            <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
                {Header}
                <Container maxWidth="md" sx={{ mt: 4 }}>
                    <Alert severity="error">{blogError || commentsError}</Alert>
                </Container>
            </Box>
        );
    }

    if (!blog) {
        return (
            <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
                {Header}
                <Container maxWidth="md" sx={{ mt: 4 }}>
                    <Alert severity="warning">Blog not found</Alert>
                </Container>
            </Box>
        );
    }

    // Show only the "Add Comment" button initially
    const handleShowCommentForm = () => {
        // If user is not present in backend, redirect to complete-signup (handles sign in too)
        if (!userLoading && !backendUser || !isSignedIn) {
            navigate("/complete-signup");
            return;
        }
        setShowCommentForm(true);
    };

    // Handle add comment
    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        setCommentError(null);

        // If user is not present in backend, redirect to complete-signup (which handles sign in if needed)
        if (!userLoading && !backendUser) {
            navigate("/complete-signup");
            return;
        }

        if (!commentText.trim()) {
            setCommentError("Comment cannot be empty.");
            return;
        }

        setCommentLoading(true);
        try {
            const token = await getToken();
            await axios.post(
                `${COMMENTS_API}/${id}`,
                {
                    content: commentText,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setCommentText("");
            window.location.reload();
        } catch (err: any) {
            setCommentError(err.response?.data?.error || "Failed to add comment");
        } finally {
            setCommentLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
            {Header}
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        {blog.title}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <PersonIcon fontSize="small" />
                        <Typography variant="subtitle2">
                            {blog.firstName} {blog.lastName}
                        </Typography>
                        <CalendarTodayIcon fontSize="small" sx={{ ml: 2 }} />
                        <Typography variant="subtitle2">
                            {blog.createdAt && new Date(blog.createdAt).toLocaleString()}
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <div
                        style={{ marginTop: "1em" }}
                        dangerouslySetInnerHTML={{ __html: `<html><body>${marked(blog.content)}</body></html>` }}
                    />
                </Paper>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Comments
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {/* Add Comment Button or Comment Form */}
                    {!showCommentForm ? (
                        <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleShowCommentForm}
                            >
                                Add Comment
                            </Button>
                        </Box>
                    ) : (
                        <Box component="form" onSubmit={handleAddComment} sx={{ mb: 3 }}>
                            <TextField
                                label="Add a comment"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                fullWidth
                                multiline
                                minRows={2}
                                disabled={commentLoading}
                            />
                            {commentError && (
                                <Alert severity="error" sx={{ mt: 1 }}>
                                    {commentError}
                                </Alert>
                            )}
                            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={commentLoading}
                                >
                                    Submit
                                </Button>
                            </Box>
                        </Box>
                    )}
                    <List
                        subheader={
                            <ListSubheader component="div">
                                {!comments || comments.length === 0 ? "No comments yet." : null}
                            </ListSubheader>
                        }
                    >
                        {comments && comments.length > 0
                            ? comments.map((c) => (
                                <ListItem alignItems="flex-start" key={c.id}>
                                    <Avatar sx={{ mr: 2 }}>
                                        <PersonIcon />
                                    </Avatar>
                                    <ListItemText
                                        primary={
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Typography variant="subtitle2">
                                                    {c.firstName} {c.lastName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {c.createdAt && new Date(c.createdAt).toLocaleString()}
                                                </Typography>
                                            </Box>
                                        }
                                        secondary={c.content}
                                    />
                                </ListItem>
                            ))
                            : null}
                    </List>
                </Paper>
            </Container>
        </Box>
    );
};

export default SingleBlog;