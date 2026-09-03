import { Router } from 'express';
import { ChatController } from '../controllers/ChatController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', ChatController.sendMessage);
router.get('/', ChatController.getConversations);
router.get('/:id', ChatController.getConversation);
router.delete('/:id', ChatController.deleteConversation);

export default router;
