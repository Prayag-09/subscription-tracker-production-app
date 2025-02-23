import express from 'express';

const router = express.Router();

router.post('/sign-in', authController.signIn);
router.post('/sign-up', authController.signUp);
router.post('/sign-out', authController.signOut);

export default router;
