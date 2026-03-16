import React, { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Paper,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Box,
    Avatar,
    IconButton,
    Divider,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Editor from "./Editor";
const APP_URL = import.meta.env.VITE_API_URL; 

import axios from "axios";
import { Link } from "react-router-dom";
import { marked } from "marked";
import { openPreview } from "../util";

const USER_API = `${APP_URL}/api/users`;
const BLOG_API = `${APP_URL}/api/blogs`;

const generatePreview = async (arg: string) => {
//     const parser = new DOMParser();
//     const markedHtml = await marked(arg);
//     const unescaped = parser.parseFromString(markedHtml, 'text/html').documentElement.textContent;
//     console.log("Unescaped HTML:", unescaped);
//     const previewWindow = window.open("", "_blank", "width=800,height=600");

//     if (previewWindow) {
//         previewWindow.document.open();
//         previewWindow.document.write(`
//     <!DOCTYPE html>
//     <html>
//       <head><title>Preview</title></head>
//       <body>${unescaped}</body>
//     </html>
//   `);
//         previewWindow.document.close();
//     }
 await openPreview(arg)
}
const CreateBlog: React.FC = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState(""); // HTML content
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userExists, setUserExists] = useState<boolean | null>(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [signupLoading, setSignupLoading] = useState(false);
    const [signupError, setSignupError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const { user } = useUser();

    // Check if user exists in backend (users API on port 3000)
    useEffect(() => {
        const checkUser = async () => {
            if (!user?.id) return;
            setUserExists(null);
            try {
                const token = await getToken();
                const res = await axios.get(`${USER_API}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (res.data) {
                    setUserExists(true);
                } else {
                    setUserExists(false);
                }
            } catch {
                setUserExists(false);
            }
        };
        checkUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    // Handle user signup (users API on port 3000)
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setSignupLoading(true);
        setSignupError(null);
        try {
            const token = await getToken();
            await axios.post(
                USER_API,
                {
                    firstName,
                    lastName,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUserExists(true);
        } catch (err: any) {
            setSignupError(err.response?.data?.error || "Failed to create user");
        } finally {
            setSignupLoading(false);
        }
    };

    // Handle blog creation (blogs API on port 3001)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            await axios.post(
                BLOG_API,
                {
                    title,
                    content,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            navigate("/blogs");
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to create blog");
        } finally {
            setLoading(false);
        }
    };

    // Header with title and user icon
    const Header = (
        <AppBar position="static" color="primary" elevation={2}>
            <Toolbar>
                <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700 }}>
                    <Link to={"/blogs"}>
                        FellowBlog
                    </Link>
                </Typography>
                <IconButton color="inherit" size="large">
                    {user?.imageUrl ? (
                        <Avatar src={user.imageUrl} alt={user.fullName || "User"} />
                    ) : (
                        <AccountCircleIcon fontSize="large" />
                    )}
                </IconButton>
            </Toolbar>
        </AppBar>
    );

    // Show loading while checking user
    if (userExists === null) {
        return (
            <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
                {Header}
                <Container maxWidth="sm" sx={{ mt: 4 }}>
                    <Paper sx={{ p: 3 }}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <CircularProgress size={24} />
                            <Typography>Checking user profile...</Typography>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        );
    }

    // If user does not exist, show signup form
    if (userExists === false) {
        return (
            <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
                {Header}
                <Container maxWidth="sm" sx={{ mt: 4 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Complete Your Profile
                        </Typography>
                        <Box component="form" onSubmit={handleSignup} noValidate>
                            <TextField
                                label="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                fullWidth
                                margin="normal"
                            />
                            {signupError && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    {signupError}
                                </Alert>
                            )}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={signupLoading}
                                sx={{ mt: 2 }}
                            >
                                {signupLoading ? <CircularProgress size={24} /> : "Create Profile"}
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        );
    }

    // If user exists, show blog creation form
    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
            {Header}
            <Box
                sx={{
                    width: "100vw",
                    height: "calc(100vh - 64px)", // 64px is default AppBar height
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 0,
                    p: 0,
                }}
            >
                {/* Editor Section */}
                <Box
                    sx={{
                        flex: "1 1 50%",
                        width: { xs: "100%", md: "50vw" },
                        height: "100%",
                        display: "flex",
                        alignItems: "stretch",
                        bgcolor: "#fff",
                        p: { xs: 2, md: 4 },
                        boxSizing: "border-box",
                    }}
                >
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ width: "100%" }}
                    >
                        <Typography variant="h5" gutterBottom>
                            Create Blog
                        </Typography>
                        <TextField
                            label="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                        />
                        <Box sx={{ mt: 2, mb: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Content
                            </Typography>
                            <Editor value={content} onChange={setContent} height={400} />
                        </Box>
                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={!user || loading}
                            sx={{ mt: 2 }}
                        >
                            {loading ? <CircularProgress size={24} /> : "Create"}
                        </Button>
                    </Box>
                </Box>
                {/* Preview Section */}
                <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" } }} />
                <Box
                    sx={{
                        flex: "1 1 50%",
                        width: { xs: "100%", md: "50vw" },
                        height: "100%",
                        bgcolor: "#fafafa",
                        borderRadius: 0,
                        p: { xs: 2, md: 4 },
                        boxSizing: "border-box",
                        boxShadow: 1,
                        overflow: "auto",
                    }}
                >
                    <Typography variant="subtitle1" gutterBottom>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => generatePreview(content)}
                            sx={{ ml: "auto", mb: 1 }}
                        >
                            Preview
                        </Button>
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        {title}
                    </Typography>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: ` 
            <html>
              <head>
                <title>Preview</title>
                <style>
                  body { font-family: sans-serif; background: #fafafa; }
                  h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; }
                  pre { background: #eee; border-radius: 6px; }
                </style>
              </head>
              <body>${marked(content) || ''}</body>
            </html>
            `
                        }}
                        style={{ minHeight: 200 }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default CreateBlog;