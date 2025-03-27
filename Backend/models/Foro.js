import mongoose from "mongoose";

const foroSchema = new mongoose.Schema({
  tema: { type: String, required: true },
  descripcion: { type: String, required: true },
  usuario: { type: String, required: true }, // Asegúrate de que el campo coincide
  comentarios: { type: Array, default: [] },
  fecha: { type: Date, default: Date.now },
});

export default mongoose.model("Foro", foroSchema);
