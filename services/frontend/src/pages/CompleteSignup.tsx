import React, { useState } from "react";
const APP_URL = import.meta.env.VITE_API_URL; 

import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import { useAuth, SignInButton } from "@clerk/clerk-react";
import axios from "axios";

const USER_API = `${APP_URL}/api/users`;

const CompleteSignup: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getToken, isSignedIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      await axios.post(
        USER_API,
        { firstName, lastName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = "/blogs";
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to complete signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", display: "flex", alignItems: "center" }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Complete Your Profile
          </Typography>
          {!isSignedIn ? (
            <Box sx={{ mt: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Please sign in to continue
              </Typography>
              <SignInButton mode="modal">
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "1rem",
                    bgcolor: "#4285F4",
                    "&:hover": { bgcolor: "#357ae8" },
                  }}
                 
                >
                  Sign in 
                </Button>
              </SignInButton>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit} noValidate>
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
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ mt: 2 }}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : "Complete Signup"}
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default CompleteSignup;