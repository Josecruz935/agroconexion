import mongoose from "mongoose";

const PlagaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  cultivos: { type: String, required: true },
  sintomas: { type: String, required: true },
  control: { type: String, required: true },
  imagen: { type: String, required: false } // URL de la imagen
});

const Plaga = mongoose.model("Plaga", PlagaSchema);

export default Plaga;
