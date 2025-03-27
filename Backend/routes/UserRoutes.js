import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

;// Backend: ruta para obtener el perfil
router.get('/profile/:id', protect, getUserProfile);


// Actualizar perfil del usuario (ruta protegida)
router.put('/profile', protect, updateUserProfile);

export default router;
