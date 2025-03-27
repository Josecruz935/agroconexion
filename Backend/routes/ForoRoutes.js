import express from "express";
import Foro from '../models/Foro.js';

const router = express.Router();
// Crear un nuevo tema
router.post("/", async (req, res) => {
    try {
      const { tema, descripcion, usuario } = req.body;
      if (!tema || !descripcion || !usuario) {
        return res.status(400).json({ error: "Todos los campos son requeridos" });
      }
  
      const nuevoTema = new Foro({ tema, descripcion, usuario });
      await nuevoTema.save();
      res.status(201).json(nuevoTema);
    } catch (error) {
      res.status(500).json({ error: "Error al crear el tema" });
    }
  });
  
  // Obtener todos los temas
  router.get("/", async (req, res) => {
    try {
      const temas = await Foro.find();
      res.json(temas);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los temas" });
    }
  });
  
  // Agregar un comentario a un tema
  router.post("/:temaId/comentarios", async (req, res) => {
    try {
      const { temaId } = req.params;
      const { usuario, texto } = req.body;
  
      if (!usuario || !texto) {
        return res.status(400).json({ error: "El usuario y el comentario son requeridos" });
      }
  
      const tema = await Foro.findById(temaId);
      if (!tema) {
        return res.status(404).json({ error: "Tema no encontrado" });
      }
  
      tema.comentarios.push({ usuario, texto, fecha: new Date() });
      await tema.save();
  
      res.status(201).json(tema);
    } catch (error) {
      res.status(500).json({ error: "Error al agregar el comentario" });
    }
  });
  
  // Actualizar un tema
  router.put("/:temaId", async (req, res) => {
    try {
      const { temaId } = req.params;
      const { tema, descripcion } = req.body;
  
      const temaActualizado = await Foro.findByIdAndUpdate(
        temaId,
        { tema, descripcion },
        { new: true }
      );
  
      if (!temaActualizado) {
        return res.status(404).json({ error: "Tema no encontrado" });
      }
  
      res.json(temaActualizado);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el tema" });
    }
  });
  
  // Eliminar un tema
  router.delete("/:temaId", async (req, res) => {
    try {
      const { temaId } = req.params;
  
      const temaEliminado = await Foro.findByIdAndDelete(temaId);
      if (!temaEliminado) {
        return res.status(404).json({ error: "Tema no encontrado" });
      }
  
      res.json({ mensaje: "Tema eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el tema" });
    }
  });
  
  export default router;
