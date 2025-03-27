import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Obtener el token del header
  
  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó token' });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_jwt');
    
    // Buscar el usuario por ID
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    req.user = user; // Guardar los datos del usuario en la solicitud
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};



export default protect;
