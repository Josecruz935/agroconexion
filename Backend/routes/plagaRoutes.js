import express from "express";
import multer from "multer";
import Plaga from "../models/Plaga.js";

const router = express.Router();

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Nombre único
  }
});
const upload = multer({ storage });

// Obtener todas las plagas
router.get("/", async (req, res) => {
  try {
    const plagas = await Plaga.find();
    res.json(plagas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las plagas" });
  }
});

// Agregar una nueva plaga con imagen
router.post("/", upload.single("imagen"), async (req, res) => {
  try {
    const { nombre, cultivos, sintomas, control } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    const nuevaPlaga = new Plaga({ nombre, cultivos, sintomas, control, imagen });
    await nuevaPlaga.save();

    res.status(201).json(nuevaPlaga);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar la plaga" });
  }
});

// Obtener una plaga por ID
router.get("/:id", async (req, res) => {
  try {
    const plaga = await Plaga.findById(req.params.id);
    if (!plaga) return res.status(404).json({ error: "Plaga no encontrada" });

    res.json(plaga);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la plaga" });
  }
});

// Eliminar una plaga
router.delete("/:id", async (req, res) => {
  try {
    const plaga = await Plaga.findByIdAndDelete(req.params.id);
    if (!plaga) return res.status(404).json({ error: "Plaga no encontrada" });

    res.json({ message: "Plaga eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la plaga" });
  }
});

export default router;
