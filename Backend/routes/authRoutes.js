import express from 'express';
import User from '../models/User.js';
import multer from "multer";
import jwt from 'jsonwebtoken';

import nodemailer from 'nodemailer';

const router = express.Router();

// Enviar correo electrónico de bienvenida
const sendWelcomeEmail = (email) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ingridcruz312008@gmail.com',
            pass: 'pinguino25ewu',
        },
    });

    const mailOptions = {
        from: 'ingridcruz312008@gmail.com',
        to: email,
        subject: 'Bienvenido a AgroSync',
        text: 'Gracias por registrarte en AgroSync. Tu cuenta ha sido creada exitosamente.',
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error al enviar email:', error);
        } else {
            console.log('Email enviado:', info.response);
        }
    });
};

// Registro de usuario
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El correo electrónico ya está en uso.' });
        }

        const user = new User({
            username: name, // Usamos name como username
            email,
            password
        });
        
        await user.save();

        // Generar token JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'tu_secreto_jwt',
            { expiresIn: '24h' }
        );

        // Comentamos temporalmente el envío de correo para evitar errores
        // sendWelcomeEmail(email);

        // Devolver token junto con mensaje de éxito
        res.status(201).json({
            message: 'Usuario registrado con éxito.',
            token: token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error al registrar:', error);
        res.status(500).json({ 
            message: 'Error al registrar el usuario.', 
            error: error.message 
        });
    }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const isValidPassword = await user.matchPassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'tu_secreto_jwt',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ 
            message: 'Error al iniciar sesión.', 
            error: error.message 
        });
    }
}); 

// Obtener datos del usuario autenticado
router.get('/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
      return res.status(401).json({ message: 'Token de autenticación no proporcionado.' });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_jwt');
      const user = await User.findById(decoded.userId);
      if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      res.json({
          user: {
              id: user._id,
              username: user.username,
              email: user.email,
              imagen: user.imagen // Agregamos la imagen aquí
          }
      });
  } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      res.status(500).json({ message: 'Error al obtener datos del usuario.' });
  }
});


// Actualizar datos del usuario
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // La carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); // Nombre único
    }
  });
  const upload = multer({ storage });
  
  // **Actualizar perfil (PUT)**
  router.put('/profile', upload.single('imagen'), async (req, res) => {
    const { username, email } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ error: 'Token de autenticación no proporcionado.' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_jwt');
      const user = await User.findById(decoded.userId);
  
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }
  
      // Actualizar los datos si fueron proporcionados
      if (username) user.username = username;
      if (email) user.email = email;
      if (req.file) user.imagen = `/uploads/${req.file.filename}`;
  
      await user.save();
  
      res.json({
        message: 'Perfil actualizado correctamente.',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          imagen: user.imagen
        }
      });
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      res.status(500).json({ error: 'Error al actualizar el perfil.' });
    }
  });
  
  // **Crear perfil (POST)**
  router.post('/profile', upload.single('imagen'), async (req, res) => {
    const { username, email } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ error: 'Token de autenticación no proporcionado.' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_jwt');
      const user = await User.findById(decoded.userId);
  
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }
  
      // Actualizar los datos si fueron proporcionados
      if (username) user.username = username;
      if (email) user.email = email;
      if (req.file) user.imagen = `/uploads/${req.file.filename}`;
  
      await user.save();
  
      res.json({
        message: 'Perfil creado correctamente.',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          imagen: user.imagen
        }
      });
    } catch (error) {
      console.error('Error al crear el perfil:', error);
      res.status(500).json({ error: 'Error al crear el perfil.' });
    }
  });
  
  // **Eliminar usuario (DELETE)**
  router.delete('/profile', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Token de autenticación no proporcionado.' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_jwt');
      const user = await User.findById(decoded.userId);
  
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }
  
      await user.remove();
  
      res.json({ message: 'Usuario eliminado correctamente.' });
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      res.status(500).json({ message: 'Error al eliminar el usuario.' });
    }
  });


export default router;
