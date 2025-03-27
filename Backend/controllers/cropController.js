import Crop from '../models/crop.js' 



// Obtener todos los cultivos del usuario
const getCrops = async (req, res) => {
    try {
        const crops = await Crop.find({ user: req.user._id })
        res.json(crops)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al obtener los cultivos' })
    }
}

// Obtener un cultivo específico
const getCrop = async (req, res) => {
    try {
        const crop = await Crop.findById(req.params.id)
        
        if (!crop) {
            return res.status(404).json({ message: 'Cultivo no encontrado' })
        }

        if (crop.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'No autorizado' })
        }

        res.json(crop)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al obtener el cultivo' })
    }
}

// Crear un nuevo cultivo
const createCrop = async (req, res) => {
    try {
        const { 
            name, 
            type, 
            plantingDate, 
            expectedHarvestDate, 
            notes,
            parcel,
            location 
        } = req.body

        const crop = await Crop.create({
            name,
            type,
            plantingDate,
            expectedHarvestDate,
            notes,
            parcel,
            location,
            user: req.user._id
        })

        res.status(201).json(crop)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al crear el cultivo' })
    }
}

// Actualizar un cultivo
const updateCrop = async (req, res) => {
    try {
        const crop = await Crop.findById(req.params.id)

        if (!crop) {
            return res.status(404).json({ message: 'Cultivo no encontrado' })
        }

        if (crop.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'No autorizado' })
        }

        const updatedCrop = await Crop.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )

        res.json(updatedCrop)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al actualizar el cultivo' })
    }
}

// Eliminar un cultivo
const deleteCrop = async (req, res) => {
    try {
        const crop = await Crop.findById(req.params.id)

        if (!crop) {
            return res.status(404).json({ message: 'Cultivo no encontrado' })
        }

        if (crop.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'No autorizado' })
        }

        await crop.deleteOne()
        res.json({ message: 'Cultivo eliminado' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al eliminar el cultivo' })
    }
}

export {
    getCrops,
    getCrop,
    createCrop,
    updateCrop,
    deleteCrop,
    
}
