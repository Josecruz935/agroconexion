import Foro from "../models/Foro.js";

// Crear un nuevo tema
export const crearTema = async (req, res) => {
  try {
    const { tema, descripcion, usuario } = req.body;

    if (!tema || !descripcion || !usuario) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const nuevoTema = new Foro({
      tema,
      descripcion,
      usuario, // Guardamos el nombre directamente
      comentarios: [],
      fecha: new Date(),
    });

    await nuevoTema.save();
    res.status(201).json(nuevoTema);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el tema", error });
  }
};

// Obtener todos los temas con comentarios
export const obtenerTemas = async (req, res) => {
  try {
    const temas = await Foro.find().sort({ fecha: -1 }); // Ordenar por fecha descendente
    res.status(200).json(temas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los temas", error });
  }
};

// Agregar un comentario a un tema
export const agregarComentario = async (req, res) => {
  try {
    const { temaId } = req.params;
    const { usuario, comentario } = req.body;

    if (!usuario || !comentario) {
      return res.status(400).json({ message: "Usuario y comentario son obligatorios" });
    }

    const tema = await Foro.findById(temaId);
    if (!tema) {
      return res.status(404).json({ message: "Tema no encontrado" });
    }

    tema.comentarios.push({ usuario, comentario, fecha: new Date() });
    await tema.save();

    res.status(200).json(tema);
  } catch (error) {
    res.status(500).json({ message: "Error al agregar el comentario", error });
  }
};
