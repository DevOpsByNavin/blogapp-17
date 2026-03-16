import { Router } from 'express';
import { createBlog, getAllBlogs, getBlog } from '../controllers/blogController';
// Import your Clerk (or auth) middleware
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const router = Router();

// Protect only the createBlog route
router.post('/', ClerkExpressRequireAuth(), createBlog);
router.get('/', getAllBlogs);
router.get('/:id', getBlog);

export default router;
