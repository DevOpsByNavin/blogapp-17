import { Router } from 'express';

import userRoutes from './userRoutes';

const router = Router();

router.use('/api/users', userRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 1 });
});

export default router;