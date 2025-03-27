import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import { db } from './config/db.js';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import authRoutes from './routes/authRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import protect from './middleware/authMiddleware.js';
import ForoRoutes from "./routes/ForoRoutes.js";
import riegoRoutes from './controllers/riegoController.js';
import plagaRoutes from "./routes/plagaRoutes.js";
import productRoutes from './routes/productRoutes.js';




dotenv.config();

const app = express();

db();

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' })); 
app.use(express.urlencoded({ extended: true, limit: '100mb' })); 


// Configurar Multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Guarda las imágenes en la carpeta "uploads"
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });
app.post('/api/auth', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se subió ninguna imagen' });
  }
  res.json({ imageUrl: `/uploads/${req.file.filename}` }); // Retorna la URL de la imagen guardada
});
// Ruta para subir imágenes
app.post('/api/upload', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se subió ninguna imagen' });
  }
  res.json({ imageUrl: `/uploads/${req.file.filename}` }); // Retorna la URL de la imagen guardada
});

// Servir archivos estáticos (para ver las imágenes guardadas)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Rutas públicas
app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use("/api/foro", ForoRoutes);
app.use('/api/calendario-riego', riegoRoutes);
app.use("/api/Plagas", plagaRoutes);
app.use('/api/products', productRoutes);

// Rutas protegidas
app.use('/api/crops', protect, cropRoutes);

// Producción (Vue en producción)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(path.resolve(), 'frontend', 'dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve('frontend', 'dist', 'index.html'));
  });
}

// Configuración del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`.green.bold);
});
