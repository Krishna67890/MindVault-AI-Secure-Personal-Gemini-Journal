import { Router } from 'express';
import { GrowthController } from '../controllers/GrowthController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/insights', GrowthController.getInsights);
router.post('/insights/generate', GrowthController.generateInsights);
router.get('/weekly-reflection', GrowthController.getWeeklyReflections);
router.post('/weekly-reflection', GrowthController.generateWeeklyReflection);

export default router;
