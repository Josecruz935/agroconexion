import express from 'express';
import riegoSchedule from '../models/riego.js';
import authMiddleware from '../middleware/authMiddleware.js'; // Importar autenticación

const router = express.Router();

// Aplicar middleware a todas las rutas
router.use(authMiddleware);

// Obtener el calendario de riego y fertilización por cultivo
router.get('/:cropId', async (req, res) => {
    try {
        const { cropId } = req.params;
        const userId = req.user.id;

        const schedule = await riegoSchedule.findOne({ cropId, userId });

        if (!schedule) {
            return res.status(404).json({ message: 'Calendario de riego no encontrado' });
        }

        res.status(200).json(schedule);
    } catch (error) {
        console.error('Error al obtener calendario:', error);
        res.status(500).json({ message: 'Error al obtener el calendario', error: error.message });
    }
});
router.post('/:cropId', async (req, res) => {
    try {
        console.log('📌 Datos recibidos en el backend:', req.body);

        const { irrigationDates, fertilizationDates } = req.body;
        const { cropId } = req.params;
        const userId = req.user.id;

        if (!irrigationDates || !fertilizationDates) {
            return res.status(400).json({ message: "❌ Faltan datos de riego o fertilización" });
        }

        let schedule = await riegoSchedule.findOne({ cropId, userId });

        if (!schedule) {
            schedule = new riegoSchedule({
                cropId,
                userId,
                irrigationDates,
                fertilizationDates
            });
        } else {
            schedule.irrigationDates = irrigationDates;
            schedule.fertilizationDates = fertilizationDates;
        }

        await schedule.save();
        console.log("✅ Fechas guardadas en la base de datos:", schedule);
        res.status(200).json(schedule);
    } catch (error) {
        console.error('❌ Error al guardar en la base de datos:', error);
        res.status(500).json({ message: 'Error al actualizar el calendario', error: error.message });
    }
});

router.put('/:cropId/:dateType', async (req, res) => {
    try {
        const { cropId, dateType } = req.params;
        const { newDate, oldDate } = req.body; // newDate es la nueva fecha, oldDate es la fecha a actualizar
        const userId = req.user.id;

        if (!newDate || !oldDate) {
            return res.status(400).json({ message: "❌ Faltan los datos necesarios para actualizar la fecha" });
        }

        const schedule = await riegoSchedule.findOne({ cropId, userId });

        if (!schedule) {
            return res.status(404).json({ message: 'Calendario de riego no encontrado' });
        }

        // Si la fecha es de riego
        if (dateType === 'irrigation') {
            const index = schedule.irrigationDates.indexOf(oldDate);
            if (index !== -1) {
                schedule.irrigationDates[index] = newDate;
            } else {
                return res.status(404).json({ message: 'Fecha de riego no encontrada' });
            }
        }
        // Si la fecha es de fertilización
        if (dateType === 'fertilization') {
            const index = schedule.fertilizationDates.indexOf(oldDate);
            if (index !== -1) {
                schedule.fertilizationDates[index] = newDate;
            } else {
                return res.status(404).json({ message: 'Fecha de fertilización no encontrada' });
            }
        }

        await schedule.save();
        console.log("✅ Fechas actualizadas en la base de datos:", schedule);
        res.status(200).json(schedule);
    } catch (error) {
        console.error('❌ Error al actualizar la fecha:', error);
        res.status(500).json({ message: 'Error al actualizar la fecha', error: error.message });
    }
});

router.delete('/:cropId/:dateType', async (req, res) => {
    try {
      const { cropId, dateType } = req.params;
      const { date } = req.body; // Fecha a eliminar
      const userId = req.user.id;
  
      if (!date) {
        return res.status(400).json({ message: "❌ Faltan datos de la fecha a eliminar" });
      }
  
      const schedule = await riegoSchedule.findOne({ cropId, userId });
  
      if (!schedule) {
        return res.status(404).json({ message: 'Calendario de riego no encontrado' });
      }
  
      // Eliminar la fecha de riego
      if (dateType === 'irrigation') {
        const index = schedule.irrigationDates.indexOf(date);
        if (index !== -1) {
          schedule.irrigationDates.splice(index, 1);
        } else {
          return res.status(404).json({ message: 'Fecha de riego no encontrada' });
        }
      }
  
      // Eliminar la fecha de fertilización
      if (dateType === 'fertilization') {
        const index = schedule.fertilizationDates.indexOf(date);
        if (index !== -1) {
          schedule.fertilizationDates.splice(index, 1);
        } else {
          return res.status(404).json({ message: 'Fecha de fertilización no encontrada' });
        }
      }
  
      await schedule.save();
      console.log("✅ Fecha eliminada de la base de datos:", schedule);
      res.status(200).json(schedule);
    } catch (error) {
      console.error('❌ Error al eliminar la fecha:', error);
      res.status(500).json({ message: 'Error al eliminar la fecha', error: error.message });
    }
  });
  


export default router;
