import React from "react";
import { Link } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
    Card,
    CardContent,
    CardActionArea,
    Paper,
    Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAllBlogs } from "../hooks/useBlogData";

const AllBlogs: React.FC = () => {
    const { blogs, loading, error } = useAllBlogs();

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
            {/* Header */}
            <AppBar position="static" color="primary" elevation={2}>
                <Toolbar>
                    <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700 }}>
                        <Link to={"/blogs"}>
                            FellowBlog
                        </Link>
                    </Typography>
                    <Button
                        component={Link}
                        to="/blogs/create"
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon />}
                        sx={{ fontWeight: 600 }}
                    >
                        Create Blog
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Body */}
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                {loading && (
                    <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                        Loading...
                    </Typography>
                )}
                {error && (
                    <Typography variant="h6" color="error" align="center" sx={{ mt: 4 }}>
                        {error}
                    </Typography>
                )}
                {blogs.length === 0 && !loading && (
                    <Paper sx={{ p: 4, textAlign: "center" }}>
                        <Typography variant="h6">No blogs found.</Typography>
                    </Paper>
                )}
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    gap={4}
                    justifyContent="flex-start"
                    alignItems="stretch"
                    sx={{ mt: 2 }}
                >
                    {Array.isArray(blogs) && blogs.map((blog) => (
                        <Box
                            key={blog.id}
                            sx={{
                                width: "100%",
                                maxWidth: 400,
                                minWidth: 260,
                                flexGrow: 1,
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Card
                                sx={{
                                    width: "100%",
                                    maxWidth: 400,
                                    height: 300,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "flex-end",
                                    background: "#111",
                                    color: "#fff",
                                    boxShadow: 6,
                                    borderRadius: 3,
                                    position: "relative",
                                    overflow: "hidden",
                                    transition: "box-shadow 0.2s",
                                    "&:hover": {
                                        boxShadow: 12,
                                    },
                                    textDecoration: "none",
                                }}
                            >
                                <CardActionArea
                                    component={Link}
                                    to={`/blogs/${blog.id}`}
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "flex-end",
                                        alignItems: "stretch",
                                        p: 0,
                                        background: "transparent",
                                    }}
                                >
                                    {/* Fake "picture" with gibberish blurry text */}
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "80%",
                                            bgcolor: "#111",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            filter: "blur(1.5px) brightness(0.8)",
                                            zIndex: 1,
                                            px: 2,
                                            userSelect: "none",
                                        }}
                                    >
                                        <Typography
                                            variant="h2"
                                            sx={{
                                                fontWeight: 700,
                                                color: "#444",
                                                opacity: 0.4,
                                                fontSize: { xs: "2.5rem", md: "3rem" },
                                                letterSpacing: 2,
                                                textAlign: "left",
                                                width: "100%",
                                                textShadow: "0 2px 8px #000",
                                                whiteSpace: "pre-line",
                                            }}
                                        >
                                            {blog.content.substring(50,200)}
                                        </Typography>
                                    </Box>
                                    {/* Card Footer */}
                                    <CardContent
                                        sx={{
                                            mt: "auto",
                                            bgcolor: "#fff",
                                            borderTop: "1px solid #eee",
                                            width: "100%",
                                            px: 2,
                                            py: 1.5,
                                            position: "absolute",
                                            bottom: 0,
                                            left: 0,
                                            zIndex: 2,
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                color: "#111",
                                                mb: 0.5,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                textAlign: "left",
                                            }}
                                        >
                                            {blog.title}
                                        </Typography>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                color: "#444",
                                                fontWeight: 400,
                                                fontSize: "1rem",
                                                textAlign: "left",
                                            }}
                                        >
                                            {blog.firstName} {blog.lastName}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Box>
                    ))}
                </Stack>
            </Container>
        </Box>
    );
};

export default AllBlogs;