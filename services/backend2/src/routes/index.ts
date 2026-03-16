import { Router } from 'express';

import blogRoutes from './blogRoutes';
import commentRoutes from './commentRoutes';

const router = Router();

// Health endpoint
router.get('/health', (req, res) => {
    res.json({ status: 1 });
});

// Other routes...
router.use('/api/blogs', blogRoutes);
router.use('/api/comments', commentRoutes);

export default router;
