const UsuarioMapa = require('../models/usuarioMapaModel');

// Crear o actualizar un usuario y añadir un marcador
const addOrUpdateMarker = async (req, res) => {
  try {
    const { email, nombreLugar, coordenadas, imagenUrl } = req.body;

    // Validar los datos de entrada
    if (!email || !nombreLugar || !coordenadas || !coordenadas.lat || !coordenadas.lng) {
      return res.status(400).json({ message: 'Faltan datos obligatorios.' });
    }

    // Buscar el usuario o crear uno nuevo si no existe
    const usuarioMapa = await UsuarioMapa.findOneAndUpdate(
      { email },
      {
        $push: {
          marcadores: {
            nombreLugar,
            coordenadas,
            imagenUrl,
          },
        },
      },
      { new: true, upsert: true }
    );

    res.status(200).json(usuarioMapa);
  } catch (error) {
    res.status(500).json({ message: 'Error al añadir marcador.', error });
  }
};

// Obtener todos los datos de un usuario (marcadores y visitas)
const getUserMap = async (req, res) => {
  try {
    const { email } = req.params;

    const usuarioMapa = await UsuarioMapa.findOne({ email });

    if (!usuarioMapa) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.status(200).json(usuarioMapa);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el mapa del usuario.', error });
  }
};

const addVisit = async (req, res) => {
  try {
    const { email, visitanteEmail } = req.body;  // Only include email and visitanteEmail

    if (!email || !visitanteEmail) {
      return res.status(400).json({ message: 'Faltan datos obligatorios.' });
    }

    const usuarioMapa = await UsuarioMapa.findOneAndUpdate(
      { email },
      {
        $push: {
          visitas: {
            visitanteEmail,
            timestamp: new Date(),  // Save the timestamp of the visit
          },
        },
      },
      { new: true }
    );

    if (!usuarioMapa) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.status(200).json(usuarioMapa);
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar la visita.', error });
  }
};

// Eliminar un marcador
const deleteMarker = async (req, res) => {
  try {
    const { email, marcadorId } = req.body;

    const usuarioMapa = await UsuarioMapa.findOneAndUpdate(
      { email },
      { $pull: { marcadores: { _id: marcadorId } } },
      { new: true }
    );

    if (!usuarioMapa) {
      return res.status(404).json({ message: 'Usuario o marcador no encontrado.' });
    }

    res.status(200).json(usuarioMapa);
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar marcador.', error });
  }
};

module.exports = {
    addOrUpdateMarker,
    getUserMap,
    addVisit,
    deleteMarker,
};
