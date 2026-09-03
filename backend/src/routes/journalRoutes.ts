import { Router } from 'express';
import { JournalController } from '../controllers/JournalController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', JournalController.createEntry);
router.get('/', JournalController.getEntries);
router.get('/:id', JournalController.getEntry);
router.put('/:id', JournalController.updateEntry);
router.delete('/:id', JournalController.deleteEntry);
router.post('/analyze', JournalController.analyzeEntry);

export default router;
