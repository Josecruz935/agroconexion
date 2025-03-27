import mongoose from 'mongoose';

const riegoSchema = new mongoose.Schema({
    cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    irrigationDates: [Date],
    fertilizationDates: [Date],
}, { timestamps: true });

export default mongoose.model('RiegoSchema', riegoSchema);
