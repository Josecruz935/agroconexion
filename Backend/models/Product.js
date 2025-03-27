import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  user: { type: String, required: true },
  type: { type: String, enum: ["venta", "intercambio"], required: true },
  imageUrl: { type: String, required: true }, // URL de la imagen del producto
  contacto: { type: Number, required: true },
});

export default mongoose.model("Product", productSchema);
