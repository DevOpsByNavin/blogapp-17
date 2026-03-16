import { Router } from 'express';

const router = Router();

// Health endpoint
router.get('/health', (req, res) => {
    res.json({ status: 1 });
});

// Other routes...

export default router;
