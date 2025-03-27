import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    name: { 
        type: String, 
        required: true,
        trim: true
    },
    type: { 
        type: String, 
        required: true,
        trim: true
    },
    plantingDate: { 
        type: Date, 
        required: true 
    },
    estimatedHarvestDate: { 
        type: Date, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Plantado', 'En Crecimiento', 'Listo para Cosechar', 'Cosechado'],
        default: 'Plantado'
    },
    notes: {
        type: String,
        trim: true
    },
    parcel: {
        coordinates: [{
            lat: Number,
            lng: Number
        }],
        area: Number
    }
}, {
    timestamps: true
});

export default mongoose.model('Crop', cropSchema);
