const mongoose = require('mongoose');

const usuarioMapaSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Cada usuario debe ser único
  },
  marcadores: [
    {
      nombreLugar: {
        type: String,
        required: true,
      },
      coordenadas: {
        lat: {
          type: Number,
          required: true,
        },
        lng: {
          type: Number,
          required: true,
        },
      },
      imagenUrl: {
        type: String,
        required: false,
      },
      creadoEn: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  visitas: [
    {
      visitanteEmail: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  creadoEn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('usuarioMapaModel', usuarioMapaSchema);
