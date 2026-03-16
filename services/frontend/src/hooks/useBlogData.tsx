import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
const APP_URL = import.meta.env.VITE_API_URL; 
interface Blog {
  id: number;
  title: string;
  content: string;
  authorId: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
}

interface BlogComment {
  id: number;
  content: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
}

// BLOG API (localhost:3001)
const BLOG_API = `${APP_URL}/api/blogs`;
const COMMENTS_API = `${APP_URL}/api/comments`;
// USER API (localhost:3000)
const USER_API = `${APP_URL}/api/users`;

export function useBlog(id?: string) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get(`${BLOG_API}/${id}`)
      .then((res) => setBlog(res.data))
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { blog, loading, error };
}

export function useBlogComments(id?: string) {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get(`${COMMENTS_API}/${id}`)
      .then((res) => setComments(res.data))
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { comments, loading, error };
}

export function useAllBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(BLOG_API)
      .then((res) => setBlogs(res.data))
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setLoading(false));
  }, []);

  return { blogs, loading, error };
}

// Example: fetch user by id with Clerk session (for use in CreateBlog, etc.)
export function useUserById(userId?: string) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    (async () => {
      try {
        const token = await getToken();
        const res = await axios.get(`${USER_API}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId, getToken]);

  return { user, loading, error };
}