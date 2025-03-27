import express from 'express';
import Crop from '../models/crop.js';
const router = express.Router();

// Crear un cultivo
router.post('/', async (req, res) => {
    try {
        const { name, type, plantingDate, estimatedHarvestDate, status, notes, parcel } = req.body;
        const userId = req.user.id;

        const newCrop = new Crop({
            userId,
            name,
            type,
            plantingDate,
            estimatedHarvestDate,
            status: status || 'Plantado',
            notes,
            parcel
        });

        await newCrop.save();
        res.status(201).json(newCrop);
    } catch (error) {
        console.error('Error al crear cultivo:', error);
        res.status(500).json({ 
            message: 'Error al crear el cultivo',
            error: error.message 
        });
    }
});

// Obtener todos los cultivos de un usuario
router.get('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const crops = await Crop.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(crops);
    } catch (error) {
        console.error('Error al obtener cultivos:', error);
        res.status(500).json({ 
            message: 'Error al obtener los cultivos',
            error: error.message 
        });
    }
});

// Obtener un cultivo específico
router.get('/:id', async (req, res) => {
    try {
        const crop = await Crop.findOne({ 
            _id: req.params.id,
            userId: req.user.id
        });
        
        if (!crop) {
            return res.status(404).json({ message: 'Cultivo no encontrado' });
        }
        
        res.status(200).json(crop);
    } catch (error) {
        console.error('Error al obtener el cultivo:', error);
        res.status(500).json({ 
            message: 'Error al obtener el cultivo',
            error: error.message 
        });
    }
});

// Actualizar un cultivo
router.put('/:id', async (req, res) => {
    try {
        const { name, type, plantingDate, estimatedHarvestDate, status, notes, parcel } = req.body;
        
        const crop = await Crop.findOneAndUpdate(
            { 
                _id: req.params.id,
                userId: req.user.id
            },
            {
                name,
                type,
                plantingDate,
                estimatedHarvestDate,
                status,
                notes,
                parcel
            },
            { new: true }
        );

        if (!crop) {
            return res.status(404).json({ message: 'Cultivo no encontrado' });
        }

        res.status(200).json(crop);
    } catch (error) {
        console.error('Error al actualizar el cultivo:', error);
        res.status(500).json({ 
            message: 'Error al actualizar el cultivo',
            error: error.message 
        });
    }
});

// Eliminar un cultivo
router.delete('/:id', async (req, res) => {
    try {
        const crop = await Crop.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!crop) {
            return res.status(404).json({ message: 'Cultivo no encontrado' });
        }

        res.status(200).json({ message: 'Cultivo eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el cultivo:', error);
        res.status(500).json({ 
            message: 'Error al eliminar el cultivo',
            error: error.message 
        });
    }
});

export default router;
